import type { Language } from './i18n';

// Article identifiers, not fact content. Facts are extracted from Wikipedia at runtime.
const articles: Record<Language, readonly string[]> = {
  en: ['Sun', 'Mercury (planet)', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  vi: ['Mặt Trời', 'Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương'],
};

export type FactCandidate = { text: string; section: string };
export type ArticleTopic = 'formation' | 'interior' | 'surface' | 'atmosphere' | 'orbit' | 'moons' | 'life' | 'exploration' | 'other';
export type ArticleSection = { id: string; title: string; path: string[]; paragraphs: string[]; topic: ArticleTopic };
export type FactPool = {
  candidates: FactCandidate[];
  sections: ArticleSection[];
  title: string;
  sourceUrl: string;
  historyUrl: string;
  fetchedAt: number;
};
export type WikipediaFact = FactCandidate & { title: string; sourceUrl: string; historyUrl: string };

const cache = new Map<string, FactPool>();
export const factCacheDuration = 15 * 60 * 1000;
const excludedSections = /^(see also|notes?(?: and references)?|references|citations|bibliography|further reading|external links|footnotes|sources|gallery|xem thêm|chú thích|ghi chú|tham khảo|tài liệu tham khảo|liên kết ngoài|đọc thêm|hình ảnh|thư mục)$/iu;
const dependentStart = /^(it|its|this|these|those|they|their|however|therefore|also|for example|such|he|she|his|her|nó|chúng|điều này|chúng ta|tuy nhiên|do đó|vì vậy|ngoài ra|ví dụ|ông|bà)(?=\s|[,;:])/iu;

const topicRules: [ArticleTopic, RegExp][] = [
  ['formation', /formation|evolution|natural history|life phases|main sequence|hydrogen exhaustion|hình thành|tiến hóa|vòng đời|sao trẻ/iu],
  ['life', /habitabil|habitation|biosphere|origin of life|possibility of life|sự sống|sinh quyển|sinh sống/iu],
  ['moons', /moon|satellite|rings|vệ tinh|mặt trăng|vành đai/iu],
  ['atmosphere', /atmosphere|climate|weather|cloud|storm|wind|corona|photosphere|chromosphere|heliosphere|troposphere|khí quyển|khí hậu|thời tiết|mây|bão|gió|nhật hoa|quang quyển|sắc quyển|nhật quyển|hàn quyển/iu],
  ['surface', /geolog|geograph|surface|crust|tectonic|volcan|crater|hydro|water|topograph|địa chất|địa lý|bề mặt|kiến tạo|núi lửa|hố va chạm|nước|thủy quyển/iu],
  ['interior', /internal|structure|composition|core|magnet|heat|radiative|convect|chemical|cấu trúc|cấu tạo|lõi|từ trường|từ quyển|thành phần|bức xạ|đối lưu|nội nhiệt/iu],
  ['orbit', /orbit|rotation|axial|resonance|motion|gravit|quỹ đạo|tự quay|độ nghiêng|chuyển động|hấp dẫn|cộng hưởng/iu],
  ['exploration', /observ|explor|mission|discovery|history|telescope|spaceflight|mariner|messenger|voyager|cassini|juno|galileo|bepicolombo|quan sát|thám hiểm|khám phá|sứ mệnh|nhiệm vụ|lịch sử|phát hiện|hiểu biết|thiên văn/iu],
];

// Keep article paragraphs together: the reading view is not sentence-randomized.
export function extractArticleSections(extract: string, language: Language): ArticleSection[] {
  const result: ArticleSection[] = [];
  const ancestors: { depth: number; title: string; topic: ArticleTopic }[] = [];
  let current: ArticleSection = { id: 'section-0', title: language === 'vi' ? 'Tổng quan' : 'Overview', path: [], paragraphs: [], topic: 'other' };
  let excludedDepth: number | null = null;
  const commit = () => { if (current.paragraphs.length) result.push(current); };
  let number = 0;
  for (const line of extract.split(/\r?\n/u)) {
    const text = line.trim();
    const heading = /^(={2,6})\s*(.*?)\s*\1$/u.exec(text);
    if (heading) {
      commit();
      const depth = heading[1].length;
      while (ancestors.length && ancestors[ancestors.length - 1].depth >= depth) ancestors.pop();
      if (excludedDepth !== null && depth <= excludedDepth) excludedDepth = null;
      if (excludedDepth === null && (excludedSections.test(heading[2]) || /^danh mục tài liệu$/iu.test(heading[2]))) excludedDepth = depth;
      const topic = topicRules.find(([, pattern]) => pattern.test(heading[2]))?.[0] ?? ancestors.at(-1)?.topic ?? 'other';
      current = { id: `section-${++number}`, title: heading[2], path: ancestors.map(parent => parent.title), paragraphs: [], topic };
      ancestors.push({ depth, title: heading[2], topic });
      continue;
    }
    // TextExtracts cannot faithfully render equations and tables. Link to the original for those.
    if (excludedDepth !== null || !text || /[{}<>|\\]|\b(?:ISBN|doi)\b/u.test(text) || text.length < 25) continue;
    const paragraph = text.replace(/\[\d+(?:[,– -]\d+)*\]/gu, '').replace(/\s+/gu, ' ').trim();
    current.paragraphs.push(paragraph);
  }
  commit();
  return result;
}

export function searchArticleSections(sections: ArticleSection[], topic: ArticleTopic | 'all', query: string): ArticleSection[] {
  const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/giu, 'd').toLowerCase();
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean);
  return sections.filter(section => (topic === 'all' || section.topic === topic) && terms.every(term => normalize([...section.path, section.title, ...section.paragraphs].join(' ')).includes(term)));
}

export function extractFactCandidates(extract: string, language: Language): FactCandidate[] {
  const result: FactCandidate[] = [];
  const seen = new Set<string>();
  let section = language === 'vi' ? 'Tổng quan' : 'Overview';
  let excludedDepth: number | null = null;
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(language, { granularity: 'sentence' }) : null;

  for (const line of extract.split(/\r?\n/u)) {
    const paragraph = line.trim();
    const heading = /^(={2,6})\s*(.*?)\s*\1$/u.exec(paragraph);
    if (heading) {
      const depth = heading[1].length;
      if (excludedDepth !== null && depth <= excludedDepth) excludedDepth = null;
      if (excludedDepth === null && excludedSections.test(heading[2])) excludedDepth = depth;
      section = heading[2];
      continue;
    }
    if (excludedDepth !== null || paragraph.length < 85 || /[{}<>|\\]|https?:\/\/|ISBN|\bdoi\b/u.test(paragraph)) continue;
    const clean = paragraph.replace(/\[\d+(?:[,– -]\d+)*\]/gu, '').replace(/\s+/gu, ' ').trim();
    const sentences = segmenter ? Array.from(segmenter.segment(clean), item => item.segment.trim()) : clean.match(/[^.!?]+[.!?]+(?:["”’)]|$)?/gu) ?? [];
    for (const sentence of sentences) {
      const text = sentence.trim();
      if (text.length < 85 || text.length > 560 || !/[.!?…]["”’)]?$/u.test(text) || dependentStart.test(text) || seen.has(text)) continue;
      seen.add(text);
      result.push({ text, section });
    }
  }
  return result;
}

export function drawFact(pool: FactPool, seen: Set<string>, lastText?: string, random = Math.random): WikipediaFact {
  if (!pool.candidates.length) throw new Error('No suitable Wikipedia extracts.');
  let available = pool.candidates.filter(fact => !seen.has(fact.text));
  if (!available.length) {
    seen.clear();
    available = pool.candidates.filter(fact => fact.text !== lastText);
    if (!available.length) available = pool.candidates;
  }
  const index = Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)));
  const chosen = available[index];
  seen.add(chosen.text);
  return { ...chosen, title: pool.title, sourceUrl: pool.sourceUrl, historyUrl: pool.historyUrl };
}

export async function getFactPool(bodyIndex: number, language: Language, signal: AbortSignal): Promise<FactPool> {
  const title = articles[language]?.[bodyIndex];
  if (!title) throw new Error('Unsupported planet or language.');
  if (signal.aborted) throw new DOMException('Request cancelled.', 'AbortError');
  const key = `${language}:${bodyIndex}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < factCacheDuration) return cached;

  const origin = `https://${language}.wikipedia.org`;
  const query = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', prop: 'extracts|info', explaintext: '1', exsectionformat: 'wiki', inprop: 'url', redirects: '1', titles: title, origin: '*', maxlag: '5' });
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  const timeout = setTimeout(cancel, 12000);
  try {
    const response = await fetch(`${origin}/w/api.php?${query}`, {
      signal: controller.signal,
      credentials: 'omit',
      headers: typeof window === 'undefined' ? {} : { 'Api-User-Agent': `OrbitSolarExplorer/1.0 (${window.location.origin})` },
    });
    if (!response.ok) throw new Error(`Wikipedia HTTP ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(`Wikipedia API: ${data.error.code ?? 'unavailable'}`);
    const page = data.query?.pages?.[0];
    if (!page || page.missing || typeof page.extract !== 'string' || typeof page.title !== 'string') throw new Error('Wikipedia article unavailable.');
    const candidates = extractFactCandidates(page.extract, language);
    if (!candidates.length) throw new Error('No suitable Wikipedia extracts.');
    if (signal.aborted) throw new DOMException('Request cancelled.', 'AbortError');
    // Construct links on a trusted Wikipedia origin instead of accepting external URLs.
    const source = new URL('/w/index.php', origin);
    source.searchParams.set('title', page.title);
    if (Number.isSafeInteger(page.lastrevid) && page.lastrevid > 0) source.searchParams.set('oldid', String(page.lastrevid));
    const history = new URL('/w/index.php', origin);
    history.searchParams.set('title', page.title);
    history.searchParams.set('action', 'history');
    const pool: FactPool = { candidates, sections: extractArticleSections(page.extract, language), title: page.title, sourceUrl: source.href, historyUrl: history.href, fetchedAt: Date.now() };
    cache.set(key, pool);
    return pool;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
  }
}
