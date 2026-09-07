'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, Search, X } from 'lucide-react';
import type { Language } from './i18n';
import { RandomPlanetFact } from './random-planet-fact';
import { getFactPool, searchArticleSections, type ArticleTopic, type FactPool } from './wikipedia-facts';

const topics: { id: ArticleTopic | 'all'; en: string; vi: string }[] = [
  { id: 'all', en: 'All topics', vi: 'Tất cả' },
  { id: 'formation', en: 'Formation & evolution', vi: 'Hình thành & tiến hóa' },
  { id: 'interior', en: 'Interior & magnetism', vi: 'Cấu trúc & từ trường' },
  { id: 'surface', en: 'Surface & water', vi: 'Bề mặt & nước' },
  { id: 'atmosphere', en: 'Atmosphere & climate', vi: 'Khí quyển & khí hậu' },
  { id: 'orbit', en: 'Orbit & rotation', vi: 'Quỹ đạo & tự quay' },
  { id: 'moons', en: 'Moons & rings', vi: 'Vệ tinh & vành đai' },
  { id: 'life', en: 'Life & habitability', vi: 'Sự sống' },
  { id: 'exploration', en: 'Observation & exploration', vi: 'Quan sát & khám phá' },
  { id: 'other', en: 'More topics', vi: 'Chủ đề khác' },
];

export function PlanetKnowledge({ bodyIndex, language }: { bodyIndex: number; language: Language }) {
  const vi = language === 'vi';
  const id = useId();
  const [pool, setPool] = useState<FactPool | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [topic, setTopic] = useState<ArticleTopic | 'all'>('all');
  const [query, setQuery] = useState('');
  const [expansion, setExpansion] = useState<'default' | 'all' | 'none'>('default');
  const retry = () => { setStatus('loading'); setAttempt(value => value + 1); };

  useEffect(() => {
    const controller = new AbortController();
    void getFactPool(bodyIndex, language, controller.signal).then(article => {
      if (!controller.signal.aborted) { setPool(article); setStatus('ready'); }
    }).catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, [bodyIndex, language, attempt]);

  const sections = useMemo(() => searchArticleSections(pool?.sections ?? [], topic, query), [pool, topic, query]);
  const availableTopics = topics.filter(item => item.id === 'all' || pool?.sections.some(section => section.topic === item.id));
  const readingMinutes = pool ? Math.ceil(pool.sections.reduce((total, section) => total + section.paragraphs.join(' ').split(/\s+/u).length, 0) / (vi ? 350 : 220)) : 0;

  return <>
    <RandomPlanetFact key={pool?.fetchedAt ?? 'waiting'} pool={pool} status={status} onRetry={retry} language={language} />
    <section className="dossier-section encyclopedia" aria-labelledby={`${id}-title`} aria-busy={status === 'loading'}>
      <div className="encyclopedia-heading"><h3 id={`${id}-title`}><BookOpen size={19} aria-hidden="true" />{vi ? 'Khám phá chuyên sâu' : 'The deeper story'}</h3><span>WIKIPEDIA</span></div>
      <p className="encyclopedia-intro">{vi ? 'Đọc theo chủ đề hoặc tìm điều bạn muốn biết trong bài viết. Mở từng mục để xem các đoạn nội dung chi tiết.' : 'Browse by topic or search the article for what you want to know. Open a section to read its detailed paragraphs.'}</p>
      {status === 'loading' && !pool && <output>{vi ? 'Đang tải các chương kiến thức…' : 'Loading the knowledge chapters…'}</output>}
      {status === 'error' && !pool && <div className="encyclopedia-empty"><p>{vi ? 'Chưa tải được bài viết. Phần hình thành và lịch sử khám phá vẫn có sẵn trong hồ sơ.' : 'The article could not be loaded. Formation and exploration summaries remain available in this profile.'}</p><button type="button" onClick={retry}>{vi ? 'Tải lại bài viết' : 'Retry article'}</button></div>}
      {pool && <>
        <div className="encyclopedia-meta"><span>{pool.sections.length} {vi ? 'mục kiến thức' : 'sections'}</span><span>~{readingMinutes} {vi ? 'phút đọc' : 'min read'}</span><span>{language.toUpperCase()}</span></div>
        <div className="encyclopedia-tools">
          <div className="encyclopedia-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label={vi ? 'Tìm trong bài viết' : 'Search the article'} placeholder={vi ? 'Tìm: hình thành, lõi, nước, sự sống…' : 'Search: formation, core, water, life…'} value={query} onChange={event => { setQuery(event.target.value); setTopic('all'); }} />{query && <button type="button" onClick={() => setQuery('')} aria-label={vi ? 'Xóa tìm kiếm' : 'Clear search'}><X size={15} /></button>}</div>
          <fieldset className="encyclopedia-topics"><legend className="sr-only">{vi ? 'Lọc theo chủ đề' : 'Filter by topic'}</legend>{availableTopics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); setExpansion('default'); }}>{item[language]}</button>)}</fieldset>
        </div>
        <div className="encyclopedia-results"><output>{sections.length} {vi ? 'mục phù hợp' : 'matching sections'}</output><button type="button" onClick={() => setExpansion(value => value === 'all' ? 'none' : 'all')} disabled={!sections.length}>{expansion === 'all' ? (vi ? 'Thu gọn tất cả' : 'Collapse all') : (vi ? 'Mở tất cả' : 'Expand all')}</button></div>
        <div className="encyclopedia-chapters" key={`${topic}:${query}:${expansion}`}>
          {sections.map((section, index) => <details className="encyclopedia-chapter" key={section.id} open={expansion === 'all' || (expansion === 'default' && index === 0) || undefined}>
            <summary><span><small>{section.path.join(' / ') || (vi ? 'Bài viết' : 'Article')}</small><strong>{section.title}</strong></span><ChevronDown size={17} aria-hidden="true" /></summary>
            <div className="encyclopedia-prose">{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
          </details>)}
        </div>
        {!sections.length && <div className="encyclopedia-empty"><p>{vi ? 'Không tìm thấy mục phù hợp. Thử từ khóa ngắn hơn hoặc chọn chủ đề khác.' : 'No matching sections. Try a shorter search or a different topic.'}</p><button type="button" onClick={() => { setQuery(''); setTopic('all'); }}>{vi ? 'Xem tất cả nội dung' : 'Show all content'}</button></div>}
        <footer className="encyclopedia-credit"><a href={pool.sourceUrl} target="_blank" rel="noreferrer">{pool.title} · {vi ? 'Bài gốc' : 'Original article'}<ExternalLink size={13} aria-hidden="true" /></a><p>{vi ? 'Văn bản từ ' : 'Text by '}<a href={pool.historyUrl} target="_blank" rel="noreferrer">{vi ? 'cộng đồng Wikipedia' : 'Wikipedia contributors'}</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. {vi ? 'Đã sắp xếp theo chủ đề và lược bỏ định dạng, công thức, bảng và danh mục tham khảo. Xem bài gốc để đọc các phần đó và kiểm tra nguồn trích dẫn. Hai phiên bản ngôn ngữ có thể khác nhau.' : 'Organized by topic; formatting, formulas, tables, and reference lists are omitted. See the original for those elements and citations. Language editions may differ.'}</p></footer>
      </>}
    </section>
  </>;
}
