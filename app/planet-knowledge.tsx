'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, Search, X } from 'lucide-react';
import type { Language } from './i18n';
import { RandomPlanetFact } from './random-planet-fact';
import { getFactPool, searchArticleSections, type ArticleTopic, type FactPool } from './wikipedia-facts';
import { readingPreview } from './reading-preview';

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
  const [visibleCount, setVisibleCount] = useState(6);
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

  return <>
    <RandomPlanetFact key={pool?.fetchedAt ?? 'waiting'} pool={pool} status={status} onRetry={retry} language={language} />
    <section className="dossier-section encyclopedia" aria-labelledby={`${id}-title`} aria-busy={status === 'loading'}>
      <div className="encyclopedia-heading"><h3 id={`${id}-title`}><BookOpen size={19} aria-hidden="true" />{vi ? 'Khám phá chuyên sâu' : 'The deeper story'}</h3><span>WIKIPEDIA</span></div>
      <p className="encyclopedia-intro">{vi ? 'Mỗi thẻ một trích đoạn ngắn. Mở thêm khi bạn tò mò.' : 'One short excerpt per card. Open more when curiosity strikes.'}</p>
      {status === 'loading' && !pool && <output>{vi ? 'Đang tải các chương kiến thức…' : 'Loading the knowledge chapters…'}</output>}
      {status === 'error' && !pool && <div className="encyclopedia-empty"><p>{vi ? 'Chưa tải được bài viết. Phần hình thành và lịch sử khám phá vẫn có sẵn trong hồ sơ.' : 'The article could not be loaded. Formation and exploration summaries remain available in this profile.'}</p><button type="button" onClick={retry}>{vi ? 'Tải lại bài viết' : 'Retry article'}</button></div>}
      {pool && <>
        <div className="encyclopedia-tools">
          <div className="encyclopedia-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label={vi ? 'Tìm trong bài viết' : 'Search the article'} placeholder={vi ? 'Tìm: hình thành, lõi, nước…' : 'Search: formation, core, water…'} value={query} onChange={event => { setQuery(event.target.value); setTopic('all'); setVisibleCount(6); }} />{query && <button type="button" onClick={() => { setQuery(''); setVisibleCount(6); }} aria-label={vi ? 'Xóa tìm kiếm' : 'Clear search'}><X size={15} /></button>}</div>
          <fieldset className="encyclopedia-topics"><legend className="sr-only">{vi ? 'Lọc theo chủ đề' : 'Filter by topic'}</legend>{availableTopics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); setVisibleCount(6); }}>{item[language]}</button>)}</fieldset>
        </div>
        <div className="encyclopedia-results"><output>{Math.min(visibleCount, sections.length)} / {sections.length} {vi ? 'thẻ kiến thức' : 'knowledge cards'}</output><span>{language.toUpperCase()} · WIKIPEDIA</span></div>
        <div className="knowledge-card-grid" key={`${topic}:${query}`}>
          {sections.slice(0, visibleCount).map(section => <article className="knowledge-card" key={section.id}>
            <span className="dossier-mini-label">{topics.find(item => item.id === section.topic)?.[language]}</span><h4>{section.title}</h4>
            <p>{readingPreview(section.paragraphs[0], language)}</p>
            <details className="dossier-more"><summary>{vi ? 'Đọc thêm' : 'Read more'}<ChevronDown size={13} aria-hidden="true" /></summary><div className="encyclopedia-prose">{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div></details>
          </article>)}
        </div>
        {visibleCount < sections.length && <button type="button" className="knowledge-show-more" onClick={() => setVisibleCount(count => count + 6)}>{vi ? 'Xem thêm 6 thẻ' : 'Show 6 more cards'}<ChevronDown size={15} aria-hidden="true" /></button>}
        {!sections.length && <div className="encyclopedia-empty"><p>{vi ? 'Không tìm thấy mục phù hợp. Thử từ khóa ngắn hơn hoặc chọn chủ đề khác.' : 'No matching sections. Try a shorter search or a different topic.'}</p><button type="button" onClick={() => { setQuery(''); setTopic('all'); }}>{vi ? 'Xem tất cả nội dung' : 'Show all content'}</button></div>}
        <footer className="encyclopedia-credit"><a href={pool.sourceUrl} target="_blank" rel="noreferrer">{pool.title} · {vi ? 'Bài gốc' : 'Original article'}<ExternalLink size={13} aria-hidden="true" /></a><p>{vi ? 'Văn bản từ ' : 'Text by '}<a href={pool.historyUrl} target="_blank" rel="noreferrer">{vi ? 'cộng đồng Wikipedia' : 'Wikipedia contributors'}</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. {vi ? 'Đã sắp xếp theo chủ đề và lược bỏ định dạng, công thức, bảng và danh mục tham khảo. Xem bài gốc để đọc các phần đó và kiểm tra nguồn trích dẫn. Hai phiên bản ngôn ngữ có thể khác nhau.' : 'Organized by topic; formatting, formulas, tables, and reference lists are omitted. See the original for those elements and citations. Language editions may differ.'}</p></footer>
      </>}
    </section>
  </>;
}
