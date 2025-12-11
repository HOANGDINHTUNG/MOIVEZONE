import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Film,
  Ticket,
} from "lucide-react";

import doremon45 from "../../../../public/assets/img/events/doremon movie 45.jpg";
import childrenSummer2025 from "../../../../public/assets/img/events/children summer 2025.webp";
import movieSummer2025 from "../../../../public/assets/img/events/movie summer 2025.webp";
import latMat8 from "../../../../public/assets/img/events/lat mat 8.webp"
import kyAnKhongDau from "../../../../public/assets/img/events/ky an khong dau.webp";
import ngayle from "../../../../public/assets/img/events/event 2025.jpg";
import cardGenz from "../../../../public/assets/img/events/card genz.webp";
import movieAnimation from "../../../../public/assets/img/events/movie animation.webp";
import movieSpecial from "../../../../public/assets/img/events/movie special.webp";
import womanDay from "../../../../public/assets/img/events/woman day.webp";
import eventWomanDay from "../../../../public/assets/img/events/event woman day.webp";
import event2025 from "../../../../public/assets/img/events/event 2025.jpg";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const eventId = id;
  console.log(eventId);

  // =======================
  // DATA
  // =======================
  const eventsData = [
    {
    id: "news001",
    title: "SUẤT CHIẾU ĐẶC BIỆT SÁNG THỨ 7 - CUTE QUÁ TRỜI QUÁ ĐẤT!!!",
    type: "event_cinema",
    posterUrl: doremon45,
    time: "10:15 | 17.05.2025",
    badge: "HOT",
    description: "Suất chiếu đặc biệt sáng thứ 7 với phim Doraemon và quà tặng bí mật.",
    category: "SỰ KIỆN ĐẶC BIỆT",
    icon: "Sparkles",
    fullDescription: `<h1>🌈✨ SUẤT CHIẾU ...</h1> ...`,
    highlights: [
      "Suất chiếu sáng Thứ Bảy",
      "Quà tặng bí mật",
      "Phim Doraemon bản lồng tiếng",
      "Chỉ 100 vé"
    ],
    schedule: [{ time: "10:15", title: "Bắt đầu suất chiếu" }],
    price: "ƯU ĐÃI",
    location: "Trung tâm Chiếu phim Quốc gia",
    attendees: "2,100",
    organizer: "NCC"
  },

  {
    id: "news002",
    title: "Các bé xem phim tập thể tại Trung tâm Chiếu phim Quốc gia!!!",
    type: "event_cinema",
    posterUrl: childrenSummer2025,
    time: "2025-05-15",
    badge: "KIDS",
    description: "Hoạt động xem phim tập thể dành cho thiếu nhi tại NCC.",
    category: "SỰ KIỆN THIẾU NHI",
    icon: "Sparkles",
    fullDescription: `<h1>Các bé xem phim ...</h1> ...`,
    highlights: [
      "Hoạt động tập thể",
      "Màn hình lớn – âm thanh xịn",
      "Không khí vui nhộn"
    ],
    schedule: [{ time: "09:30", title: "Bắt đầu chương trình" }],
    price: "35K – 45K",
    location: "NCC",
    attendees: "1,870",
    organizer: "NCC"
  },

  {
    id: "news003",
    title: "CHƯƠNG TRÌNH PHIM HÈ 2025 🎉",
    type: "event_cinema",
    posterUrl: movieSummer2025,
    time: "24/05 – 30/06/2025",
    badge: "HOT",
    description: "Chương trình phim hè 2025 với nhiều hoạt động cho thiếu nhi.",
    category: "PHIM HÈ 2025",
    icon: "Sparkles",
    fullDescription: `<h1>CHƯƠNG TRÌNH PHIM HÈ ...</h1> ...`,
    highlights: ["3 phim hoạt hình", "Suất chiếu 9:30 sáng", "Ưu đãi giá vé"],
    schedule: [{ time: "09:30", title: "Suất chiếu cố định" }],
    price: "35K – 45K",
    location: "NCC",
    attendees: "3,900",
    organizer: "NCC"
  },

  {
    id: "news004",
    title: "Cinetour Lật Mặt 8: Vòng tay nắng",
    type: "event_cinema",
    posterUrl: latMat8,
    time: "2025-04-29",
    badge: "LIVE",
    description: "Giao lưu đoàn phim Lật Mặt 8 tại NCC.",
    category: "CINETOUR",
    icon: "Film",
    fullDescription: `<h1>Cinetour ...</h1> ...`,
    highlights: ["Giao lưu diễn viên", "Hậu trường hấp dẫn", "Không khí sôi động"],
    schedule: [{ time: "18:00", title: "Giao lưu đoàn phim" }],
    price: "MIỄN PHÍ",
    location: "NCC",
    organizer: "NCC",
    attendees: "2,430"
  },

  {
    id: "news005",
    title: "Cinetour Thám Tử Kiên: Kỳ Án Không Đầu",
    type: "event_cinema",
    posterUrl: kyAnKhongDau,
    time: "2025-04-29",
    badge: "LIVE",
    description: "Cinetour Thám Tử Kiên tại NCC.",
    category: "CINETOUR",
    icon: "Film",
    fullDescription: `<h1>Cinetour ...</h1> ...`,
    highlights: ["Đạo diễn Victor Vũ tham dự", "Q&A cùng diễn viên"],
    schedule: [{ time: "18:30", title: "Giao lưu đoàn phim" }],
    price: "MIỄN PHÍ",
    location: "NCC",
    attendees: "1,780",
    organizer: "NCC"
  },

  {
    id: "news006",
    title: "THẺ QUYỀN LỰC CHO GEN Z",
    type: "event_cinema",
    posterUrl: cardGenz,
    time: "2025-04-24",
    badge: "U22",
    description: "Ưu đãi 55K dành cho Gen Z.",
    category: "KHUYẾN MÃI",
    icon: "Sparkles",
    fullDescription: `<h1>THẺ QUYỀN LỰC ...</h1> ...`,
    highlights: ["Vé 2D chỉ 55K", "Dành cho HSSV U22"],
    schedule: [{ time: "08:00", title: "Mở đăng ký" }],
    price: "55K",
    location: "NCC",
    attendees: "4,200",
    organizer: "NCC"
  },

  {
    id: "news007",
    title: "ĐỢT PHIM KỶ NIỆM 50 NĂM GIẢI PHÓNG MIỀN NAM",
    type: "event_cinema",
    posterUrl: ngayle,
    time: "28/04 – 04/05/2025",
    badge: "FREE",
    description: "Đợt phim kỷ niệm 50 năm Giải phóng miền Nam.",
    category: "SỰ KIỆN LỊCH SỬ",
    icon: "MapPin",
    fullDescription: `<h1>ĐỢT PHIM KỶ NIỆM ...</h1> ...`,
    highlights: ["6 phim lịch sử", "Phát vé miễn phí"],
    schedule: [{ time: "08:00", title: "Phát vé tại quầy" }],
    price: "MIỄN PHÍ",
    location: "NCC",
    attendees: "5,000",
    organizer: "NCC"
  },

  {
    id: "news008",
    title: "SUẤT CHIẾU ĐẶC BIỆT SÁNG THỨ 7 TẠI NCC",
    type: "event_cinema",
    posterUrl: movieAnimation,
    time: "19/04/2025",
    badge: "HOT",
    description: "Suất chiếu đặc biệt dành cho gia đình.",
    category: "SỰ KIỆN ĐẶC BIỆT",
    icon: "Sparkles",
    fullDescription: `<h1>SUẤT CHIẾU ĐẶC BIỆT ...</h1> ...`,
    highlights: ["Suất chiếu 10h30", "Nhận quà tặng"],
    schedule: [{ time: "10:30", title: "Chiếu phim" }],
    price: "45K",
    location: "NCC",
    attendees: "980",
    organizer: "NCC"
  },

  {
    id: "news009",
    title: "SUẤT CHIẾU ĐẶC BIỆT TẠI TRUNG TÂM CHIẾU PHIM QUỐC GIA!",
    type: "event_cinema",
    posterUrl: movieSpecial,
    time: "15/03/2025",
    badge: "SPECIAL",
    description: "Suất chiếu đặc biệt với phim hài lồng tiếng.",
    category: "SỰ KIỆN ĐẶC BIỆT",
    icon: "Sparkles",
    fullDescription: `<h1>CÁC BẠN ĐÃ BIẾT ...</h1> ...`,
    highlights: ["Chỉ 100 vé", "Phim hài cực vui"],
    schedule: [{ time: "10:10", title: "Chiếu phim" }],
    price: "45K",
    location: "NCC",
    attendees: "1,240",
    organizer: "NCC"
  },

  {
    id: "news010",
    title: "Chúc mừng ngày Quốc tế Phụ nữ!!!",
    type: "event_cinema",
    posterUrl: womanDay,
    time: "08/03/2025",
    badge: "8/3",
    description: "Sự kiện chúc mừng ngày Quốc tế Phụ nữ.",
    category: "SỰ KIỆN 8/3",
    icon: "Sparkles",
    fullDescription: `<h1>Chúc mừng ngày ...</h1> ...`,
    highlights: ["Nhiều ưu đãi", "Không khí ấm áp"],
    schedule: [{ time: "08:00", title: "Tặng quà & chúc mừng" }],
    price: "TÙY SUẤT CHIẾU",
    location: "NCC",
    attendees: "2,300",
    organizer: "NCC"
  },

  {
    id: "news011",
    title: "Đi xem phim Mùng 8-3 nhận ngay gấu xinh!!!",
    type: "event_cinema",
    posterUrl: eventWomanDay,
    time: "08/03/2025",
    badge: "8/3",
    description: "Nhận gấu bông khi xem phim ngày 8/3.",
    category: "KHUYẾN MÃI",
    icon: "Sparkles",
    fullDescription: `<h1>Đi xem phim ...</h1> ...`,
    highlights: ["Hơn 100 phần quà", "Áp dụng hóa đơn ≥ 180.000đ"],
    schedule: [{ time: "08:00", title: "Phát quà tới khi hết" }],
    price: "Theo giá vé",
    location: "NCC",
    attendees: "3,500",
    organizer: "NCC"
  },

  {
    id: "news012",
    title: "TƯNG BỪNG ƯU ĐÃI năm 2025 tại Trung tâm Chiếu phim Quốc gia ^^",
    type: "event_cinema",
    posterUrl: event2025,
    time: "Năm 2025",
    badge: "SALE",
    description: "Chuỗi ưu đãi xuyên suốt năm 2025.",
    category: "KHUYẾN MÃI 2025",
    icon: "Sparkles",
    fullDescription: `<h1>TƯNG BỪNG ƯU ĐÃI ...</h1> ...`,
    highlights: ["Ưu đãi mỗi tuần", "Vé 50K cuối tháng"],
    schedule: [{ time: "Thứ 2", title: "Áp dụng ưu đãi theo tuần" }],
    price: "TÙY CHƯƠNG TRÌNH",
    location: "NCC",
    attendees: "8,000",
    organizer: "NCC"
  },
  {
    id: "online001",
    title: "INDIE FILM MARATHON 2025",
    type: "event_online",
    posterUrl: "/assets/img/events/indie marathon.webp",
    time: "19:30 – 23:00 | 25.12.2025",
    badge: "LIVE",
    description: "Marathon 6 bộ phim indie xuất sắc được phát trực tuyến.",
    category: "SỰ KIỆN ONLINE",
    icon: "Film",
    fullDescription: `<h1>INDIE FILM MARATHON 2025</h1> ...`,
    highlights: [
      "6 phim indie độc lập",
      "Giao lưu trực tuyến cùng đạo diễn",
      "Livestream Q&A",
      "Giải thưởng cho người xem"
    ],
    schedule: [
      { time: "19:30", title: "Khai mạc & Phim 1" },
      { time: "20:30", title: "Phim 2 & Q&A" },
      { time: "21:40", title: "Phim 3" }
    ],
    price: "MIỄN PHÍ",
    location: "ONLINE",
    attendees: "2,547",
    organizer: "Galaxy Cinema"
  },

  {
    id: "online002",
    title: "LIVESTREAM GIAO LƯU ĐẠO DIỄN PHIM TẾT 2025",
    type: "event_online",
    posterUrl: "https://vnp.1cdn.vn/2025/01/19/dien-anh-viet-nam-at-ty-duong-dua-cua-cac-dao-dien-tram-ty-va-phim-lich-su-2-(2).png",
    time: "20:00 | 05.01.2025",
    badge: "LIVE",
    description: "Buổi giao lưu độc quyền cùng đạo diễn phim Tết.",
    category: "TALKSHOW TRỰC TUYẾN",
    icon: "Sparkles",
    fullDescription: `<h1>TALKSHOW ĐẠO DIỄN ...</h1> ...`,
    highlights: ["Chia sẻ hậu trường", "Hỏi đáp trực tuyến", "Giveaway quà tặng"],
    schedule: [{ time: "20:00", title: "Bắt đầu livestream" }],
    price: "MIỄN PHÍ",
    location: "Youtube / Facebook",
    attendees: "4,120",
    organizer: "NCC"
  },

  {
    id: "online003",
    title: "ONLINE PREMIERE: SIÊU ANH HÙNG 2025",
    type: "event_online",
    posterUrl: "https://i.ex-cdn.com/vietpress.vn/files/content/2025/07/10/gvbn9_5woaamynz-1617.jpg",
    time: "20:00 | 12.02.2025",
    badge: "PREMIERE",
    description: "Công chiếu trực tuyến bom tấn Siêu Anh Hùng 2025.",
    category: "CÔNG CHIẾU ONLINE",
    icon: "Clapperboard",
    fullDescription: `<h1>SIÊU ANH HÙNG 2025 – PREMIERE</h1> ...`,
    highlights: [
      "Công chiếu đầu tiên",
      "Độc quyền trailer hậu trường",
      "Chatbox với ekip"
    ],
    schedule: [{ time: "20:00", title: "Công chiếu phim" }],
    price: "79K",
    location: "ONLINE",
    attendees: "6,800",
    organizer: "Galaxy Studio"
  },
  {
    id: "mv001",
    title: "HÀNH TINH BÍ ẨN",
    type: "movie",
    posterUrl: "https://thegioiblu-ray.com/resources/200ceb26807d6bf99fd6f4f0d1ca54d4/BLURAY%203D-25G/d108.jpg",
    time: "2025",
    badge: "NEW",
    description: "Bom tấn khoa học viễn tưởng khám phá hành tinh mới.",
    category: "PHIM CHIẾU RẠP",
    icon: "Film",
    fullDescription: `<h1>HÀNH TINH BÍ ẨN</h1> ...`,
    highlights: ["Hiệu ứng hình ảnh đỉnh cao", "Âm thanh 4DX", "Cốt truyện hấp dẫn"],
    schedule: [],
    price: "75K – 95K",
    location: "Rạp toàn quốc",
    attendees: "12,400",
    organizer: "CGV"
  },

  {
    id: "mv002",
    title: "TUỔI TRẺ KHÔNG QUAY LẠI",
    type: "movie",
    posterUrl: "https://i.ytimg.com/vi/fMfV0jL8vJ4/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCNc1Q2_JaWm_VO_19Yy-bbOZGgEw",
    time: "2025",
    badge: "TOP",
    description: "Phim tâm lý – học đường cảm động về tuổi trẻ.",
    category: "DRAMA",
    icon: "Sparkles",
    fullDescription: `<h1>TUỔI TRẺ KHÔNG QUAY LẠI</h1> ...`,
    highlights: ["Nhạc phim viral", "Diễn xuất tự nhiên", "Nội dung ý nghĩa"],
    schedule: [],
    price: "70K – 90K",
    location: "Rạp toàn quốc",
    attendees: "9,800",
    organizer: "BHD"
  },

  {
    id: "mv003",
    title: "KỲ ÁN RỪNG SÂU",
    type: "movie",
    posterUrl: "https://i.ytimg.com/vi/HYPXvc4RcD4/maxresdefault.jpg",
    time: "2025",
    badge: "HOT",
    description: "Phim kinh dị sinh tồn đầy bí ẩn.",
    category: "KINH DỊ",
    icon: "MapPin",
    fullDescription: `<h1>KỲ ÁN RỪNG SÂU</h1> ...`,
    highlights: ["Bối cảnh rừng rậm", "Cú twist sốc", "Không dành cho người yếu tim"],
    schedule: [],
    price: "75K – 95K",
    location: "Rạp toàn quốc",
    attendees: "7,400",
    organizer: "Galaxy"
  },
  {
    id: "sr001",
    title: "THÁM TỬ BÓNG ĐÊM",
    type: "series",
    posterUrl: "https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2025/12/A%CC%89nh-ma%CC%80n-hi%CC%80nh-2025-12-06-lu%CC%81c-22.50.29-1.png",
    time: "Season 1 (2025)",
    badge: "NEW",
    description: "Series phá án ly kỳ với nhiều khúc mắc.",
    category: "TRINH THÁM",
    icon: "Clapperboard",
    fullDescription: `<h1>THÁM TỬ BÓNG ĐÊM</h1> ...`,
    highlights: ["Cốt truyện nhiều tầng", "Nhân vật sâu sắc"],
    schedule: [],
    price: "STREAMING",
    location: "Netflix",
    attendees: "540K",
    organizer: "Netflix"
  },

  {
    id: "sr002",
    title: "TÌNH YÊU KHÔNG ĐỊNH MỆNH",
    type: "series",
    posterUrl: "https://htvc.vn/uploads/editor/images/2%20tinh%20yeu%20va%20dinh%20menh%20(6).jpg",
    time: "Season 2 (2025)",
    badge: "TOP",
    description: "Rom-com hot nhất đầu năm.",
    category: "HÀI – TÌNH CẢM",
    icon: "Sparkles",
    fullDescription: `<h1>TÌNH YÊU KHÔNG ĐỊNH MỆNH</h1> ...`,
    highlights: ["Rating cao liên tục", "Cặp đôi được yêu thích"],
    schedule: [],
    price: "STREAMING",
    location: "VieOn",
    attendees: "320K",
    organizer: "Vie Channel"
  },

  {
    id: "sr003",
    title: "SIÊU ANH HÙNG ĐẠI CHIẾN",
    type: "series",
    posterUrl: "https://i.ytimg.com/vi/788VdUnK0f8/maxresdefault.jpg",
    time: "Season 3 (2025)",
    badge: "HERO",
    description: "Series hành động mãn nhãn.",
    category: "HÀNH ĐỘNG",
    icon: "Film",
    fullDescription: `<h1>SIÊU ANH HÙNG ĐẠI CHIẾN</h1> ...`,
    highlights: ["VFX đỉnh", "Combat đẹp mắt"],
    schedule: [],
    price: "STREAMING",
    location: "Disney+",
    attendees: "780K",
    organizer: "Marvel"
  }
  ];

  // Tìm event theo ID
  const event = eventsData.find((e) => e.id === eventId) || eventsData[0];
  console.log(event);

  // =======================
  // UI
  // =======================
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <div className="relative">
        <div className="relative h-[80vh] overflow-hidden">
          <button
            onClick={() => navigate("/event")}
            className="flex items-center gap-2 text-white hover:text-red-500 transition-colors
             absolute top-6 left-6 z-20"
          >
            <ArrowLeft size={30} />
          </button>
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {event.badge && (
            <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
              {event.badge}
            </div>
          )}
        </div>

        {/* OVERLAY CARD */}
        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 rounded-2xl border border-red-900/30 p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <img
                src={event.posterUrl}
                alt={event.title}
                className="w-64 h-96 object-cover rounded-xl border-2 border-red-900/50"
              />

              <div className="flex-1">
                <div className="inline-block bg-red-600/20 text-red-500 px-4 py-1 rounded-full mb-4 border border-red-600/30">
                  {event.category}
                </div>

                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

                <p className="text-gray-300 mb-6">{event.description}</p>

                {/* Info cards inline — không dùng component nhỏ nữa */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Time */}
                  <div className="bg-black/40 p-4 rounded-lg border border-red-900/20">
                    <div className="text-red-500 mb-2">
                      <Calendar />
                    </div>
                    <div className="text-xs text-gray-400">Thời gian</div>
                    <div className="text-sm font-semibold">{event.time}</div>
                  </div>

                  {/* Location */}
                  <div className="bg-black/40 p-4 rounded-lg border border-red-900/20">
                    <div className="text-red-500 mb-2">
                      <MapPin />
                    </div>
                    <div className="text-xs text-gray-400">Địa điểm</div>
                    <div className="text-sm font-semibold">
                      {event.location}
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="bg-black/40 p-4 rounded-lg border border-red-900/20">
                    <div className="text-red-500 mb-2">
                      <Users />
                    </div>
                    <div className="text-xs text-gray-400">Tham gia</div>
                    <div className="text-sm font-semibold">
                      {event.attendees}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-black/40 p-4 rounded-lg border border-red-900/20">
                    <div className="text-red-500 mb-2">
                      <Ticket />
                    </div>
                    <div className="text-xs text-gray-400">Giá vé</div>
                    <div className="text-sm font-semibold">{event.price}</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 py-4 rounded-lg font-bold hover:scale-[1.02] transition">
                  ĐĂNG KÝ NGAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-xl border border-red-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-500">
                <Film size={24} /> Về sự kiện
              </h2>

              <p className="text-gray-300 mb-6">{event.fullDescription}</p>

              <h3 className="text-xl font-bold mb-3">Điểm nổi bật</h3>
              <ul className="space-y-3">
                {event.highlights.map((hl, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-xl border border-red-900/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-500">
                <Clock size={24} /> Lịch trình
              </h2>

              <div className="space-y-4">
                {event.schedule.map((sc, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center gap-4 bg-black/40 border border-red-900/20 rounded-lg"
                  >
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                      {sc.time}
                    </div>
                    <div className="text-white font-semibold">{sc.title}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <aside className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-red-900/20">
              <h3 className="text-lg font-bold mb-4">Đơn vị tổ chức</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <Film size={24} />
                </div>
                <div>
                  <div className="font-semibold">{event.organizer}</div>
                  <div className="text-sm text-gray-400">Rạp chiếu phim</div>
                </div>
              </div>

              <button className="w-full border border-red-600 text-red-500 py-2 rounded-lg hover:bg-red-600 hover:text-white transition">
                Theo dõi
              </button>
            </aside>

            <aside className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-red-900/20">
              <h3 className="text-lg font-bold mb-4">Chia sẻ sự kiện</h3>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
                  Facebook
                </button>
                <button className="flex-1 bg-sky-500 py-2 rounded-lg hover:bg-sky-600">
                  Twitter
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
