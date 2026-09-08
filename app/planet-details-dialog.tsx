'use client';

import { BookOpen, ExternalLink, Layers3, Orbit, Rocket, Sparkles, X } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { localizedBodies, type Language } from './i18n';
import { planetDetails } from './planet-details';
import { PlanetKnowledge } from './planet-knowledge';
import { planetFormation } from './planet-formation';
import { readingPreview } from './reading-preview';

function ShortNote({ text, language }: { text: string; language: Language }) {
  const preview = readingPreview(text, language, 150);
  return <><p>{preview}</p>{preview !== text && <details className="dossier-more"><summary>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</summary><p>{text}</p></details>}</>;
}

export function PlanetDetailsDialog({ bodyIndex, language, className = '' }: { bodyIndex: number; language: Language; className?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('overview');
  const [knowledgeVisited, setKnowledgeVisited] = useState(false);
  const body = localizedBodies(language)[bodyIndex];
  const record = planetDetails[bodyIndex];
  if (!body || !record) return null;
  const content = record[language];
  const vi = language === 'vi';

  return <Dialog open={open} onOpenChange={value => { setOpen(value); if (!value) { setTab('overview'); setKnowledgeVisited(false); } }}>
    <DialogTrigger className={`detail-button ${className}`}><BookOpen size={17} aria-hidden="true" /><span>{vi ? 'Tìm hiểu chi tiết' : 'Explore in depth'}</span></DialogTrigger>
    <DialogContent className="planet-dossier dossier-compact" showCloseButton={false} style={{ '--world-color': body.color } as CSSProperties}>
      <DialogClose className="dossier-close" aria-label={vi ? 'Đóng thông tin chi tiết' : 'Close planet details'}><X size={21} /></DialogClose>
      <header className="dossier-header">
        <div className="dossier-kicker"><BookOpen size={14} aria-hidden="true" />{vi ? 'HỒ SƠ THIÊN THỂ' : 'CELESTIAL PROFILE'}<span>{String(bodyIndex).padStart(2, '0')}</span></div>
        <DialogTitle className="dossier-title">{body.name}</DialogTitle>
        <DialogDescription className="dossier-subtitle">{body.subtitle}</DialogDescription>
      </header>
      <Tabs value={tab} onValueChange={value => { setTab(String(value)); if (value === 'knowledge') setKnowledgeVisited(true); }} className="dossier-tabs">
        <TabsList className="dossier-tab-list" aria-label={vi ? 'Nội dung hồ sơ' : 'Profile sections'}>
          <TabsTrigger value="overview"><Orbit size={15} />{vi ? 'Tổng quan' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="formation"><Layers3 size={15} />{vi ? 'Hình thành' : 'Formation'}</TabsTrigger>
          <TabsTrigger value="history"><Rocket size={15} />{vi ? 'Khám phá' : 'Exploration'}</TabsTrigger>
          <TabsTrigger value="knowledge"><Sparkles size={15} />{vi ? 'Kiến thức & fact' : 'Learn & facts'}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="dossier-panel">
          <div className="dossier-overview-hero"><div className="dossier-world" aria-hidden="true"><span /></div><div><span className="dossier-mini-label">{vi ? 'NHẬN DIỆN' : 'AT A GLANCE'}</span><h3>{content.category}</h3><p>{vi ? 'Các con số và đặc điểm chính.' : 'The key numbers and defining features.'}</p></div></div>
          <dl className="dossier-facts">
            <div><dt>{vi ? 'Đường kính' : 'Diameter'}</dt><dd>{body.diameter} <small>km</small></dd></div>
            <div><dt>{vi ? 'Cách Mặt Trời' : 'Distance from Sun'}</dt><dd>{body.au} <small>AU</small></dd></div>
            <div><dt>{vi ? 'Chu kỳ quỹ đạo' : 'Orbital period'}</dt><dd>{body.year}</dd></div>
          </dl>
          <div className="dossier-highlight-grid">{content.overview.map((text, index) => <article key={text}><span className="dossier-mini-label">0{index + 1} / {vi ? 'ĐIỂM NỔI BẬT' : 'HIGHLIGHT'}</span><ShortNote text={text} language={language} /></article>)}</div>
        </TabsContent>
        <TabsContent value="formation" className="dossier-panel">
          <div className="dossier-section-heading"><span className="dossier-mini-label">{vi ? 'TỪ KHỞI NGUYÊN ĐẾN BIẾN ĐỔI' : 'FROM ORIGINS TO CHANGE'}</span><h3>{vi ? 'Một hành trình, ba giai đoạn' : 'One journey, three stages'}</h3><p>{vi ? 'Sơ đồ quá trình • không theo tỷ lệ thời gian' : 'Process diagram • not to a time scale'}</p></div>
          <ol className="dossier-process">{planetFormation[bodyIndex][language].map((stage, index) => <li key={stage.title}><div className="process-node" aria-hidden="true">{index + 1}</div><article><h4>{stage.title}</h4><ShortNote text={stage.text} language={language} /></article></li>)}</ol>
          <a className="formation-source" href={record.sources[0].url} target="_blank" rel="noreferrer">{vi ? 'Tìm hiểu thêm tại NASA' : 'Explore the NASA reference'}<ExternalLink size={13} aria-hidden="true" /></a>
        </TabsContent>
        <TabsContent value="history" className="dossier-panel">
          <div className="dossier-section-heading"><span className="dossier-mini-label">{vi ? 'DẤU MỐC KHÁM PHÁ' : 'EXPLORATION MILESTONES'}</span><h3>{vi ? 'Chúng ta đã tìm hiểu ra sao?' : 'How did we get to know this world?'}</h3><p>{vi ? 'Các sự kiện tiêu biểu • khoảng cách mốc không theo tỷ lệ' : 'Selected events • spacing is not to scale'}</p></div>
          <ol className="dossier-event-track">{content.timeline.map(event => <li key={event.date + event.title}><span className="event-date">{event.date}</span><div className="event-dot" aria-hidden="true" /><article><h4>{event.title}</h4><ShortNote text={event.description} language={language} /></article></li>)}</ol>
          <details className="dossier-reference-fold"><summary>{vi ? 'Nguồn tham khảo NASA' : 'NASA references'}</summary><div>{record.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={13} aria-hidden="true" /></a>)}</div></details>
        </TabsContent>
        <TabsContent value="knowledge" className="dossier-panel" keepMounted>
          {open && knowledgeVisited && <PlanetKnowledge key={`${bodyIndex}:${language}`} bodyIndex={bodyIndex} language={language} />}
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>;
}
