import { bodies } from './solar-data';
export type Language = 'en' | 'vi';
export const languageStorageKey = 'orbit-language';
const vi: Record<string, string> = {
  "Interactive three-dimensional solar system": "Hệ Mặt Trời 3D tương tác",
  "The 3D view needs WebGL. Enable hardware acceleration in your browser, then reload.": "Chế độ xem 3D cần WebGL. Hãy bật tăng tốc phần cứng trong trình duyệt rồi tải lại trang.",
  "The graphics connection was interrupted. Reload the page to resume exploring.": "Kết nối đồ họa bị gián đoạn. Hãy tải lại trang để tiếp tục khám phá.",
  "Reload": "Tải lại",
  "Orbit home": "Trang chủ Orbit",
  "THE SOLAR SYSTEM EXPLORER": "KHÁM PHÁ HỆ MẶT TRỜI",
  "SIMULATION": "MÔ PHỎNG",
  "How to explore": "Hướng dẫn khám phá",
  "OUR COSMIC NEIGHBORHOOD": "GÓC VŨ TRỤ CỦA CHÚNG TA",
  "A little perspective.": "Một góc nhìn vũ trụ.",
  "One star. Eight worlds. Endless discovery.": "Một ngôi sao. Tám hành tinh. Khám phá bất tận.",
  "FOLLOWING ": "ĐANG THEO DÕI ",
  "SOLAR SYSTEM OVERVIEW": "TỔNG QUAN HỆ MẶT TRỜI",
  "Explore ": "Khám phá ",
  "BODY / ": "THIÊN THỂ / ",
  "SYSTEM / 01": "HỆ / 01",
  "The Solar System": "Hệ Mặt Trời",
  "A family of worlds bound by gravity, traveling together around the heart of the Milky Way.": "Những thế giới gắn kết bởi lực hấp dẫn, cùng chuyển động quanh tâm Ngân Hà.",
  "Diameter": "Đường kính",
  "Distance from Sun": "Cách Mặt Trời",
  "Orbital period": "Chu kỳ quỹ đạo",
  "Our star": "Ngôi sao trung tâm",
  "The Sun": "Mặt Trời",
  "Planets": "Hành tinh",
  "Age": "Tuổi",
  "billion years": "tỷ năm",
  "Return to overview": "Trở về tổng quan",
  "Visit our home planet": "Ghé thăm Trái Đất",
  "Distances compressed. Bodies enlarged.": "Khoảng cách thu gọn. Thiên thể phóng lớn.",
  "Orbital periods proportionally preserved.": "Giữ đúng tỷ lệ chu kỳ quỹ đạo.",
  "Zoom in": "Phóng to",
  "Zoom out": "Thu nhỏ",
  "Reset camera": "Đặt lại góc nhìn",
  "Top view": "Nhìn từ trên",
  "Drag to orbit": "Kéo để xoay",
  "Scroll to zoom": "Cuộn để thu phóng",
  "Select a world": "Chọn hành tinh",
  "Overview": "Tổng quan",
  "Reset simulation time": "Đặt lại thời gian mô phỏng",
  "Play simulation": "Chạy mô phỏng",
  "Pause simulation": "Tạm dừng mô phỏng",
  "ELAPSED EARTH DAYS": "SỐ NGÀY TRÁI ĐẤT ĐÃ QUA",
  "PAUSED": "TẠM DỪNG",
  "RUNNING": "ĐANG CHẠY",
  "Time speed": "Tốc độ thời gian",
  "Simulation days per second": "Số ngày mô phỏng mỗi giây",
  "d/s": "ngày/giây",
  "View settings": "Cài đặt",
  "Toggle fullscreen": "Bật hoặc tắt toàn màn hình",
  "Fullscreen": "Toàn màn hình",
  "Close settings": "Đóng cài đặt",
  "Planet labels": "Tên hành tinh",
  "Orbital paths": "Đường quỹ đạo",
  "View from above": "Quan sát từ trên",
  "Your window into space": "Cửa sổ nhìn ra vũ trụ",
  "Drag to orbit. Scroll or pinch to zoom. Right-drag or use two fingers to pan. Select a world to glide closer and follow its orbit.": "Kéo để xoay góc nhìn. Cuộn hoặc chụm hai ngón để thu phóng. Kéo chuột phải hoặc dùng hai ngón để dịch chuyển. Chọn một thiên thể để đến gần và theo dõi quỹ đạo của nó.",
  "Play / pause": "Chạy / tạm dừng",
  "Previous / next world": "Thiên thể trước / tiếp theo",
  "System overview": "Tổng quan hệ",
  "A scientifically inspired illustration, not a live ephemeris. Starting positions are composed; surfaces are procedural. Rotations and sizes are adjusted for clarity. One AU is the average Earth–Sun distance.": "Mô hình lấy cảm hứng từ khoa học, không hiển thị vị trí thiên thể theo thời gian thực. Vị trí ban đầu được sắp đặt; bề mặt được tạo bằng thuật toán. Tốc độ tự quay và kích thước được điều chỉnh để dễ quan sát. Một AU là khoảng cách trung bình từ Trái Đất đến Mặt Trời.",
  "Explore the science at NASA ↗": "Khám phá khoa học cùng NASA ↗",
  "Our family of worlds orbiting the Sun.": "Gia đình các thiên thể quay quanh Mặt Trời.",
  "Distances compressed. Bodies enlarged. Orbital periods proportionally preserved.": "Khoảng cách thu gọn. Thiên thể phóng lớn. Giữ đúng tỷ lệ chu kỳ quỹ đạo.",
  "Language": "Ngôn ngữ",
  "Close": "Đóng"
};
export function translate(language: Language, text: string) { return language === 'vi' ? vi[text] ?? text : text; }
const planetsVi = [
  {
    "name": "Mặt Trời",
    "subtitle": "Ngôi sao ở trung tâm của tất cả.",
    "description": "Quả cầu plasma rực sáng giữ Hệ Mặt Trời gắn kết. Phản ứng nhiệt hạch trong lõi cung cấp ánh sáng và hơi ấm để sự sống trên Trái Đất tồn tại.",
    "year": "—"
  },
  {
    "name": "Sao Thủy",
    "subtitle": "Thế giới nhỏ. Hành trình nhanh.",
    "description": "Hành tinh nhỏ nhất hoàn thành một vòng quanh Mặt Trời chỉ trong 88 ngày Trái Đất. Bề mặt cổ xưa đầy hố va chạm ghi dấu hàng tỷ năm lịch sử.",
    "year": "88 ngày"
  },
  {
    "name": "Sao Kim",
    "subtitle": "Thế giới sau màn mây.",
    "description": "Bao phủ bởi những đám mây axit sulfuric, Sao Kim có bầu khí quyển carbon dioxide với áp suất cực lớn. Hiệu ứng nhà kính mạnh khiến đây là hành tinh nóng nhất.",
    "year": "225 ngày"
  },
  {
    "name": "Trái Đất",
    "subtitle": "Ngôi nhà xanh của chúng ta.",
    "description": "Đại dương lỏng, các lục địa dịch chuyển và bầu khí quyển bảo vệ tạo nên thế giới đặc biệt của chúng ta. Đây là hành tinh duy nhất được biết đến có sự sống.",
    "year": "365,26 ngày"
  },
  {
    "name": "Sao Hỏa",
    "subtitle": "Chân trời tiếp theo.",
    "description": "Sa mạc màu gỉ sắt trải rộng trên thế giới đá lạnh giá này. Lòng sông cổ và băng ở hai cực lưu giữ dấu vết của một quá khứ nhiều nước hơn.",
    "year": "687 ngày"
  },
  {
    "name": "Sao Mộc",
    "subtitle": "Gã khổng lồ giữa các hành tinh.",
    "description": "Nặng hơn tất cả các hành tinh còn lại cộng lại, Sao Mộc là hành tinh khí khổng lồ với các dải mây chuyển động nhanh. Những cơn bão khổng lồ cuộn xoáy trong khí quyển.",
    "year": "11,86 năm"
  },
  {
    "name": "Sao Thổ",
    "subtitle": "Viên ngọc của Hệ Mặt Trời.",
    "description": "Hệ vành đai băng ngoạn mục bao quanh hành tinh khí khổng lồ này. Sao Thổ có khối lượng riêng trung bình thấp hơn cả nước.",
    "year": "29,46 năm"
  },
  {
    "name": "Sao Thiên Vương",
    "subtitle": "Thế giới nghiêng mình.",
    "description": "Hành tinh băng khổng lồ màu xanh nhạt này lăn nghiêng trên hành trình quanh Mặt Trời. Methane trong khí quyển hấp thụ ánh sáng đỏ, tạo nên sắc xanh lam lục.",
    "year": "84 năm"
  },
  {
    "name": "Sao Hải Vương",
    "subtitle": "Nơi xa nhất trong tám hành tinh.",
    "description": "Tối, lạnh và bị quét qua bởi những luồng gió mạnh, Sao Hải Vương chuyển động trên quỹ đạo rộng lớn. Ánh sáng Mặt Trời mất hơn bốn giờ để tới đây.",
    "year": "164,8 năm"
  }
];
export function localizedBodies(language: Language) { return bodies.map((body, i) => language === 'vi' ? {...body, ...planetsVi[i], diameter: Number(body.diameter.replaceAll(',', '')).toLocaleString('vi-VN'), au: body.au.replace('.', ',')} : body); }
