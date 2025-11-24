// export default function Footer() {
//   return (
//     <footer className="main-footer">
//       <nav className="footer-nav">
//         <a href="#">Giới thiệu</a>
//         <a href="#">Tiện ích online</a>
//         <a href="#">Điều khoản sử dụng</a>
//         <a href="#">Chính sách bảo mật</a>
//         <a href="#">Liên hệ</a>
//         <a href="#">Tuyển dụng</a>
//       </nav>

//       <div className="footer-icons">
//         <div className="footer-icons-top">
//           <img src="public/assets/img/facebook.png" alt="Facebook" />
//           <img src="public/assets/img/youtube.png" alt="Youtube" />
//         </div>
//         <div className="footer-icons-bottom">
//           <img src="public/assets/img/Appstore.png" alt="App Store" />
//           <img src="public/assets/img/GGPlay.png" alt="Google Play" />
//         </div>
//       </div>

//       <div className="footer-info">
//         <p>Trung tâm Chiếu phim Quốc gia</p>
//         <p>Địa chỉ: 87 Láng Hạ, Quận Đống Đa, Hà Nội</p>
//         <p>Điện thoại: (024) 3514 1791 | Email: info@ncc.vn</p>
//         <p>© {new Date().getFullYear()} NCC Cinema. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// }
// src/components/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center bg-neutral-100/60 dark:bg-neutral-600/40 text-neutral-500 dark:text-neutral-400 py-3 mt-6">
      <div className="flex items-center justify-center gap-4 mb-1">
        <Link to="/" className="hover:underline">
          About
        </Link>
        <Link to="/" className="hover:underline">
          Contact
        </Link>
      </div>
      <p className="text-xs">Created by Dynamic Coding with Amit (refactor TS)</p>
    </footer>
  );
};

export default Footer;
