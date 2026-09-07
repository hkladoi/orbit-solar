import type { Language } from './i18n';

type FormationStage = { title: string; text: string };
// Interpretive summaries; NASA references are shown beside each profile.
// These stages describe physical evolution, not spacecraft exploration.
export const planetFormation: Record<Language, FormationStage[]>[] = [
  {
    en: [
      { title: 'Collapse of the solar nebula', text: 'About 4.6 billion years ago, gravity compressed a rotating cloud of gas and dust. Most material collected at the center; the surrounding disk supplied the planets.' },
      { title: 'A star begins to shine', text: 'As the center heated, hydrogen fusion became possible. Energy released in the core supports the Sun against gravitational collapse and powers its light.' },
      { title: 'A changing stellar future', text: 'After exhausting its core hydrogen, the Sun will expand into a red giant. It will eventually shed its outer layers, leaving a white dwarf.' },
    ],
    vi: [
      { title: 'Tinh vân Mặt Trời co sụp', text: 'Khoảng 4,6 tỷ năm trước, hấp dẫn nén một đám mây khí bụi đang quay. Phần lớn vật chất tập trung ở giữa; đĩa xung quanh cung cấp vật liệu tạo hành tinh.' },
      { title: 'Ngôi sao bắt đầu tỏa sáng', text: 'Tâm nóng lên đủ để hydro nhiệt hạch. Năng lượng từ lõi chống lại sự co sụp do hấp dẫn và tạo ánh sáng Mặt Trời.' },
      { title: 'Tương lai của ngôi sao', text: 'Khi cạn hydro trong lõi, Mặt Trời sẽ nở thành sao khổng lồ đỏ. Sau đó, các lớp ngoài bị giải phóng, để lại sao lùn trắng.' },
    ],
  },
  {
    en: [
      { title: 'Assembly near the Sun', text: 'Around 4.5 billion years ago, material in the young solar system accumulated under gravity to form a small rocky planet close to the Sun.' },
      { title: 'A metal-rich interior', text: 'Mercury developed a metallic core surrounded by a rocky mantle and crust. Its exceptionally large core is partly liquid; the origin of its unusual proportions remains debated.' },
      { title: 'Impacts and contraction', text: 'Large impacts excavated basins, while lava covered some terrain. As the interior cooled and contracted, the crust buckled into long scarps still visible today.' },
    ],
    vi: [
      { title: 'Bồi tụ gần Mặt Trời', text: 'Khoảng 4,5 tỷ năm trước, vật chất trong Hệ Mặt Trời non trẻ tích tụ dưới tác dụng hấp dẫn, tạo hành tinh đá nhỏ gần Mặt Trời.' },
      { title: 'Bên trong giàu kim loại', text: 'Sao Thủy có lõi kim loại, lớp phủ đá và vỏ. Lõi rất lớn, một phần còn lỏng; nguyên nhân tỷ lệ bất thường này vẫn được tranh luận.' },
      { title: 'Va chạm và co ngót', text: 'Va chạm lớn đào các bồn địa, dung nham phủ một phần địa hình. Nội thất nguội và co lại làm vỏ uốn gãy, tạo những vách dài còn thấy ngày nay.' },
    ],
  },
  {
    en: [
      { title: 'A rocky beginning', text: 'Venus grew from the disk around the young Sun. Its size and layered interior resemble Earth’s, making their diverging histories especially informative.' },
      { title: 'A changing surface', text: 'Volcanism produced extensive plains and reshaped the crust. The timing and extent of resurfacing are still investigated using radar observations.' },
      { title: 'Climate takes a different path', text: 'A thick carbon dioxide atmosphere now traps enormous heat. Whether early Venus sustained oceans, and how long any temperate conditions lasted, remain open research questions.' },
    ],
    vi: [
      { title: 'Khởi đầu từ vật chất đá', text: 'Sao Kim lớn lên từ đĩa quanh Mặt Trời trẻ. Kích thước và cấu trúc phân lớp giống Trái Đất giúp việc so sánh hai lịch sử trở nên giá trị.' },
      { title: 'Bề mặt liên tục biến đổi', text: 'Núi lửa tạo đồng bằng rộng và biến đổi vỏ. Thời điểm và phạm vi tái tạo bề mặt vẫn được nghiên cứu qua radar.' },
      { title: 'Khí hậu đi theo hướng khác', text: 'Khí quyển carbon dioxide dày hiện giữ nhiệt cực mạnh. Sao Kim từng có đại dương hay không, và điều kiện ôn hòa kéo dài bao lâu, vẫn là câu hỏi mở.' },
    ],
  },
  {
    en: [
      { title: 'Building a terrestrial planet', text: 'Earth assembled roughly 4.5 billion years ago from material around the young Sun. It developed a metallic core, rocky mantle, and outer crust.' },
      { title: 'The Moon-forming collision', text: 'The leading explanation for the Moon involves an impact with a roughly Mars-sized body. Debris from the collision collected in orbit and formed the Moon.' },
      { title: 'An evolving habitable world', text: 'A liquid-water surface, atmosphere, and active plate tectonics shape present Earth. Water, rock, air, and living organisms continue to interact and transform the planet.' },
    ],
    vi: [
      { title: 'Bồi tụ thành hành tinh đá', text: 'Trái Đất hình thành khoảng 4,5 tỷ năm trước từ vật chất quanh Mặt Trời trẻ, phát triển lõi kim loại, lớp phủ đá và vỏ ngoài.' },
      { title: 'Va chạm tạo Mặt Trăng', text: 'Giả thuyết hàng đầu giải thích Mặt Trăng bằng va chạm với thiên thể cỡ Sao Hỏa. Mảnh vỡ tập hợp trong quỹ đạo và tạo Mặt Trăng.' },
      { title: 'Thế giới có thể nuôi sự sống', text: 'Nước lỏng, khí quyển và kiến tạo mảng định hình Trái Đất hiện tại. Nước, đá, không khí và sinh vật tiếp tục tương tác, biến đổi hành tinh.' },
    ],
  },
  {
    en: [
      { title: 'A smaller rocky world', text: 'Mars formed around 4.5 billion years ago. Like Earth, it has a core, mantle, and crust, but its smaller size influenced its later evolution.' },
      { title: 'Water and volcanism', text: 'Ancient valleys, deltas, and lakebeds record flowing water. Volcanoes and impacts also sculpted the landscape, preserving evidence of environments unlike today’s cold desert.' },
      { title: 'A thin atmosphere today', text: 'Mars no longer has a global magnetic field. Its thin atmosphere cannot sustain widespread surface liquid water; ice and geological traces preserve its wetter past.' },
    ],
    vi: [
      { title: 'Hành tinh đá nhỏ hơn', text: 'Sao Hỏa hình thành khoảng 4,5 tỷ năm trước, có lõi, lớp phủ và vỏ như Trái Đất. Kích thước nhỏ hơn ảnh hưởng quá trình tiến hóa sau đó.' },
      { title: 'Nước và núi lửa', text: 'Thung lũng, châu thổ và lòng hồ cổ ghi dấu nước chảy. Núi lửa và va chạm cũng tạo địa hình, lưu bằng chứng môi trường khác sa mạc lạnh hiện nay.' },
      { title: 'Khí quyển mỏng ngày nay', text: 'Sao Hỏa không còn từ trường toàn cầu. Khí quyển mỏng không duy trì nước lỏng rộng khắp bề mặt; băng và dấu tích địa chất lưu giữ quá khứ ẩm hơn.' },
    ],
  },
  {
    en: [
      { title: 'Growth in the young disk', text: 'Jupiter formed early from the gas and dust left around the young Sun. Gravity gathered enough material to create the largest planet.' },
      { title: 'A massive gaseous envelope', text: 'Hydrogen and helium dominate Jupiter. Deep inside, immense pressure changes hydrogen into a conducting metallic fluid rather than an ordinary gas.' },
      { title: 'An interior still being resolved', text: 'Juno measurements suggest a diffuse core mixed with surrounding material. Jupiter’s internal structure records its formation, but the exact history is still under study.' },
    ],
    vi: [
      { title: 'Lớn lên trong đĩa sơ khai', text: 'Sao Mộc hình thành sớm từ khí bụi còn quanh Mặt Trời trẻ. Hấp dẫn thu gom đủ vật chất để tạo hành tinh lớn nhất.' },
      { title: 'Lớp khí khổng lồ', text: 'Hydro và heli chiếm ưu thế. Sâu bên trong, áp suất cực lớn biến hydro thành chất lỏng kim loại dẫn điện, khác khí thông thường.' },
      { title: 'Nội thất còn đang được giải mã', text: 'Đo đạc Juno gợi ý lõi khuếch tán, trộn với vật chất xung quanh. Cấu trúc lưu dấu quá trình hình thành, nhưng lịch sử chính xác vẫn được nghiên cứu.' },
    ],
  },
  {
    en: [
      { title: 'Birth of a gas giant', text: 'Around 4.5 billion years ago, gravity gathered gas and dust into Saturn. Hydrogen and helium became its principal constituents, as in Jupiter.' },
      { title: 'Settling into the outer system', text: 'Saturn’s orbit evolved as the young planetary system rearranged. Its present interior contains a dense central region beneath deep layers of hydrogen.' },
      { title: 'A separate history for the rings', text: 'The rings consist mainly of icy debris. Disrupted moons or other bodies may have supplied this material; ring formation should not be assumed to coincide with Saturn’s birth.' },
    ],
    vi: [
      { title: 'Hành tinh khí ra đời', text: 'Khoảng 4,5 tỷ năm trước, hấp dẫn gom khí bụi thành Sao Thổ. Hydro và heli trở thành thành phần chính, giống Sao Mộc.' },
      { title: 'Ổn định ở vùng ngoài', text: 'Quỹ đạo Sao Thổ biến đổi khi hệ hành tinh trẻ sắp xếp lại. Bên trong hiện có vùng trung tâm đậm đặc dưới các lớp hydro sâu.' },
      { title: 'Vành đai có lịch sử riêng', text: 'Vành đai chủ yếu là mảnh băng. Vệ tinh hoặc thiên thể bị phá vỡ có thể cung cấp vật chất; không nên mặc định vành đai ra đời cùng hành tinh.' },
    ],
  },
  {
    en: [
      { title: 'An ice giant takes shape', text: 'Uranus formed about 4.5 billion years ago. Its interior is rich in dense, hot water-, ammonia-, and methane-bearing material, rather than being a solid ball of ice.' },
      { title: 'Outward migration', text: 'Models suggest Uranus formed closer to the Sun and later moved outward. Its current location need not mark its birthplace.' },
      { title: 'An extreme tilt', text: 'Its almost sideways rotation may reflect a collision with an Earth-sized body long ago. This is a proposed explanation, not a directly observed event.' },
    ],
    vi: [
      { title: 'Hành tinh băng hình thành', text: 'Sao Thiên Vương ra đời khoảng 4,5 tỷ năm trước. Nội thất giàu vật chất chứa nước, amoniac và methane nóng, đậm đặc; không phải quả cầu băng rắn.' },
      { title: 'Di cư ra xa', text: 'Mô hình gợi ý hành tinh hình thành gần Mặt Trời hơn rồi dịch ra ngoài. Vị trí hiện tại không nhất thiết là nơi ra đời.' },
      { title: 'Trục nghiêng cực lớn', text: 'Tự quay gần nằm ngang có thể do va chạm với thiên thể cỡ Trái Đất thuở xưa. Đây là cách giải thích được đề xuất, không phải sự kiện quan sát trực tiếp.' },
    ],
  },
  {
    en: [
      { title: 'Formation in the young system', text: 'Neptune formed around 4.5 billion years ago, accumulating material into an ice giant with a rocky core and a dense, hot fluid interior.' },
      { title: 'A changing orbital address', text: 'Neptune probably formed closer to the Sun and migrated outward. Interactions during the early solar system helped establish its distant orbit.' },
      { title: 'Capturing Triton', text: 'Triton orbits opposite Neptune’s rotation. This unusual motion supports the idea that it was captured rather than forming alongside the planet.' },
    ],
    vi: [
      { title: 'Ra đời trong hệ non trẻ', text: 'Sao Hải Vương hình thành khoảng 4,5 tỷ năm trước, tích tụ vật chất thành hành tinh băng có lõi đá và nội thất chất lưu nóng, đậm đặc.' },
      { title: 'Thay đổi vị trí quỹ đạo', text: 'Hành tinh có lẽ hình thành gần Mặt Trời hơn rồi di cư ra ngoài. Tương tác thời kỳ đầu góp phần thiết lập quỹ đạo xa hiện nay.' },
      { title: 'Bắt giữ Triton', text: 'Triton chuyển động ngược chiều tự quay Sao Hải Vương. Quỹ đạo khác thường củng cố giả thuyết vệ tinh bị bắt giữ thay vì hình thành cùng hành tinh.' },
    ],
  },
];
