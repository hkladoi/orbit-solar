'use client';
import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { spacecraftModels, type SpacecraftId } from './spacecraft-models';
import { ArrowUpRight, BookOpen, ChevronRight, Layers3, Orbit, Satellite, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { defaultSpaceLayers, layerNames, spaceObjectById, spaceObjects, type SpaceObject, type SpaceLayer, type SpaceLayers } from './space-data';
import type { Language } from './i18n';

function ConstellationChart({ item, language }: { item: SpaceObject; language: Language }) {
  const stars = [...new Set(item.edges!.flat())].map(id => spaceObjectById.get(id)!);
  const a = stars.reduce((sum,s)=>sum+s.star!.ra,0)/stars.length*Math.PI/180;
  const d = stars.reduce((sum,s)=>sum+s.star!.dec,0)/stars.length*Math.PI/180;
  const projected = stars.map(s=>{
    const ra=s.star!.ra*Math.PI/180,dec=s.star!.dec*Math.PI/180;
    const denominator=Math.sin(d)*Math.sin(dec)+Math.cos(d)*Math.cos(dec)*Math.cos(ra-a);
    return { id:s.id, x:-Math.cos(dec)*Math.sin(ra-a)/denominator, y:-(Math.cos(d)*Math.sin(dec)-Math.sin(d)*Math.cos(dec)*Math.cos(ra-a))/denominator };
  });
  const minX=Math.min(...projected.map(p=>p.x)),maxX=Math.max(...projected.map(p=>p.x)),minY=Math.min(...projected.map(p=>p.y)),maxY=Math.max(...projected.map(p=>p.y));
  const scale=Math.min(320/(maxX-minX||1),155/(maxY-minY||1));
  const points=new Map(projected.map(p=>[p.id,{x:220+(p.x-(minX+maxX)/2)*scale,y:120+(p.y-(minY+maxY)/2)*scale}]));
  const rectangles: {x:number;y:number;width:number}[]=[];
  const labelPoints=new Map(stars.map(s=>{
    const p=points.get(s.id)!,width=s.name[language].length*6.7;
    const candidates=[[p.x+11,p.y-12],[p.x+14,p.y+20],[p.x-width-12,p.y-12],[p.x-width-12,p.y+20],[p.x+20,p.y-30],[p.x+20,p.y+36]];
    const free=candidates.find(([x,y])=>x>4&&x+width<436&&!rectangles.some(r=>x<r.x+r.width+5&&x+width+5>r.x&&y<r.y+16&&y+16>r.y)&&!Array.from(points.values()).some(q=>q.x>x-5&&q.x<x+width+5&&q.y>y-16&&q.y<y+5))??candidates[candidates.length-1];
    rectangles.push({x:free[0],y:free[1],width});return [s.id,{x:free[0],y:free[1]}];
  }));
  // Inline SVG needs an image role to expose the complete chart as one accessible graphic.
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
  return <svg className="constellation-chart" viewBox="0 0 440 240" role="img" aria-label={`${item.name[language]} · ${language==='vi'?'Sơ đồ sao J2000':'J2000 star chart'}`}>
    <title>{item.name[language]}</title>
    <path d="M20 120H420M220 18V222" stroke="currentColor" opacity=".08" strokeDasharray="3 6" />
    {item.edges!.map(([a,b])=><line key={a+b} x1={points.get(a)!.x} y1={points.get(a)!.y} x2={points.get(b)!.x} y2={points.get(b)!.y} stroke="#769cb8" strokeWidth="1"/>)}
    {stars.map(s=>{const p=points.get(s.id)!,label=labelPoints.get(s.id)!;return <g key={s.id}><circle cx={p.x} cy={p.y} r="9" fill={s.color} opacity=".1"/><circle cx={p.x} cy={p.y} r={Math.max(2,4-s.star!.magnitude*.4)} fill={s.color}/><path d={`M${p.x} ${p.y}L${label.x} ${label.y+2}`} stroke="#7595ad" opacity=".35" strokeWidth=".5"/><text x={label.x} y={label.y} fill="#b7c9d9" fontSize="12">{s.name[language]}</text></g>;})}
  </svg>;
}

export function SpacePortrait({ item, language, small=false }: { item: SpaceObject; language: Language; small?: boolean }) {
  if(item.edges&&!small)return <ConstellationChart item={item} language={language}/>;
  const mission=item.layer==='missions';
  return <div className={`space-portrait ${small?'space-portrait-small':''} ${item.kind}`} style={{'--object-color':item.color} as CSSProperties} aria-hidden="true">
    {mission?<Image unoptimized src={`/spacecraft/${item.id}.webp`} width={640} height={440} alt="" draggable={false} className="spacecraft-thumbnail"/>:item.kind==='constellation'?<Sparkles/>:<span className="space-sphere"/>}
  </div>;
}

export function SpaceExplorer({language,layers,onLayers,selectedId,onSelect,onOverview}: {language:Language;layers:SpaceLayers;onLayers:(layers:SpaceLayers)=>void;selectedId:string|null;onSelect:(id:string)=>void;onOverview:()=>void}) {
  const vi=language==='vi';const [catalogOpen,setCatalogOpen]=useState(false),[detailsOpen,setDetailsOpen]=useState(false),[filter,setFilter]=useState<SpaceLayer>('sky'),[query,setQuery]=useState('');
  const selected=selectedId?spaceObjectById.get(selectedId):undefined;
  const select=(id:string)=>{setCatalogOpen(false);setDetailsOpen(false);onSelect(id);};
  const normal=(value:string)=>value.normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('đ','d').toLowerCase();
  const results=spaceObjects.filter(item=>item.layer===filter&&normal(`${item.name.en} ${item.name.vi}`).includes(normal(query)));
  const modelNote=selected?.layer==='sky'
    ?vi?'Hướng sao J2000; không hiệu chỉnh chuyển động riêng. Các sao được chiếu lên thiên cầu, không cùng khoảng cách.':'J2000 directions; proper motion omitted. Stars are projected onto a sky sphere, not placed at a shared physical distance.'
    :selected?.layer==='missions'
      ?vi?'Quỹ đạo minh họa, không theo dõi trực tiếp. Độ cao thay đổi theo thời gian; không dùng TLE. Kích thước tàu được phóng lớn để quan sát. Mô hình là cấu hình tham chiếu, không phản ánh tàu đang ghép nối hiện tại.':'Illustrative orbit, not live tracking. Altitudes vary over time; no TLE propagation. Craft are enlarged for visibility. Reference configurations do not represent currently docked vehicles.'
      :vi?'Chu kỳ tham chiếu được giữ theo đồng hồ mô phỏng. Khoảng cách, kích thước và bề mặt được minh họa; không phải lịch thiên văn.':'Reference periods follow the simulation clock. Distances, sizes and surfaces are illustrative; this is not an ephemeris.';
  return <>
    <button className="space-launch" onClick={()=>setCatalogOpen(true)} aria-label={vi?'Mở danh mục vũ trụ':'Open space atlas'}><Layers3 size={17}/><span>{vi?'Khám phá thêm':'Space atlas'}</span></button>
    {selected&&<aside className="space-readout" aria-label={vi?'Đối tượng đang chọn':'Selected space object'}>
      <div className="space-readout-top"><span>{layerNames[selected.layer][language]}</span><button onClick={onOverview} aria-label={vi?'Về tổng quan':'Return to overview'}><X size={18}/></button></div>
      <SpacePortrait item={selected} language={language}/><h2>{selected.name[language]}</h2><p>{selected.summary[language]}</p>
      <dl>{selected.facts.slice(0,2).map(f=><div key={f.label.en}><dt>{f.label[language]}</dt><dd>{f.value}</dd></div>)}</dl>
      <button className="detail-button" onClick={()=>setDetailsOpen(true)}><BookOpen size={17}/>{vi?'Tìm hiểu chi tiết':'Explore in depth'}<ArrowUpRight size={16}/></button>
      <small className="space-model-note">{selected.layer==='missions'?(vi?'Chọn trạm tự đặt tốc độ 1 phút/giây; có thể đổi trong cài đặt.':'Selecting a craft sets 1 minute/second; adjust it in settings.'):vi?'Chọn đối tượng khác trong Khám phá thêm.':'Find more objects in Space atlas.'}</small>
    </aside>}
    <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}><DialogContent className="space-catalog space-dialog" showCloseButton={false}>
      <header><div className="dossier-kicker"><Sparkles size={14}/>{vi?'MỞ RỘNG TẦM NHÌN':'BEYOND THE PLANETS'}</div><DialogTitle>{vi?'Bản đồ khám phá':'Space atlas'}</DialogTitle><DialogDescription>{vi?'Chọn một đối tượng để camera đến gần. Bật hoặc tắt từng lớp hiển thị.':'Choose an object to travel closer. Show or hide each layer.'}</DialogDescription><DialogClose className="dossier-close" aria-label={vi?'Đóng bản đồ':'Close atlas'}><X size={20}/></DialogClose></header>
      <div className="atlas-body"><nav className="atlas-categories" aria-label={vi?'Nhóm đối tượng':'Object categories'}>{(Object.keys(defaultSpaceLayers) as SpaceLayer[]).map(key=><button key={key} aria-pressed={filter===key} onClick={()=>{setFilter(key);setQuery('');}}><span>{layerNames[key][language]}</span><small>{spaceObjects.filter(o=>o.layer===key).length}</small></button>)}</nav>
      <section className="atlas-results"><div className="atlas-toolbar"><label className="atlas-switch">{vi?'Hiện lớp này':'Show this layer'}<Switch checked={layers[filter]} onCheckedChange={checked=>onLayers({...layers,[filter]:checked})} aria-label={`${vi?'Hiển thị':'Show'} ${layerNames[filter][language]}`}/></label><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={vi?'Tìm theo tên…':'Find an object…'} aria-label={vi?'Tìm đối tượng':'Find an object'}/></div>
      <p className="atlas-context">{filter==='sky'?(vi?'3 hình chòm sao · 23 sao sáng · tọa độ J2000. Nền sao mờ chỉ minh họa.':'3 constellation patterns · 23 bright stars · J2000 coordinates. Faint background stars are decorative.'):filter==='missions'?(vi?'Quỹ đạo minh họa quanh Trái Đất · không phải vị trí trực tiếp':'Illustrative Earth orbits · not live positions'):filter==='moons'?(vi?'5 vệ tinh tiêu biểu · quỹ đạo quanh hành tinh mẹ':'5 selected moons · orbiting their parent planets'):(vi?'Ceres, Vesta và đá–bụi đại diện trong vành đai. Vật thể thực tế thưa hơn nhiều so với hình minh họa.':'Ceres, Vesta and representative belt rocks and dust. Real objects are much more sparsely spaced than shown.')}</p>
      <div className="atlas-grid">{results.map(item=><button key={item.id} onClick={()=>select(item.id)} className="atlas-object"><SpacePortrait item={item} language={language} small/><span><strong>{item.name[language]}</strong><small>{item.kind==='constellation'?(vi?'Sơ đồ chòm sao':'Constellation chart'):item.kind==='star'?`J2000 · ${item.star!.spectral}`:item.facts[1].value}</small></span><ChevronRight size={15}/></button>)}</div>{results.length===0&&<p className="atlas-empty">{vi?'Không tìm thấy đối tượng.':'No matching objects.'}</p>}
      </section></div>
    </DialogContent></Dialog>
    <Dialog open={detailsOpen&&!!selected} onOpenChange={setDetailsOpen}><DialogContent className="space-detail space-dialog" showCloseButton={false}>
      {selected&&<><header><div className="dossier-kicker"><BookOpen size={14}/>{layerNames[selected.layer][language]}</div><DialogTitle>{selected.name[language]}</DialogTitle><DialogDescription>{selected.summary[language]}</DialogDescription><DialogClose className="dossier-close" aria-label={vi?'Đóng hồ sơ':'Close object details'}><X size={20}/></DialogClose></header>
      <div className="space-detail-scroll" key={selected.id}>
        <div className="space-detail-hero"><SpacePortrait item={selected} language={language}/><span>{selected.layer==='sky'?'J2000':selected.layer==='missions'?spacecraftModels[selected.id as SpacecraftId].credit:vi?'MÔ HÌNH MINH HỌA':'ILLUSTRATIVE MODEL'}</span></div>
        <dl className="space-facts">{selected.facts.map(f=><div key={f.label.en}><dt>{f.label[language]}</dt><dd>{f.value}</dd></div>)}</dl>
        <div className="space-notes">{selected.notes.map((note,i)=><article key={i}><span>0{i+1}</span><p>{note[language]}</p></article>)}</div>
        {selected.edges&&<section className="space-member-section"><h3>{vi?'Các sao trong hình':'Stars in this pattern'}</h3><div className="space-members">{[...new Set(selected.edges.flat())].map(id=><button key={id} onClick={()=>onSelect(id)}><Sparkles size={13}/>{spaceObjectById.get(id)!.name[language]}<ChevronRight size={12}/></button>)}</div></section>}
        {selected.orbit&&<div className="space-orbit-diagram"><Orbit size={34}/><div><span>{vi?'THIÊN THỂ MẸ → QUỸ ĐẠO':'PARENT → ORBIT'}</span><strong>{selected.orbit.parent===3?(vi?'Trái Đất':'Earth'):selected.orbit.parent===5?(vi?'Sao Mộc':'Jupiter'):selected.orbit.parent===6?(vi?'Sao Thổ':'Saturn'):(vi?'Mặt Trời':'Sun')} <ChevronRight size={16}/> {selected.name[language]}</strong></div><Satellite size={25}/></div>}
        <h3>{selected.layer==='sky'?(vi?'Mốc danh mục':'Catalogue milestones'):(vi?'Dấu mốc khám phá':'Exploration milestones')}</h3>
        <ol className="space-timeline">{selected.history.map(event=><li key={event.date}><strong>{event.date}</strong><p>{event.text[language]}</p></li>)}</ol>
        <p className="space-model-note">{modelNote}</p><div className="space-sources"><span>{vi?'Nguồn tham khảo':'Sources'}</span>{[...selected.sources,...(selected.layer==='missions'?[{label:spacecraftModels[selected.id as SpacecraftId].credit,url:spacecraftModels[selected.id as SpacecraftId].url}]:[])].map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={13}/></a>)}</div>
      </div></>}
    </DialogContent></Dialog>
  </>;
}
