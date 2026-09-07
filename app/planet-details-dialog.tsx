'use client';

import { BookOpen, ExternalLink, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localizedBodies, type Language } from './i18n';
import { planetDetails } from './planet-details';
import { PlanetKnowledge } from './planet-knowledge';
import { planetFormation } from './planet-formation';

export function PlanetDetailsDialog({ bodyIndex, language, className = '' }: { bodyIndex: number; language: Language; className?: string }) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const jumpTo = (section: string) => {
    const target = scrollRef.current?.querySelector<HTMLElement>(`[data-chapter="${section}"]`);
    target?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    target?.focus({ preventScroll: true });
  };
  const body = localizedBodies(language)[bodyIndex];
  const record = planetDetails[bodyIndex];
  if (!body || !record) return null;
  const content = record[language];
  const vi = language === 'vi';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`detail-button ${className}`}>
        <BookOpen size={17} aria-hidden="true" />
        <span>{vi ? 'Tìm hiểu chi tiết' : 'Explore in depth'}</span>
      </DialogTrigger>
      <DialogContent className="planet-dossier" showCloseButton={false}>
        <DialogClose className="dossier-close" aria-label={vi ? 'Đóng thông tin chi tiết' : 'Close planet details'}>
          <X size={21} />
        </DialogClose>
        <header className="dossier-header">
          <div className="dossier-kicker"><BookOpen size={15} aria-hidden="true" />{vi ? 'HỒ SƠ THIÊN THỂ' : 'CELESTIAL PROFILE'}<span>{String(bodyIndex).padStart(2, '0')}</span></div>
          <DialogTitle className="dossier-title">{body.name}</DialogTitle>
          <DialogDescription className="dossier-subtitle">{body.subtitle}</DialogDescription>
          <span className="dossier-category">{content.category}</span>
        </header>
        <nav className="dossier-jump-nav" aria-label={vi ? 'Mục lục hồ sơ' : 'Profile contents'}>
          <button type="button" onClick={() => jumpTo('overview')}>{vi ? 'Tổng quan' : 'Overview'}</button>
          <button type="button" onClick={() => jumpTo('formation')}>{vi ? 'Hình thành' : 'Formation'}</button>
          <button type="button" onClick={() => jumpTo('knowledge')}>{vi ? 'Chuyên sâu & fact' : 'In depth & facts'}</button>
          <button type="button" onClick={() => jumpTo('history')}>{vi ? 'Khám phá' : 'Exploration'}</button>
        </nav>
        <div className="dossier-scroll" key={bodyIndex} ref={scrollRef}>
          <dl className="dossier-facts">
            <div><dt>{vi ? 'Đường kính' : 'Diameter'}</dt><dd>{body.diameter} <small>km</small></dd></div>
            <div><dt>{vi ? 'Cách Mặt Trời' : 'Distance from Sun'}</dt><dd>{body.au} <small>AU</small></dd></div>
            <div><dt>{vi ? 'Chu kỳ quỹ đạo' : 'Orbital period'}</dt><dd>{body.year}</dd></div>
          </dl>
          <section className="dossier-section" data-chapter="overview" tabIndex={-1}>
            <h3>{vi ? 'Đặc điểm nổi bật' : 'A closer look'}</h3>
            {content.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="dossier-section dossier-origin" data-chapter="formation" tabIndex={-1}>
            <h3>{vi ? 'Hình thành và biến đổi' : 'Origins and evolution'}</h3>
            <p>{content.origin}</p>
            <ol className="formation-stages">{planetFormation[bodyIndex][language].map((stage, index) => <li key={stage.title}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h4>{stage.title}</h4><p>{stage.text}</p></div></li>)}</ol>
            <a className="formation-source" href={record.sources[0].url} target="_blank" rel="noreferrer">{vi ? 'Tham khảo NASA' : 'NASA reference'}<ExternalLink size={13} aria-hidden="true" /></a>
          </section>
          <div data-chapter="knowledge" tabIndex={-1}>{open && <PlanetKnowledge key={`${bodyIndex}:${language}`} bodyIndex={bodyIndex} language={language} />}</div>
          <section className="dossier-section" data-chapter="history" tabIndex={-1}>
            <h3>{vi ? 'Lịch sử khám phá' : 'Exploration milestones'}</h3>
            <p>{content.history}</p>
            <ol className="dossier-timeline">
              {content.timeline.map(event => <li key={event.date + event.title}>
                <span className="dossier-year">{event.date}</span>
                <div><h4>{event.title}</h4><p>{event.description}</p></div>
              </li>)}
            </ol>
          </section>
          <footer className="dossier-sources">
            <h3>{vi ? 'Nguồn tham khảo' : 'Further reading'}</h3>
            <p>{vi ? 'Nội dung tổng hợp từ NASA. Các mốc dưới đây là sự kiện đã diễn ra, không phải lịch sứ mệnh trực tiếp.' : 'Based on NASA resources. These are historical milestones, not a live mission schedule.'}</p>
            <div>{record.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={13} aria-hidden="true" /><span className="sr-only">{vi ? ' (mở tab mới)' : ' (opens a new tab)'}</span></a>)}</div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
