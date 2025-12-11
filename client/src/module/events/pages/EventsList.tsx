import { useState, useEffect } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Film,
  Sparkles,
  TrendingUp,
  MapPin,
  Clapperboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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


// --- INTERFACES (Định nghĩa kiểu dữ liệu thống nhất) ---

type ContentType = "movie" | "series" | "event_online" | "event_cinema";

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  posterUrl: string;

  genre?: string;
  rating?: number;
  time: string;
  badge: string;
  description: string;
  category: string;
  icon?: keyof typeof IconMap;
  fullDescription: string,
  highlights: string[],
  schedule: {time: string, title:string}[],
  price:string,
  location: string,
  attendees: string,
  organizer: string

}

interface EventCardProps {
  item: ContentItem;
}

// Ánh xạ icon
const IconMap = {
  Film: Film,
  Sparkles: Sparkles,
  TrendingUp: TrendingUp,
  MapPin: MapPin,
  Clapperboard: Clapperboard,
};

// --- DỮ LIỆU MẪU (Sử dụng dữ liệu gốc của bạn) ---


const upcomingEventsAndSeries: ContentItem[] = [
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

const seriesOnly = upcomingEventsAndSeries.filter(
  (item) => item.type === "series"
);
const cinemaEvents = upcomingEventsAndSeries.filter(
  (item) =>
    item.type === "event_cinema" ||
    item.category === "CÔNG CHIẾU RẠP" ||
    item.category === "LIÊN HOAN RẠP" ||
    item.category === "KHUYẾN MÃI RẠP"
);
const onlineEvents = upcomingEventsAndSeries.filter(
  (item) => item.type === "event_online"
);

// --- COMPONENTS ---

// Component Thẻ Sự Kiện Tái Sử Dụng
const EventCard: React.FC<EventCardProps> = ({ item }) => {
  // ... (Phần EventCard không thay đổi)
  const isCinema = item.type === "event_cinema";
  const iconKey = item.icon || (isCinema ? "MapPin" : "Clapperboard");
  const EventIcon = IconMap[iconKey as keyof typeof IconMap];

  const navigate = useNavigate()
  // Màu sắc thống nhất tone Đỏ/Rose (Giảm độ bão hòa để dễ nhìn)
  const borderColor = "border-red-800/50";
  const shadowColor = "shadow-red-800/15";
  const buttonClass = isCinema
    ? "bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 shadow-red-800/30 font-bold"
    : "bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 shadow-rose-700/30 font-bold";

  const categoryBadge =
    "bg-red-900/80 border-red-800/50 text-red-300 font-medium";
  const textPrimary = "text-gray-200 group-hover:text-red-300";

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border-2 ${borderColor} transition-all duration-500 hover:shadow-2xl ${shadowColor} hover:-translate-y-1.5`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-100 group-hover:opacity-20 transition-opacity duration-500">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent"></div>

      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs border ${categoryBadge}`}
            >
              <div className="flex items-center gap-1">
                {EventIcon && <EventIcon className="w-4 h-4 text-red-500" />}
                {item.category}
              </div>
            </span>
          </div>
          <span className="px-3 py-1 bg-red-700 text-gray-200 rounded-full text-xs font-bold animate-pulse shadow-lg shadow-red-700/30">
            {item.badge}
          </span>
        </div>

        {/* Content */}
        <div className="h-40">

        <h3
          className={`text-xl md:text-2xl font-black mb-3 ${textPrimary} transition-colors`}
        >
          {item.title}
        </h3>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {item.description}
        </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="font-semibold">{item.time}</span>
          </div>
          <button
            className={`px-5 py-2 text-gray-200 rounded-lg text-sm transition-all transform hover:scale-[1.03] ${buttonClass}`} onClick={() => navigate(`/event/${item.id}`)}
          >
            {isCinema ? "ĐẶT VÉ RẠP" : "XEM NGAY"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EVENTS LIST MAIN COMPONENT ---

const EventsList: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(2);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  const navigate = useNavigate()

  // Đảm bảo chỉ số bắt đầu không vượt quá giới hạn mảng
  const safeCurrentSlide = Math.min(
    Math.max(0, currentSlide),
    upcomingEventsAndSeries.length - 1
  );
  const currentMovie: ContentItem = upcomingEventsAndSeries[safeCurrentSlide];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingEventsAndSeries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = (): void => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % upcomingEventsAndSeries.length);
  };

  const prevSlide = (): void => {
    setIsAutoPlay(false);
    setCurrentSlide(
      (prev) => (prev - 1 + upcomingEventsAndSeries.length) % upcomingEventsAndSeries.length
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 overflow-x-hidden font-sans">
      {/* Dynamic Hero Background - Sử dụng posterUrl */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none transition-all duration-1000 ease-out z-0 ">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 h-[1000px]"
          style={{
            backgroundImage: `url(${currentMovie.posterUrl})`,
            opacity:0.3
          }}
        ></div>
        {/* Lớp phủ Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/50"></div>

        {/* Hiệu ứng hạt sáng (Blur) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-900/10 rounded-full blur-[120px] animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-300 drop-shadow-md">
              PHIM ĐANG HOT & SỰ KIỆN NỔI BẬT
            </h1>
            <p className="text-lg text-gray-400 mt-3 font-medium">
              Khám phá các suất chiếu và chương trình mới nhất.
            </p>
          </div>

          {/* Movie Carousel (Đã SỬA LỖI CODE THỪA và Vị Trí) */}
          <div className="relative mb-20">
            <div className="flex items-center justify-center gap-6 mb-12">
              {/* Vùng chứa Carousel, đặt relative để các thẻ con absolute được căn chỉnh tương đối */}
              <div className="relative w-full max-w-5xl mx-auto h-[400px] flex justify-center items-center">
                {upcomingEventsAndSeries.map((movie, index) => {
                  const position =
                    (index - safeCurrentSlide + upcomingEventsAndSeries.length) %
                    upcomingEventsAndSeries.length;
                  const isCenter = position === 0;

                  let translateX = 0;
                  let scale = 0.8;
                  let opacity = 0;
                  let zIndex = 10;

                  // Logic vị trí mới, sử dụng `transform` chính xác hơn
                  if (isCenter) {
                    translateX = 0;
                    scale = 1.1;
                    opacity = 1;
                    zIndex = 40;
                  } else if (position === upcomingEventsAndSeries.length - 1) {
                    // Thẻ ngay trước (bên trái)
                    translateX = -300;
                    scale = 0.95;
                    opacity = 0.7;
                    zIndex = 30;
                  } else if (position === 1) {
                    // Thẻ ngay sau (bên phải)
                    translateX = 300;
                    scale = 0.95;
                    opacity = 0.7;
                    zIndex = 30;
                  } else {
                    // Các thẻ còn lại: đẩy ra xa và ẩn
                    translateX = position < safeCurrentSlide ? -600 : 600;
                    scale = 0.7;
                    opacity = 0;
                    zIndex = 10;
                  }

                  return (
                    <div
                      key={movie.id}
                      className={`absolute transition-all duration-700 ease-out rounded-2xl overflow-hidden cursor-pointer`}
                      style={{
                        width: "250px",
                        height: "350px",
                        zIndex: zIndex,
                        // Dịch chuyển về trung tâm 50% rồi áp dụng dịch chuyển tương đối
                        transform: `translateX(-50%) translateX(${translateX}px) scale(${scale})`,
                        left: "50%",
                        opacity: opacity,
                        transitionProperty: "transform, opacity",
                        transitionTimingFunction:
                          "cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {/* Gradient Border (Viền Đỏ trung tâm) */}
                      {isCenter && (
                        <div className="absolute inset-0 p-1 rounded-2xl z-0 bg-gradient-to-br from-red-700 to-rose-800">
                          <div className="absolute inset-1 bg-neutral-950 rounded-2xl"></div>
                        </div>
                      )}

                      {/* Movie Poster Content (KHÔNG CÓ DỮ LIỆU CODE THỪA) */}
                      <div
                        className={`relative ${
                          isCenter ? "inset-1" : "inset-0"
                        } rounded-2xl overflow-hidden group h-[342px] w-[241px]`}
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent ${
                            isCenter ? "opacity-95" : "opacity-85"
                          }`}
                        ></div>

                        {/* Info */}
                        <div className="absolute top-0 left-0 right-0 p-4 transform transition-all duration-300">
                          <h3 className="text-md font-bold text-gray-200 mb-2 uppercase drop-shadow-lg truncate">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {movie.genre && (
                              <span className="px-2 py-1 bg-neutral-800/50 backdrop-blur-sm rounded-full text-xs font-bold text-gray-400 border border-neutral-700">
                                {movie.genre}
                              </span>
                            )}
                            {movie.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-md" />
                                <span className="text-sm font-bold text-yellow-500 drop-shadow-md">
                                  {movie.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CTA */}
                        {isCenter && (
                          <div onClick={() => navigate(`/event/${movie.id}`)} className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="px-5 py-2 bg-red-700 hover:bg-red-600 text-gray-200 rounded-lg text-sm font-bold transition-all shadow-xl shadow-red-700/40">
                              XEM CHI TIẾT
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Các nút điều hướng (đã căn chỉnh lại vị trí tuyệt đối) */}
              <button
                onClick={prevSlide}
                className="group absolute left-4 top-[50%] -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-red-800/50 hover:border-red-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg shadow-red-800/15 z-50"
              >
                <ChevronLeft className="w-6 h-6 text-red-400 group-hover:text-red-300" />
              </button>

              <button
                onClick={nextSlide}
                className="group absolute right-4 top-[50%] -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-red-800/50 hover:border-red-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg shadow-red-800/15 z-50"
              >
                <ChevronRight className="w-6 h-6 text-red-400 group-hover:text-red-300" />
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 pt-4">
              {upcomingEventsAndSeries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentSlide(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === safeCurrentSlide
                      ? "w-8 h-2 bg-gradient-to-r from-red-600 to-rose-600 shadow-md shadow-red-600/30"
                      : "w-2 h-2 bg-neutral-700 hover:bg-neutral-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online Events Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-rose-700 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-400">
              CÔNG CHIẾU VÀ SỰ KIỆN NỔI BẬT (ONLINE)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
            {onlineEvents.map((item) => (
              <EventCard key={item.id} item={item}  />
            ))}
          </div>
        </div>
      </section>

      {/* Series Section - Online */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-12 bg-gradient-to-b from-rose-600 to-red-700 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-400">
              SERIES & SHOW ĐỘC QUYỀN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {seriesOnly.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Cinema Events Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-12 bg-gradient-to-b from-red-700 to-rose-800 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-500">
              SỰ KIỆN & KHUYẾN MÃI RẠP CHIẾU
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cinemaEvents.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default EventsList;
