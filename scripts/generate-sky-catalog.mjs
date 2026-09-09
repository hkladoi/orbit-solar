// Input: d3-celestial data files in output/sky-source. See public/data/SKY-SOURCES.md.
import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(`output/sky-source/${name}.json`,'utf8'));
const lines=read('constellations.lines'), metadata=read('constellations'), catalog=read('stars.8').features, names=read('starnames');
const translations='And:Tiên Nữ|Ant:Tức Đồng|Aps:Thiên Điểu|Aqr:Bảo Bình|Aql:Thiên Ưng|Ara:Thiên Đàn|Ari:Bạch Dương|Aur:Ngự Phu|Boo:Mục Phu|Cae:Điêu Cụ|Cam:Lộc Báo|Cnc:Cự Giải|CVn:Lạp Khuyển|CMa:Đại Khuyển|CMi:Tiểu Khuyển|Cap:Ma Kết|Car:Thuyền Để|Cas:Tiên Hậu|Cen:Bán Nhân Mã|Cep:Tiên Vương|Cet:Kình Ngư|Cha:Yển Diên|Cir:Viên Quy|Col:Thiên Cáp|Com:Hậu Phát|CrA:Nam Miện|CrB:Bắc Miện|Crv:Ô Nha|Crt:Cự Tước|Cru:Nam Thập Tự|Cyg:Thiên Nga|Del:Hải Đồn|Dor:Kiếm Ngư|Dra:Thiên Long|Equ:Tiểu Mã|Eri:Ba Giang|For:Thiên Lô|Gem:Song Tử|Gru:Thiên Hạc|Her:Vũ Tiên|Hor:Thời Chung|Hya:Trường Xà|Hyi:Thủy Xà|Ind:Ấn Đệ An|Lac:Yết Hổ|Leo:Sư Tử|LMi:Tiểu Sư|Lep:Thiên Thố|Lib:Thiên Bình|Lup:Sài Lang|Lyn:Thiên Miêu|Lyr:Thiên Cầm|Men:Sơn Án|Mic:Hiển Vi Kính|Mon:Kỳ Lân|Mus:Thương Dăng|Nor:Củ Xích|Oct:Nam Cực|Oph:Xà Phu|Ori:Lạp Hộ|Pav:Khổng Tước|Peg:Phi Mã|Per:Anh Tiên|Phe:Phượng Hoàng|Pic:Hội Giá|Psc:Song Ngư|PsA:Nam Ngư|Pup:Thuyền Vĩ|Pyx:La Bàn|Ret:Võng Cổ|Sge:Thiên Tiễn|Sgr:Nhân Mã|Sco:Thiên Yết|Scl:Ngọc Phu|Sct:Thuẫn Bài|Ser:Cự Xà|Sex:Lục Phân Nghi|Tau:Kim Ngưu|Tel:Viễn Vọng Kính|Tri:Tam Giác|TrA:Nam Tam Giác|Tuc:Đỗ Quyên|UMa:Đại Hùng|UMi:Tiểu Hùng|Vel:Thuyền Phàm|Vir:Xử Nữ|Vol:Phi Ngư|Vul:Hồ Ly';
const vi=Object.fromEntries(translations.split('|').map(s=>s.split(':')));
const source=fs.readFileSync('app/space-data.ts','utf8');
const rowText=source.match(/const starRows:[\s\S]*?= (\[[\s\S]*?\n\]);/)[1];
const rows=[...rowText.matchAll(/\['([^']+)','([^']+)',(\d+),'([^']+)','([^']+)',([\d.-]+),'([^']+)'\]/g)].map(m=>[m[1],m[2],Number(m[3]),m[4],m[5],Number(m[6]),m[7]]);
if(rows.length!==23)throw Error('Existing star table format changed');
const sex=s=>{const[a,b,c]=s.split(' ').map(Number);return(Math.abs(a)+b/60+c/3600)*(s.startsWith('-')?-1:1)};
const existing=rows.map(r=>({id:r[0],ra:sex(r[3])*15,dec:sex(r[4])}));
const distance=(a,b)=>{const dra=((a[0]-b[0]+540)%360)-180;return (dra*Math.cos(a[1]*Math.PI/180))**2+(a[1]-b[1])**2};
const stars=new Map(), patterns=new Map();
function endpoint(coords){
 const old=existing.find(s=>distance(coords,[s.ra,s.dec])<.0004);if(old)return old.id;
 let best,delta=Infinity;for(const s of catalog){const d=distance(coords,s.geometry.coordinates);if(d<delta){best=s;delta=d;}}
 if(delta>.0004)throw Error(`No catalogue star at ${coords}: nearest ${Math.sqrt(delta)} deg`);
 const id=`hip-${best.id}`, n=names[best.id], designation=n?.name||[n?.desig,n?.c].filter(Boolean).join(' ')||`HIP ${best.id}`;
 stars.set(id,{id,name:designation,hip:best.id,ra:(best.geometry.coordinates[0]+360)%360,dec:best.geometry.coordinates[1],magnitude:best.properties.mag,bv:Number(best.properties.bv)||0});return id;
}
for(const f of lines.features){
 const meta=metadata.features.find(m=>m.id===f.id).properties;
 const id=({Ori:'orion',Cas:'cassiopeia',UMa:'ursa-major'})[f.id]||`constellation-${f.id.toLowerCase()}`;
 let p=patterns.get(id);if(!p){p={id,abbr:f.id,en:f.id==='Ser'?'Serpens':meta.name,vi:vi[f.id],edges:[]};patterns.set(id,p);}
 for(const path of f.geometry.coordinates){for(let i=1;i<path.length;i++)p.edges.push([endpoint(path[i-1]),endpoint(path[i])]);}
}
if(patterns.size!==88||[...patterns.values()].some(p=>!p.vi))throw Error('Expected 88 translated constellations');
fs.mkdirSync('app/data',{recursive:true});fs.writeFileSync('app/data/sky-catalog.json',JSON.stringify({constellations:[...patterns.values()],stars:[...stars.values()]})+'\n');
console.log(`${patterns.size} constellations, ${stars.size} additional stars; existing ${existing.length} stars reused where matched.`);
