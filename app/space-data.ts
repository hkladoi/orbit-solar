import skyCatalog from './data/sky-catalog.json';
import type { Language } from './i18n';

export type LocalText = { en: string; vi: string };
export const words = (en: string, vi: string): LocalText => ({ en, vi });
export type SpaceLayer = 'sky' | 'moons' | 'missions' | 'debris';
export type SpaceLayers = Record<SpaceLayer, boolean>;
export const defaultSpaceLayers: SpaceLayers = { sky: true, moons: true, missions: true, debris: true };
export const layerNames: Record<SpaceLayer, LocalText> = {
  sky: words('Stars & constellations', 'Sao & chòm sao'),
  moons: words('Natural satellites', 'Vệ tinh tự nhiên'),
  missions: words('Stations & spacecraft', 'Trạm & tàu vũ trụ'),
  debris: words('Asteroids & dust', 'Tiểu hành tinh & bụi'),
};
export interface SpaceObject {
  id: string; name: LocalText; layer: SpaceLayer;
  kind: 'moon' | 'station' | 'telescope' | 'asteroid' | 'star' | 'constellation';
  color: string; summary: LocalText; notes: LocalText[];
  facts: { label: LocalText; value: string }[];
  history: { date: string; text: LocalText }[];
  sources: { label: string; url: string }[];
  orbit?: { parent: number; radius: number; size: number; period: number; inclination: number; node: number; phase: number; equatorial?: boolean; eccentricity?: number };
  star?: { ra: number; dec: number; magnitude: number; spectral: string };
  edges?: [string, string][];
}
const nasa = (path: string) => ({ label: 'NASA Science', url: `https://science.nasa.gov/${path}` });
const jpl = { label: 'JPL · Satellite elements', url: 'https://ssd.jpl.nasa.gov/sats/elem/' };
const iau = { label: 'IAU · Constellations', url: 'https://iauarchive.eso.org/public/themes/constellations/' };
const bsc = { label: 'Hoffleit & Warren · Bright Star Catalogue V/50 (CDS)', url: 'https://cdsarc.cds.unistra.fr/viz-bin/cat/V/50' };
const fact = (en: string, vi: string, value: string) => ({ label: words(en, vi), value });
const event = (date: string, en: string, vi: string) => ({ date, text: words(en, vi) });

const satellites: SpaceObject[] = [
  { id: 'moon', name: words('Moon', 'Mặt Trăng'), layer: 'moons', kind: 'moon', color: '#bcb9b2',
    summary: words('Our nearest world, shaped by impacts and ancient lava.', 'Thế giới gần chúng ta nhất, mang dấu vết va chạm và dung nham cổ.'),
    notes: [words('A giant impact is the leading explanation for its origin. The details are still studied.', 'Va chạm khổng lồ là giả thuyết hình thành được ủng hộ rộng rãi; chi tiết vẫn đang được nghiên cứu.'), words('Tidal locking keeps nearly the same hemisphere facing Earth. The far side also receives sunlight.', 'Khóa thủy triều khiến gần như cùng một bán cầu luôn hướng về Trái Đất. Nửa kia vẫn có ánh nắng.')],
    facts: [fact('Mean distance', 'Khoảng cách trung bình', '384,400 km'), fact('Orbital period', 'Chu kỳ quỹ đạo', '27.32 d'), fact('Diameter', 'Đường kính', '3,475 km')],
    history: [event('~4.5 Ga', 'Formation after a giant impact (leading hypothesis).', 'Hình thành sau va chạm lớn (giả thuyết chính).'), event('1969', 'Apollo 11: first humans on the Moon.', 'Apollo 11: con người lần đầu đặt chân lên Mặt Trăng.')],
    sources: [nasa('moon/facts/'), jpl], orbit: { parent: 3, radius: 4.2, size: .26, period: 27.3217, inclination: 5.145, node: .2, phase: 2.1 } },
  { id: 'io', name: words('Io', 'Io'), layer: 'moons', kind: 'moon', color: '#d9b554',
    summary: words('A volcanic moon powered by Jupiter’s tidal forces.', 'Vệ tinh núi lửa được nung nóng bởi lực thủy triều của Sao Mộc.'),
    notes: [words('Gravitational tugs flex the interior and power intense volcanism.', 'Sức kéo hấp dẫn làm biến dạng bên trong và nuôi hoạt động núi lửa mạnh.'), words('Io, Europa and Ganymede participate in a 4:2:1 orbital resonance.', 'Io, Europa và Ganymede tham gia cộng hưởng quỹ đạo 4:2:1.')],
    facts: [fact('Parent', 'Thiên thể mẹ', 'Jupiter / Sao Mộc'), fact('Orbital period', 'Chu kỳ quỹ đạo', '1.769 d'), fact('Diameter', 'Đường kính', '3,643 km')],
    history: [event('1610', 'Galileo observed the Galilean satellites.', 'Galileo quan sát nhóm vệ tinh Galilei.'), event('1979', 'Voyager 1 revealed active volcanoes.', 'Voyager 1 phát hiện núi lửa đang hoạt động.')],
    sources: [nasa('jupiter/jupiter-moons/io/'), jpl], orbit: { parent: 5, radius: 3.65, size: .23, period: 1.76914, inclination: .04, node: 0, phase: .1, equatorial: true } },
  { id: 'europa', name: words('Europa', 'Europa'), layer: 'moons', kind: 'moon', color: '#dbc9ad',
    summary: words('An icy crust above a likely global saltwater ocean.', 'Lớp vỏ băng phía trên đại dương nước mặn toàn cầu được suy đoán tồn tại.'),
    notes: [words('Long fractures cross its young icy surface. Evidence points to liquid water below.', 'Các vết nứt dài cắt qua bề mặt băng trẻ. Bằng chứng gợi ý nước lỏng phía dưới.'), words('An ocean makes Europa a promising place to study habitability, not a confirmed home for life.', 'Đại dương khiến Europa hấp dẫn cho nghiên cứu khả năng sống; chưa có sự sống được xác nhận.')],
    facts: [fact('Parent', 'Thiên thể mẹ', 'Jupiter / Sao Mộc'), fact('Orbital period', 'Chu kỳ quỹ đạo', '3.551 d'), fact('Diameter', 'Đường kính', '3,122 km')],
    history: [event('1610', 'Observed by Galileo.', 'Được Galileo quan sát.'), event('1995–2003', 'Galileo mission studied its surface and magnetic environment.', 'Tàu Galileo nghiên cứu bề mặt và môi trường từ trường.')],
    sources: [nasa('jupiter/jupiter-moons/europa/europa-facts/'), jpl], orbit: { parent: 5, radius: 4.65, size: .21, period: 3.55118, inclination: .47, node: 1, phase: 2.4, equatorial: true } },
  { id: 'ganymede', name: words('Ganymede', 'Ganymede'), layer: 'moons', kind: 'moon', color: '#958c7b',
    summary: words('The largest moon in the Solar System, larger than Mercury.', 'Vệ tinh lớn nhất Hệ Mặt Trời, lớn hơn Sao Thủy.'),
    notes: [words('Its surface mixes dark, ancient terrain with brighter grooved regions.', 'Bề mặt kết hợp địa hình tối cổ xưa với những vùng sáng có rãnh.'), words('Ganymede has an intrinsic magnetic field and evidence of an internal ocean.', 'Ganymede có từ trường riêng và bằng chứng về đại dương bên trong.')],
    facts: [fact('Parent', 'Thiên thể mẹ', 'Jupiter / Sao Mộc'), fact('Orbital period', 'Chu kỳ quỹ đạo', '7.155 d'), fact('Diameter', 'Đường kính', '5,262 km')],
    history: [event('1610', 'Observed by Galileo.', 'Được Galileo quan sát.'), event('1996', 'Galileo detected its intrinsic magnetic field.', 'Tàu Galileo phát hiện từ trường riêng.')],
    sources: [nasa('jupiter/jupiter-moons/ganymede/facts/'), jpl], orbit: { parent: 5, radius: 5.8, size: .34, period: 7.15455, inclination: .2, node: 2, phase: 4.5, equatorial: true } },
  { id: 'titan', name: words('Titan', 'Titan'), layer: 'moons', kind: 'moon', color: '#d7a35d',
    summary: words('A hazy moon with rivers and lakes of methane and ethane.', 'Vệ tinh phủ sương mù, có sông và hồ methane, ethane.'),
    notes: [words('A dense nitrogen atmosphere hides a frigid landscape.', 'Khí quyển nitơ dày che phủ một cảnh quan lạnh giá.'), words('Its liquid cycle resembles Earth’s water cycle, but uses hydrocarbons at the surface.', 'Chu trình chất lỏng giống chu trình nước của Trái Đất, nhưng dùng hydrocarbon trên bề mặt.')],
    facts: [fact('Parent', 'Thiên thể mẹ', 'Saturn / Sao Thổ'), fact('Orbital period', 'Chu kỳ quỹ đạo', '15.945 d'), fact('Diameter', 'Đường kính', '5,150 km')],
    history: [event('1655', 'Discovered by Christiaan Huygens.', 'Christiaan Huygens phát hiện Titan.'), event('2005', 'Huygens probe landed on the surface.', 'Tàu thăm dò Huygens hạ cánh xuống bề mặt.')],
    sources: [nasa('saturn/moons/titan/facts/'), jpl], orbit: { parent: 6, radius: 6.5, size: .32, period: 15.9454, inclination: .35, node: .5, phase: 1.3, equatorial: true } },
];

const missions: SpaceObject[] = [
  { id: 'iss', name: words('International Space Station', 'Trạm Vũ trụ Quốc tế'), kind: 'station', layer: 'missions', color: '#8ec4ee',
    summary: words('A laboratory in free fall around Earth.', 'Phòng thí nghiệm trong trạng thái rơi tự do quanh Trái Đất.'),
    notes: [words('Microgravity enables research on biology, materials and living in space.', 'Vi trọng lực cho phép nghiên cứu sinh học, vật liệu và cuộc sống trong không gian.'), words('Solar arrays provide electricity. Reboosts compensate for atmospheric drag.', 'Các cánh pin cung cấp điện. Những lần nâng quỹ đạo bù lại lực cản khí quyển.')],
    facts: [fact('Reference altitude', 'Độ cao tham chiếu', '~400 km'), fact('Inclination to equator', 'Nghiêng so với xích đạo', '51.6°'), fact('Approx. orbital period', 'Chu kỳ xấp xỉ', '92.6 min')],
    history: [event('1998', 'Assembly began with Zarya and Unity.', 'Bắt đầu lắp ráp với Zarya và Unity.'), event('2000', 'The first long-duration crew arrived.', 'Phi hành đoàn cư trú dài hạn đầu tiên đến trạm.')],
    sources: [{ label: 'NASA · ISS reference', url: 'https://www.nasa.gov/reference/international-space-station/' }], orbit: { parent: 3, radius: 1.6, size: .16, period: 92.6 / 1440, inclination: 51.6, node: .5, phase: 0, equatorial: true } },
  { id: 'tiangong', name: words('Tiangong', 'Thiên Cung'), kind: 'station', layer: 'missions', color: '#e8c68c',
    summary: words('China’s modular space station in low Earth orbit.', 'Trạm vũ trụ nhiều mô-đun của Trung Quốc trên quỹ đạo thấp.'),
    notes: [words('Tianhe is the core; Wentian and Mengtian provide laboratory space.', 'Thiên Hòa là mô-đun lõi; Vấn Thiên và Mộng Thiên cung cấp không gian thí nghiệm.'), words('The T-shaped complex supports crewed research and visiting spacecraft.', 'Tổ hợp hình chữ T phục vụ nghiên cứu có người lái và tàu tiếp tế.')],
    facts: [fact('Reference altitude', 'Độ cao tham chiếu', '~390 km'), fact('Inclination to equator', 'Nghiêng so với xích đạo', '41.5°'), fact('Approx. orbital period', 'Chu kỳ xấp xỉ', '92.4 min')],
    history: [event('2021', 'Tianhe core module launched.', 'Phóng mô-đun lõi Thiên Hòa.'), event('2022', 'Wentian and Mengtian completed the three-module configuration.', 'Vấn Thiên và Mộng Thiên hoàn thành cấu hình ba mô-đun.')],
    sources: [{ label: 'CMSA · Space station', url: 'https://en.cmse.gov.cn/missions/CMTH/' }, { label: 'CMSA · Reference orbit (2022)', url: 'https://www.cmse.gov.cn/gfgg/zgkjzgdcs/202212/t20221228_52022.html' }], orbit: { parent: 3, radius: 1.52, size: .13, period: 92.4 / 1440, inclination: 41.5, node: 2.2, phase: 3, equatorial: true } },
  { id: 'hubble', name: words('Hubble Space Telescope', 'Kính thiên văn Hubble'), kind: 'telescope', layer: 'missions', color: '#c6d3de',
    summary: words('An observatory above most of Earth’s atmosphere.', 'Đài quan sát phía trên phần lớn khí quyển Trái Đất.'),
    notes: [words('A 2.4-metre mirror collects ultraviolet, visible and near-infrared light.', 'Gương 2,4 mét thu ánh sáng tử ngoại, khả kiến và cận hồng ngoại.'), words('It is an uncrewed telescope, not a habitable station. Its orbit slowly decays.', 'Đây là kính thiên văn không người lái, không phải trạm cư trú. Quỹ đạo giảm độ cao dần.')],
    facts: [fact('Illustrative altitude', 'Độ cao minh họa', '~540 km'), fact('Inclination to equator', 'Nghiêng so với xích đạo', '28.5°'), fact('Approx. orbital period', 'Chu kỳ xấp xỉ', '95.4 min')],
    history: [event('1990', 'Launched aboard Space Shuttle Discovery.', 'Được tàu con thoi Discovery đưa lên quỹ đạo.'), event('1993', 'First servicing mission corrected the optical problem.', 'Sứ mệnh bảo dưỡng đầu tiên khắc phục lỗi quang học.'), event('2009', 'Final astronaut servicing mission.', 'Sứ mệnh bảo dưỡng có phi hành gia cuối cùng.')],
    sources: [nasa('mission/hubble/overview/'), nasa('mission/hubble/multimedia/online-activities/interactive-orbiting-hubble/')], orbit: { parent: 3, radius: 1.9, size: .12, period: 95.4 / 1440, inclination: 28.5, node: 4, phase: 1.4, equatorial: true } },
];

const asteroids: SpaceObject[] = [
  { id: 'ceres', name: words('Ceres', 'Ceres'), layer: 'debris', kind: 'asteroid', color: '#a9a29a',
    summary: words('The dwarf planet at the heart of the asteroid belt.', 'Hành tinh lùn trong vành đai tiểu hành tinh.'),
    notes: [words('Rock, ice and salts preserve clues to the early Solar System.', 'Đá, băng và muối lưu dấu vết Hệ Mặt Trời sơ khai.'), words('The belt is mostly empty space. The enlarged rocks and dust here illustrate its distribution.', 'Vành đai chủ yếu là khoảng trống. Đá và bụi ở đây được phóng lớn để minh họa phân bố.')],
    facts: [fact('Diameter', 'Đường kính', '~952 km'), fact('Orbital period', 'Chu kỳ quỹ đạo', '1,682 d'), fact('Region', 'Khu vực', '2.8 AU')],
    history: [event('1801', 'Discovered by Giuseppe Piazzi.', 'Giuseppe Piazzi phát hiện Ceres.'), event('2015', 'Dawn entered orbit.', 'Dawn đi vào quỹ đạo quanh Ceres.')],
    sources: [nasa('dwarf-planets/ceres/facts/')], orbit: { parent: 0, radius: 25.1, size: .22, period: 1682, inclination: 10.6, node: 1.4, phase: 2.7, eccentricity: .076 } },
  { id: 'vesta', name: words('Vesta', 'Vesta'), layer: 'debris', kind: 'asteroid', color: '#b0a08c',
    summary: words('A surviving protoplanet with a differentiated interior.', 'Tiền hành tinh còn sót lại với cấu trúc bên trong phân lớp.'),
    notes: [words('Early heating separated its interior into crust, mantle and core.', 'Nhiệt thời kỳ đầu giúp phân tách vỏ, lớp phủ và lõi.'), words('Impact scars record violent collisions. Many meteorites on Earth have been linked to Vesta.', 'Sẹo va chạm ghi lại những vụ đụng độ mạnh. Nhiều thiên thạch trên Trái Đất được liên hệ với Vesta.')],
    facts: [fact('Mean diameter', 'Đường kính trung bình', '~525 km'), fact('Orbital period', 'Chu kỳ quỹ đạo', '~1,325 d'), fact('Region', 'Khu vực', '2.36 AU')],
    history: [event('1807', 'Discovered by Heinrich Wilhelm Olbers.', 'Heinrich Wilhelm Olbers phát hiện Vesta.'), event('2011–2012', 'Dawn mapped Vesta from orbit.', 'Dawn lập bản đồ Vesta từ quỹ đạo.')],
    sources: [nasa('solar-system/asteroids/4-vesta/')], orbit: { parent: 0, radius: 23.6, size: .17, period: 1325, inclination: 7.1, node: 2, phase: 5, eccentricity: .089 } },
];

// Rounded coordinates and V magnitudes from BSC5 / CDS V/50, FK5 J2000.
// Positions are angular directions, NOT distances from the Sun. No proper motion.
const starRows: [string, string, number, string, string, number, string][] = [
 ['caph','Caph',21,'00 09 10.7','+59 08 59',2.27,'F2III-IV'], ['schedar','Schedar',168,'00 40 30.5','+56 32 14',2.23,'K0IIIa'], ['gamma-cas','Gamma Cassiopeiae',264,'00 56 42.5','+60 43 00',2.47,'B0IVe'], ['ruchbah','Ruchbah',403,'01 25 49.0','+60 14 07',2.68,'A5III-IV'], ['segin','Segin',542,'01 54 23.7','+63 40 12',3.38,'B3III'],
 ['betelgeuse','Betelgeuse',2061,'05 55 10.3','+07 24 25',.50,'M1-2Ia-Iab'], ['rigel','Rigel',1713,'05 14 32.3','-08 12 06',.12,'B8Ia'], ['bellatrix','Bellatrix',1790,'05 25 07.9','+06 20 59',1.64,'B2III'], ['mintaka','Mintaka',1852,'05 32 00.4','-00 17 57',2.23,'O9.5II'], ['alnilam','Alnilam',1903,'05 36 12.8','-01 12 07',1.70,'B0Ia'], ['alnitak','Alnitak',1948,'05 40 45.5','-01 56 34',2.05,'O9.7Ib'], ['saiph','Saiph',2004,'05 47 45.4','-09 40 11',2.06,'B0.5Ia'],
 ['dubhe','Dubhe',4301,'11 03 43.7','+61 45 03',1.79,'K0IIIa'], ['merak','Merak',4295,'11 01 50.5','+56 22 57',2.37,'A1V'], ['phecda','Phecda',4554,'11 53 49.8','+53 41 41',2.44,'A0Ve'], ['megrez','Megrez',4660,'12 15 25.6','+57 01 57',3.31,'A3V'], ['alioth','Alioth',4905,'12 54 01.7','+55 57 35',1.77,'A0pCr'], ['mizar','Mizar',5054,'13 23 55.5','+54 55 31',2.27,'A1VpSrSi'], ['alkaid','Alkaid',5191,'13 47 32.4','+49 18 48',1.86,'B3V'],
 ['sirius','Sirius',2491,'06 45 08.9','-16 42 58',-1.46,'A1Vm'], ['vega','Vega',7001,'18 36 56.3','+38 47 01',.03,'A0Va'], ['polaris','Polaris',424,'02 31 48.7','+89 15 51',2.02,'F7:Ib-II'], ['canopus','Canopus',2326,'06 23 57.1','-52 41 45',-.72,'F0II'],
];
export function sexagesimal(value: string) { const [a,b,c] = value.split(' ').map(Number); return (Math.abs(a)+b/60+c/3600)*(value.startsWith('-')?-1:1); }
const stars: SpaceObject[] = starRows.map(([id, name, hr, ra, dec, magnitude, spectral]) => ({
 id, name: words(name,name), kind: 'star', layer: 'sky', color: spectral.startsWith('M')?'#ffac78':spectral.startsWith('K')?'#ffd3a2':spectral.startsWith('F')?'#fff0d8':'#c5ddff',
 summary: words(`A catalogued star: HR ${hr}. Follow its direction in the celestial sphere.`, `Ngôi sao trong danh mục: HR ${hr}. Quan sát hướng của sao trên thiên cầu.`),
 notes: [words('Right ascension and declination locate a direction in the sky, like longitude and latitude on a sphere.', 'Xích kinh và xích vĩ xác định hướng trên trời, tương tự kinh độ và vĩ độ trên mặt cầu.'), words('A smaller visual magnitude means a brighter star as seen from Earth. The catalogue value is a reference; some stars vary.', 'Cấp sao nhỏ hơn nghĩa là sáng hơn khi nhìn từ Trái Đất. Giá trị danh mục là tham chiếu; một số sao biến quang.')],
 facts: [fact('Right ascension · J2000', 'Xích kinh · J2000', ra.replaceAll(' ', ':')), fact('Declination · J2000', 'Xích vĩ · J2000', dec.replaceAll(' ', ':')), fact('V magnitude / spectrum', 'Cấp sao V / phổ', `${magnitude} / ${spectral}`)],
 history: [event('1991', 'Bright Star Catalogue, fifth revised edition.', 'Bright Star Catalogue, bản hiệu chỉnh lần thứ năm.'), event('J2000', 'Coordinate reference epoch, not the date of discovery.', 'Mốc tham chiếu tọa độ, không phải năm phát hiện.')], sources: [bsc], star: { ra: sexagesimal(ra)*15, dec: sexagesimal(dec), magnitude, spectral },
}));
const constellation = (id: string, name: LocalText, summary: LocalText, edges: [string,string][]): SpaceObject => ({
 id, name, summary, edges, kind: 'constellation', layer: 'sky', color: '#98bbd7',
 notes: [words('Lines are a recognition aid, not physical links or official constellation boundaries.', 'Đường nối giúp nhận diện hình sao, không phải liên kết vật lý hay ranh giới chòm sao chính thức.'), words('These stars lie at different distances. Their apparent pattern is a view from our Solar System.', 'Các sao ở những khoảng cách khác nhau. Hình dạng là góc nhìn từ Hệ Mặt Trời của chúng ta.')],
 facts: [fact('Chart stars', 'Sao trong sơ đồ', String(new Set(edges.flat()).size)), fact('Reference frame', 'Hệ tham chiếu', 'FK5 · J2000'), fact('Sky regions (IAU)', 'Vùng trời (IAU)', '88')],
 history: [event('1922', 'IAU adopted the list of 88 constellations.', 'IAU thông qua danh sách 88 chòm sao.'), event('1930', 'Modern constellation boundaries were published.', 'Công bố ranh giới chòm sao hiện đại.')], sources: [iau,bsc],
});
const skySource = { label: 'd3-celestial · star charts & catalogue', url: 'https://github.com/ofrohn/d3-celestial' };
const catalogueStars: SpaceObject[] = skyCatalog.stars.map(s => ({
 id:s.id,name:words(s.name,s.name),kind:'star',layer:'sky',color:s.bv>1.3?'#ffbd94':s.bv>.6?'#fff0d8':'#c5ddff',
 summary:words(`Catalogue star HIP ${s.hip}, shown at its J2000 sky coordinates.`,`Sao danh mục HIP ${s.hip}, hiển thị theo tọa độ thiên cầu J2000.`),
 notes:[words('Stars in a pattern can be at very different distances from Earth.','Các sao trong cùng hình chòm sao có thể cách Trái Đất những khoảng rất khác nhau.'),words('A lower apparent magnitude indicates a brighter star.','Cấp sao biểu kiến càng nhỏ, ngôi sao càng sáng.')],
 facts:[fact('Right ascension · J2000','Xích kinh · J2000',s.ra.toFixed(4)+'°'),fact('Declination · J2000','Xích vĩ · J2000',s.dec.toFixed(4)+'°'),fact('Visual magnitude','Cấp sao biểu kiến',String(s.magnitude))],
 history:[event('J2000','Reference coordinate epoch, not discovery date.','Mốc tham chiếu tọa độ, không phải năm phát hiện.')],sources:[skySource,{label:'Data attribution & license',url:'/data/SKY-SOURCES.md'}],
 star:{ra:s.ra,dec:s.dec,magnitude:s.magnitude,spectral:'HIP '+s.hip},
}));
export const constellations: SpaceObject[] = skyCatalog.constellations.map(c=>({
 ...constellation(c.id,words(c.en,c.vi),words(`${c.en}: one of the 88 constellations. Rotate the sky to explore its neighbouring patterns.`,`${c.vi}: một trong 88 chòm sao. Xoay bầu trời để khám phá những chòm lân cận.`),c.edges as [string,string][]),sources:[iau,skySource,{label:'Data attribution & license',url:'/data/SKY-SOURCES.md'}],
}));
export const spaceObjects: SpaceObject[] = [...constellations, ...satellites, ...missions, ...asteroids, ...stars, ...catalogueStars];
export const spaceObjectById = new Map(spaceObjects.map(item => [item.id, item]));
export const spaceName = (id: string, language: Language) => spaceObjectById.get(id)?.name[language] ?? id;
