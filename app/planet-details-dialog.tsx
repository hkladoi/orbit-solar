'use client';

import { BookOpen, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localizedBodies, type Language } from './i18n';
import { planetDetails } from './planet-details';

export function PlanetDetailsDialog({ bodyIndex, language, className = '' }: { bodyIndex: number; language: Language; className?: string }) {
  const body = localizedBodies(language)[bodyIndex];
  const record = planetDetails[bodyIndex];
  if (!body || !record) return null;
  const content = record[language];
  const vi = language === 'vi';

  return (
    <Dialog>
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
        <div className="dossier-scroll" key={bodyIndex}>
          <dl className="dossier-facts">
            <div><dt>{vi ? 'Đường kính' : 'Diameter'}</dt><dd>{body.diameter} <small>km</small></dd></div>
            <div><dt>{vi ? 'Cách Mặt Trời' : 'Distance from Sun'}</dt><dd>{body.au} <small>AU</small></dd></div>
            <div><dt>{vi ? 'Chu kỳ quỹ đạo' : 'Orbital period'}</dt><dd>{body.year}</dd></div>
          </dl>
          <section className="dossier-section">
            <h3>{vi ? 'Đặc điểm nổi bật' : 'A closer look'}</h3>
            {content.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="dossier-section dossier-origin">
            <h3>{vi ? 'Hình thành và biến đổi' : 'Origins and evolution'}</h3>
            <p>{content.origin}</p>
          </section>
          <section className="dossier-section">
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
