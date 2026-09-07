'use client';

import { useCallback, useRef, useState } from 'react';
import { ExternalLink, Lightbulb, LoaderCircle, RefreshCw, Shuffle } from 'lucide-react';
import type { Language } from './i18n';
import { drawFact, type FactPool, type WikipediaFact } from './wikipedia-facts';

export function RandomPlanetFact({ pool, status, onRetry, language }: { pool: FactPool | null; status: 'loading' | 'ready' | 'error'; onRetry: () => void; language: Language }) {
  const vi = language === 'vi';
  const [fact, setFact] = useState<WikipediaFact | null>(() => pool ? drawFact(pool, new Set()) : null);
  const count = pool?.candidates.length ?? 0;
  const seen = useRef(new Set<string>());
  const lastText = useRef<string | undefined>(undefined);

  const nextFact = useCallback(() => {
    if (!pool) return;
    if (fact) { seen.current.add(fact.text); lastText.current = fact.text; }
    const next = drawFact(pool, seen.current, lastText.current);
    lastText.current = next.text;
    setFact(next);
  }, [pool, fact]);

  return (
    <section className="random-fact" aria-label={vi ? 'Bạn có biết?' : 'Did you know?'} aria-busy={status === 'loading'}>
      <div className="random-fact-heading"><h3><Lightbulb size={19} aria-hidden="true" />{vi ? 'Bạn có biết?' : 'Did you know?'}</h3><span>WIKIPEDIA</span></div>
      <div className="random-fact-content" aria-live="polite" aria-atomic="true">
        {status === 'loading' && !fact ? <p className="random-fact-message"><LoaderCircle size={17} className="fact-spinner" aria-hidden="true" />{vi ? 'Đang tìm điều thú vị về thiên thể này…' : 'Finding something interesting about this world…'}</p> : fact ? <>
          <span className="random-fact-topic">{fact.section}</span>
          <blockquote>{fact.text}</blockquote>
          <a className="random-fact-source" href={fact.sourceUrl} target="_blank" rel="noreferrer">{vi ? 'Đọc bài gốc' : 'Read the article'} · {fact.title}<ExternalLink size={13} aria-hidden="true" /><span className="sr-only">{vi ? ' (mở tab mới)' : ' (opens a new tab)'}</span></a>
        </> : null}
        {status === 'error' && <p className="random-fact-error">{vi ? 'Chưa lấy được nội dung từ Wikipedia. Kiểm tra kết nối hoặc thử lại sau.' : 'Wikipedia content is unavailable. Check your connection or try again later.'}</p>}
      </div>
      <div className="random-fact-footer">
        <p>{fact ? <>{vi ? 'Trích từ ' : 'Excerpt by '}<a href={fact.historyUrl} target="_blank" rel="noreferrer">{vi ? 'cộng đồng Wikipedia' : 'Wikipedia contributors'}</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></> : vi ? 'Nội dung lấy trực tiếp từ Wikipedia.' : 'Content retrieved directly from Wikipedia.'}</p>
        <button type="button" className="next-fact-button" onClick={status === 'error' ? onRetry : nextFact} disabled={status === 'loading' || (status === 'ready' && count < 2)}>
          {status === 'loading' ? <LoaderCircle size={15} className="fact-spinner" aria-hidden="true" /> : status === 'error' ? <RefreshCw size={15} aria-hidden="true" /> : <Shuffle size={15} aria-hidden="true" />}
          {status === 'error' ? (vi ? 'Thử lại' : 'Try again') : status === 'loading' ? (vi ? 'Đang tải…' : 'Loading…') : count < 2 ? (vi ? 'Chỉ có một đoạn phù hợp' : 'One excerpt available') : (vi ? 'Fact khác' : 'Another fact')}
        </button>
      </div>
    </section>
  );
}
