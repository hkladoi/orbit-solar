type TimelineEvent = { date: string; title: string; description: string };
type Profile = { category: string; overview: string[]; origin: string; history: string; timeline: TimelineEvent[] };
type PlanetDetails = { en: Profile; vi: Profile; sources: { label: string; url: string }[] };

// Order matches solar-data.ts. Mission years describe completed historical events.
export const planetDetails: PlanetDetails[] = [
  {
    en: {
      category: 'G-type star',
      overview: ['The Sun is mostly hydrogen and helium. Fusion in its core releases the energy that reaches Earth as sunlight.', 'Its visible layer, the photosphere, is about 5,500°C. The much hotter corona extends into space and feeds the solar wind.'],
      origin: 'About 4.6 billion years ago, a collapsing cloud formed the Sun. Material in the surrounding disk became planets and smaller bodies.',
      history: 'Solar exploration connects observations of the visible surface with measurements of particles, magnetic fields, and the outer atmosphere.',
      timeline: [
        { date: '1995', title: 'SOHO launches', description: 'The joint ESA–NASA observatory begins a mission to study the Sun from its interior to the solar wind.' },
        { date: '2018', title: 'Parker Solar Probe launches', description: 'A heat-shielded spacecraft sets out to investigate the corona and the acceleration of the solar wind.' },
        { date: '2021', title: 'Inside the corona', description: 'Parker Solar Probe becomes the first spacecraft to fly through the Sun’s corona and sample it directly.' },
      ],
    },
    vi: {
      category: 'Ngôi sao loại G',
      overview: ['Mặt Trời chủ yếu gồm hydro và heli. Phản ứng nhiệt hạch trong lõi giải phóng năng lượng đến Trái Đất dưới dạng ánh sáng.', 'Quang cầu, lớp nhìn thấy được, nóng khoảng 5.500°C. Vành nhật hoa bên ngoài nóng hơn nhiều và là nơi hình thành gió Mặt Trời.'],
      origin: 'Khoảng 4,6 tỷ năm trước, một đám mây co sụp tạo nên Mặt Trời. Vật chất trong đĩa xung quanh hình thành các hành tinh.',
      history: 'Khám phá Mặt Trời kết hợp quan sát bề mặt với đo đạc hạt, từ trường và khí quyển ngoài.',
      timeline: [
        { date: '1995', title: 'Phóng SOHO', description: 'Đài quan sát chung ESA–NASA bắt đầu nghiên cứu từ bên trong Mặt Trời đến gió Mặt Trời.' },
        { date: '2018', title: 'Phóng Parker Solar Probe', description: 'Tàu với lá chắn nhiệt lên đường nghiên cứu vành nhật hoa và sự gia tốc của gió Mặt Trời.' },
        { date: '2021', title: 'Đi vào vành nhật hoa', description: 'Parker Solar Probe trở thành tàu đầu tiên bay qua và đo đạc trực tiếp vành nhật hoa.' },
      ],
    },
    sources: [{ label: 'NASA · Sun', url: 'https://science.nasa.gov/sun/facts/' }, { label: 'NASA · SOHO', url: 'https://science.nasa.gov/mission/soho/' }, { label: 'NASA · Parker Solar Probe', url: 'https://science.nasa.gov/mission/parker-solar-probe/' }],
  },
  {
    en: {
      category: 'Terrestrial planet',
      overview: ['Mercury has an unusually large metallic core and a heavily cratered crust. Its thin exosphere cannot retain much heat.', 'Temperatures range from roughly −180°C at night to 430°C by day. Water ice survives inside permanently shadowed polar craters.'],
      origin: 'Formed about 4.5 billion years ago, Mercury accumulated impact basins. Cooling and contraction later produced long cliffs across its surface.',
      history: 'Known since antiquity, Mercury remained difficult to study near the Sun’s glare. Spacecraft revealed its terrain and magnetic field.',
      timeline: [
        { date: '1974–1975', title: 'Mariner 10 flybys', description: 'Three encounters return the first close-up views and reveal that Mercury has a magnetic field.' },
        { date: '2011', title: 'MESSENGER enters orbit', description: 'The first Mercury orbiter begins a global investigation of the planet’s surface, chemistry, and interior.' },
        { date: '2012', title: 'Evidence for polar ice', description: 'MESSENGER measurements support the presence of water ice in permanently shadowed craters near the north pole.' },
      ],
    },
    vi: {
      category: 'Hành tinh đất đá',
      overview: ['Sao Thủy có lõi kim loại lớn bất thường và lớp vỏ đầy hố va chạm. Ngoại quyển rất loãng nên giữ nhiệt kém.', 'Nhiệt độ từ khoảng −180°C ban đêm đến 430°C ban ngày. Băng nước tồn tại trong các hố vùng cực luôn chìm trong bóng tối.'],
      origin: 'Hình thành khoảng 4,5 tỷ năm trước, Sao Thủy tích lũy nhiều bồn địa va chạm. Quá trình nguội và co lại tạo các vách dài.',
      history: 'Được biết từ thời cổ đại, Sao Thủy khó quan sát vì gần ánh chói Mặt Trời. Tàu vũ trụ hé lộ địa hình và từ trường.',
      timeline: [
        { date: '1974–1975', title: 'Mariner 10 bay ngang', description: 'Ba lần tiếp cận cung cấp ảnh cận cảnh đầu tiên và phát hiện từ trường của Sao Thủy.' },
        { date: '2011', title: 'MESSENGER vào quỹ đạo', description: 'Tàu quỹ đạo đầu tiên nghiên cứu toàn cầu về bề mặt, thành phần hóa học và cấu trúc bên trong.' },
        { date: '2012', title: 'Bằng chứng băng vùng cực', description: 'Đo đạc của MESSENGER củng cố bằng chứng băng nước trong các hố tối vĩnh viễn gần cực bắc.' },
      ],
    },
    sources: [{ label: 'NASA · Mercury', url: 'https://science.nasa.gov/mercury/facts/' }, { label: 'NASA · Mariner 10', url: 'https://science.nasa.gov/mission/mariner-10/' }, { label: 'NASA · MESSENGER', url: 'https://science.nasa.gov/mission/messenger/' }],
  },
  {
    en: {
      category: 'Terrestrial planet',
      overview: ['Venus resembles Earth in size but has a dense carbon dioxide atmosphere. Surface pressure is about 90 times Earth’s.', 'Sulfuric-acid clouds hide volcanic plains. An extreme greenhouse effect keeps the ground near 465°C, hotter than Mercury.'],
      origin: 'Venus formed from rocky material early in the solar system. Volcanism reshaped its surface; its atmospheric history remains an active research question.',
      history: 'Ancient observers knew Venus as a bright morning or evening object. Radar and landers later penetrated the mystery of its clouds.',
      timeline: [
        { date: '1962', title: 'Mariner 2', description: 'The first successful planetary flyby measures Venus and confirms its intensely hot environment.' },
        { date: '1970', title: 'Venera 7', description: 'The Soviet probe transmits data from the surface, a first for a spacecraft on another planet.' },
        { date: '1990–1994', title: 'Magellan’s radar maps', description: 'An orbiter maps nearly all of Venus’s surface, revealing volcanoes, plains, and impact craters beneath the clouds.' },
      ],
    },
    vi: {
      category: 'Hành tinh đất đá',
      overview: ['Sao Kim có kích thước gần Trái Đất nhưng khí quyển carbon dioxide rất dày. Áp suất bề mặt gấp khoảng 90 lần Trái Đất.', 'Mây axit sulfuric che các đồng bằng núi lửa. Hiệu ứng nhà kính giữ bề mặt gần 465°C, nóng hơn Sao Thủy.'],
      origin: 'Sao Kim hình thành từ vật chất đá thời kỳ đầu Hệ Mặt Trời. Núi lửa biến đổi bề mặt; lịch sử khí quyển vẫn đang được nghiên cứu.',
      history: 'Người xưa biết Sao Kim là thiên thể sáng buổi sáng hoặc chiều. Radar và tàu đổ bộ về sau giúp khám phá dưới lớp mây.',
      timeline: [
        { date: '1962', title: 'Mariner 2', description: 'Chuyến bay ngang hành tinh thành công đầu tiên xác nhận môi trường cực nóng của Sao Kim.' },
        { date: '1970', title: 'Venera 7', description: 'Tàu Liên Xô lần đầu truyền dữ liệu từ bề mặt một hành tinh khác về Trái Đất.' },
        { date: '1990–1994', title: 'Bản đồ radar Magellan', description: 'Tàu lập bản đồ gần toàn bộ bề mặt, hé lộ núi lửa, đồng bằng và hố va chạm dưới mây.' },
      ],
    },
    sources: [{ label: 'NASA · Venus', url: 'https://science.nasa.gov/venus/venus-facts/' }, { label: 'NASA · Venus missions', url: 'https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/venus.html' }, { label: 'NASA · Robotic firsts', url: 'https://science.nasa.gov/deep-space-exploration/' }],
  },
  {
    en: {
      category: 'Terrestrial planet · Our home',
      overview: ['Oceans cover about 71% of Earth. Its nitrogen- and oxygen-rich atmosphere supports life and moderates conditions at the surface.', 'Moving tectonic plates renew the crust. A magnetic field generated within the planet helps shield it from the solar wind.'],
      origin: 'Earth assembled about 4.5 billion years ago. As it cooled, crust and oceans developed; a giant impact likely formed the Moon.',
      history: 'Earth has no discovery date. Spaceflight transformed how we study our home, linking local observations into a view of the entire planet.',
      timeline: [
        { date: '1957', title: 'Sputnik 1', description: 'The first artificial satellite enters Earth orbit, opening the space age.' },
        { date: '1968', title: 'Earthrise', description: 'Apollo 8’s crew photographs Earth above the lunar horizon, offering an iconic perspective on our home.' },
        { date: '1972', title: 'Landsat 1', description: 'A new satellite program begins a long record of changes to Earth’s land surface.' },
      ],
    },
    vi: {
      category: 'Hành tinh đất đá · Ngôi nhà của chúng ta',
      overview: ['Đại dương bao phủ khoảng 71% Trái Đất. Khí quyển giàu nitơ và oxy hỗ trợ sự sống, điều hòa môi trường bề mặt.', 'Các mảng kiến tạo chuyển động làm mới lớp vỏ. Từ trường sinh ra bên trong giúp bảo vệ hành tinh trước gió Mặt Trời.'],
      origin: 'Trái Đất hình thành khoảng 4,5 tỷ năm trước. Khi nguội, lớp vỏ và đại dương phát triển; một va chạm lớn có thể tạo nên Mặt Trăng.',
      history: 'Trái Đất không có ngày được phát hiện. Kỷ nguyên vũ trụ kết nối quan sát địa phương thành góc nhìn toàn hành tinh.',
      timeline: [
        { date: '1957', title: 'Sputnik 1', description: 'Vệ tinh nhân tạo đầu tiên vào quỹ đạo Trái Đất, mở đầu kỷ nguyên vũ trụ.' },
        { date: '1968', title: 'Earthrise — Trái Đất mọc', description: 'Phi hành đoàn Apollo 8 chụp Trái Đất trên chân trời Mặt Trăng, tạo nên góc nhìn biểu tượng về quê nhà.' },
        { date: '1972', title: 'Landsat 1', description: 'Chương trình vệ tinh bắt đầu ghi lại những biến đổi lâu dài trên bề mặt đất liền.' },
      ],
    },
    sources: [{ label: 'NASA · Earth', url: 'https://science.nasa.gov/earth/facts/' }, { label: 'NASA · Sputnik', url: 'https://www.nasa.gov/history/sputnik/' }, { label: 'NASA · Apollo 8', url: 'https://www.nasa.gov/mission/apollo-8/' }, { label: 'NASA · Landsat 1', url: 'https://science.nasa.gov/mission/landsat-1/' }],
  },
  {
    en: {
      category: 'Terrestrial planet',
      overview: ['Iron minerals give Mars its rusty color. Its thin carbon dioxide atmosphere leaves the surface cold and exposed.', 'Olympus Mons is a vast volcano, and Valles Marineris is an enormous canyon system. Polar caps contain water ice and frozen carbon dioxide.'],
      origin: 'Mars formed about 4.5 billion years ago. Ancient channels and lake sediments record flowing water before much of its atmosphere was lost.',
      history: 'Known since antiquity, Mars inspired speculation about life. Spacecraft replaced imagined canals with evidence of a complex geological past.',
      timeline: [
        { date: '1965', title: 'Mariner 4', description: 'A successful flyby sends back the first close-up photographs of Mars, revealing cratered terrain.' },
        { date: '1976', title: 'Viking landers', description: 'Two landers conduct long-lived surface experiments and return detailed images of their surroundings.' },
        { date: '2021', title: 'Perseverance', description: 'The rover lands in Jezero Crater to investigate ancient environments and collect carefully selected rock samples.' },
      ],
    },
    vi: {
      category: 'Hành tinh đất đá',
      overview: ['Khoáng vật sắt tạo màu gỉ đặc trưng. Khí quyển carbon dioxide mỏng khiến bề mặt Sao Hỏa lạnh và ít được che chắn.', 'Olympus Mons là núi lửa khổng lồ; Valles Marineris là hệ hẻm vực rộng lớn. Chỏm cực chứa băng nước và carbon dioxide đóng băng.'],
      origin: 'Sao Hỏa hình thành khoảng 4,5 tỷ năm trước. Lòng sông và trầm tích hồ ghi dấu nước từng chảy trước khi khí quyển mất đi phần lớn.',
      history: 'Được biết từ thời cổ đại, Sao Hỏa gợi suy đoán về sự sống. Tàu vũ trụ thay “kênh đào” tưởng tượng bằng bằng chứng địa chất.',
      timeline: [
        { date: '1965', title: 'Mariner 4', description: 'Chuyến bay ngang thành công gửi ảnh cận cảnh đầu tiên, hé lộ địa hình đầy hố va chạm.' },
        { date: '1976', title: 'Tàu đổ bộ Viking', description: 'Hai tàu thực hiện thí nghiệm dài ngày trên bề mặt và gửi ảnh chi tiết về môi trường xung quanh.' },
        { date: '2021', title: 'Perseverance', description: 'Xe tự hành đáp xuống hố Jezero để tìm hiểu môi trường cổ và thu thập các mẫu đá được chọn kỹ.' },
      ],
    },
    sources: [{ label: 'NASA · Mars', url: 'https://science.nasa.gov/mars/facts/' }, { label: 'NASA · Mars exploration', url: 'https://www.nasa.gov/history/25-years-of-continuous-robotic-mars-exploration-from-pathfinder-to-perseverance/' }, { label: 'NASA · Viking', url: 'https://science.nasa.gov/mission/viking/' }],
  },
  {
    en: {
      category: 'Gas giant',
      overview: ['Jupiter is mostly hydrogen and helium, without a solid surface to stand on. Deep pressure produces a layer of metallic hydrogen.', 'Cloud bands and giant storms mark its atmosphere. A powerful magnetic field surrounds a system of moons and faint rings.'],
      origin: 'Jupiter formed early, about 4.5 billion years ago, gathering much of the gas left after the Sun formed.',
      history: 'Visible to ancient observers, Jupiter became crucial to astronomy when Galileo observed four moons orbiting it in 1610.',
      timeline: [
        { date: '1973', title: 'Pioneer 10', description: 'The first spacecraft encounter measures Jupiter’s environment and returns close-range images.' },
        { date: '1995', title: 'Galileo', description: 'An orbiter studies Jupiter and its moons while a probe descends into the giant’s atmosphere.' },
        { date: '2016', title: 'Juno', description: 'Juno enters polar orbit to investigate Jupiter’s interior, magnetic field, and atmosphere.' },
      ],
    },
    vi: {
      category: 'Hành tinh khí khổng lồ',
      overview: ['Sao Mộc chủ yếu gồm hydro và heli, không có bề mặt rắn để đứng. Áp suất sâu bên trong tạo lớp hydro kim loại.', 'Các dải mây và bão lớn đánh dấu khí quyển. Từ trường mạnh bao quanh hệ vệ tinh và những vành đai mờ.'],
      origin: 'Sao Mộc hình thành sớm, khoảng 4,5 tỷ năm trước, thu hút phần lớn khí còn lại sau khi Mặt Trời ra đời.',
      history: 'Người xưa đã quan sát Sao Mộc. Năm 1610, Galileo thấy bốn vệ tinh quay quanh nó, một bước ngoặt của thiên văn học.',
      timeline: [
        { date: '1973', title: 'Pioneer 10', description: 'Lần tiếp cận đầu tiên bằng tàu vũ trụ đo môi trường và gửi ảnh Sao Mộc ở cự ly gần.' },
        { date: '1995', title: 'Galileo', description: 'Tàu quỹ đạo nghiên cứu Sao Mộc và các vệ tinh; một đầu dò đi vào khí quyển hành tinh.' },
        { date: '2016', title: 'Juno', description: 'Juno vào quỹ đạo qua vùng cực để nghiên cứu cấu trúc bên trong, từ trường và khí quyển.' },
      ],
    },
    sources: [{ label: 'NASA · Jupiter', url: 'https://science.nasa.gov/jupiter/jupiter-facts/' }, { label: 'NASA · Jupiter exploration', url: 'https://science.nasa.gov/jupiter/exploration/' }, { label: 'NASA · History', url: 'https://www.nasa.gov/missions/decades-of-discovery-nasas-exploration-of-jupiter/' }],
  },
  {
    en: {
      category: 'Gas giant',
      overview: ['Saturn’s rings consist of countless pieces of ice and rock. Broad gaps separate ring regions, shaped partly by nearby moons.', 'The planet is mostly hydrogen and helium. Its low average density and fast rotation give it a noticeably flattened shape.'],
      origin: 'Saturn formed about 4.5 billion years ago by gathering gas around a growing core. The rings’ age and origin remain debated.',
      history: 'Galileo saw Saturn’s unusual appearance in 1610 without resolving the rings. Later telescopes and spacecraft revealed their intricate structure.',
      timeline: [
        { date: '1655', title: 'Huygens and Titan', description: 'Christiaan Huygens discovers Titan, Saturn’s largest moon, and helps explain the ring system.' },
        { date: '2004–2005', title: 'Cassini–Huygens arrives', description: 'Cassini enters Saturn orbit in 2004; the Huygens probe lands on Titan in 2005.' },
        { date: '2017', title: 'Cassini’s Grand Finale', description: 'After 13 years in orbit, Cassini ends its mission with a final descent into Saturn’s atmosphere.' },
      ],
    },
    vi: {
      category: 'Hành tinh khí khổng lồ',
      overview: ['Vành đai Sao Thổ gồm vô số mảnh băng và đá. Các khoảng trống phân chia vành đai, một phần do tác động của vệ tinh.', 'Hành tinh chủ yếu gồm hydro và heli. Khối lượng riêng thấp và tốc độ tự quay nhanh tạo hình dáng dẹt rõ rệt.'],
      origin: 'Sao Thổ hình thành khoảng 4,5 tỷ năm trước, gom khí quanh lõi đang lớn. Tuổi và nguồn gốc vành đai vẫn còn được tranh luận.',
      history: 'Năm 1610, Galileo thấy hình dáng khác lạ nhưng chưa phân biệt được vành đai. Kính thiên văn và tàu vũ trụ dần hé lộ cấu trúc.',
      timeline: [
        { date: '1655', title: 'Huygens và Titan', description: 'Christiaan Huygens phát hiện Titan, vệ tinh lớn nhất của Sao Thổ, và góp phần giải thích hệ vành đai.' },
        { date: '2004–2005', title: 'Cassini–Huygens đến nơi', description: 'Cassini vào quỹ đạo Sao Thổ năm 2004; đầu dò Huygens đáp xuống Titan năm 2005.' },
        { date: '2017', title: 'Chặng cuối của Cassini', description: 'Sau 13 năm trên quỹ đạo, Cassini kết thúc sứ mệnh bằng lần lao cuối vào khí quyển Sao Thổ.' },
      ],
    },
    sources: [{ label: 'NASA · Saturn', url: 'https://science.nasa.gov/saturn/facts/' }, { label: 'NASA · Saturn exploration', url: 'https://science.nasa.gov/saturn/exploration/' }, { label: 'NASA · Cassini–Huygens', url: 'https://science.nasa.gov/mission/cassini-huygens/' }],
  },
  {
    en: {
      category: 'Ice giant',
      overview: ['Uranus is tilted by about 98 degrees, producing extreme seasons. Methane absorbs red light and contributes to its blue-green appearance.', 'Below its hydrogen–helium atmosphere lies a hot, dense fluid rich in water, ammonia, and methane. It has no solid outer surface.'],
      origin: 'Uranus formed about 4.5 billion years ago. A large ancient collision may explain its tilt, though its early evolution remains uncertain.',
      history: 'Uranus was the first planet discovered with a telescope. Distant observations and one historic flyby revealed a complex world.',
      timeline: [
        { date: '1781', title: 'Herschel’s discovery', description: 'William Herschel observes the object that becomes recognized as a new planet beyond Saturn.' },
        { date: '1977', title: 'Rings detected', description: 'Repeated dips in a background star’s light reveal narrow rings surrounding Uranus.' },
        { date: '1986', title: 'Voyager 2', description: 'The spacecraft flies past Uranus, examining its atmosphere, magnetic field, rings, and moons.' },
      ],
    },
    vi: {
      category: 'Hành tinh băng khổng lồ',
      overview: ['Trục Sao Thiên Vương nghiêng khoảng 98 độ, tạo các mùa cực đoan. Methane hấp thụ ánh sáng đỏ, góp phần tạo sắc xanh lam lục.', 'Dưới khí quyển hydro–heli là chất lưu nóng, đậm đặc, giàu nước, amoniac và methane. Hành tinh không có bề mặt rắn bên ngoài.'],
      origin: 'Hình thành khoảng 4,5 tỷ năm trước, hành tinh có thể đã nghiêng do va chạm lớn. Diễn biến thời kỳ đầu vẫn chưa chắc chắn.',
      history: 'Đây là hành tinh đầu tiên được phát hiện bằng kính thiên văn. Quan sát từ xa và một chuyến bay ngang hé lộ thế giới phức tạp.',
      timeline: [
        { date: '1781', title: 'Phát hiện của Herschel', description: 'William Herschel quan sát thiên thể sau đó được công nhận là hành tinh mới bên ngoài Sao Thổ.' },
        { date: '1977', title: 'Phát hiện vành đai', description: 'Ánh sáng một ngôi sao phía sau giảm nhiều lần, hé lộ các vành đai hẹp quanh hành tinh.' },
        { date: '1986', title: 'Voyager 2', description: 'Tàu bay ngang, khảo sát khí quyển, từ trường, vành đai và các vệ tinh của Sao Thiên Vương.' },
      ],
    },
    sources: [{ label: 'NASA · Uranus', url: 'https://science.nasa.gov/uranus/facts/' }, { label: 'NASA · Uranus exploration', url: 'https://science.nasa.gov/uranus/exploration/' }],
  },
  {
    en: {
      category: 'Ice giant',
      overview: ['Neptune’s atmosphere is mostly hydrogen and helium with methane. Storm systems and very fast winds move through its cold cloud layers.', 'Its interior contains dense, hot material rich in water, methane, and ammonia. Triton, its largest moon, travels in a retrograde orbit.'],
      origin: 'Neptune formed about 4.5 billion years ago. Like Uranus, it may have formed closer to the Sun and migrated outward.',
      history: 'Neptune’s discovery followed calculations of disturbances in Uranus’s orbit, linking mathematical prediction with telescopic observation.',
      timeline: [
        { date: '1846', title: 'A predicted planet', description: 'Johann Galle identifies Neptune near the position calculated by Urbain Le Verrier.' },
        { date: '1846', title: 'Triton discovered', description: 'William Lassell finds Neptune’s largest moon just weeks after the planet’s discovery.' },
        { date: '1989', title: 'Voyager 2 flyby', description: 'The spacecraft reveals atmospheric storms, faint rings, and an unexpectedly active Triton.' },
      ],
    },
    vi: {
      category: 'Hành tinh băng khổng lồ',
      overview: ['Khí quyển Sao Hải Vương chủ yếu gồm hydro, heli và methane. Bão cùng những luồng gió rất nhanh di chuyển trong các lớp mây lạnh.', 'Bên trong là vật chất nóng, đậm đặc, giàu nước, methane và amoniac. Triton, vệ tinh lớn nhất, chuyển động trên quỹ đạo nghịch hành.'],
      origin: 'Sao Hải Vương hình thành khoảng 4,5 tỷ năm trước. Giống Sao Thiên Vương, nó có thể ra đời gần Mặt Trời hơn rồi dịch chuyển ra ngoài.',
      history: 'Tính toán những nhiễu loạn trong quỹ đạo Sao Thiên Vương dẫn đến phát hiện Sao Hải Vương, kết nối dự đoán toán học với quan sát.',
      timeline: [
        { date: '1846', title: 'Hành tinh được dự đoán', description: 'Johann Galle nhận diện Sao Hải Vương gần vị trí do Urbain Le Verrier tính toán.' },
        { date: '1846', title: 'Phát hiện Triton', description: 'William Lassell tìm thấy vệ tinh lớn nhất chỉ vài tuần sau khi hành tinh được phát hiện.' },
        { date: '1989', title: 'Voyager 2 bay ngang', description: 'Tàu hé lộ các cơn bão, vành đai mờ và hoạt động bất ngờ trên Triton.' },
      ],
    },
    sources: [{ label: 'NASA · Neptune', url: 'https://science.nasa.gov/neptune/neptune-facts/' }, { label: 'NASA · Discovery of Neptune', url: 'https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet/' }, { label: 'NASA · Voyager 2', url: 'https://science.nasa.gov/mission/voyager/voyager-2/' }],
  },
];
