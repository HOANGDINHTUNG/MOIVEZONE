// import { type FormEvent, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { selectShowtimeById } from "../stores/showtimesSlice";
// import { useAppDispatch, useAppSelector } from "../hooks/UseCustomeRedux";
// import { setOrderSummary } from "../stores/ticketSlice";

// const PaymentPage: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const ticket = useAppSelector((state) => state.ticket);
//   const moviesState = useAppSelector((state) => state.movies);

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState<"qr" | "offline">("qr");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const noSelection =
//     !ticket.selectedShowtimeId ||
//     !ticket.selectedMovieId ||
//     ticket.selectedSeats.length === 0;

//   const showtime = useAppSelector((state) =>
//     selectShowtimeById(state, ticket.selectedShowtimeId)
//   );

//   const movie = useMemo(
//     () =>
//       moviesState.selectedMovie ||
//       moviesState.nowPlaying.find((m) => m.id === ticket.selectedMovieId) ||
//       moviesState.upcoming.find((m) => m.id === ticket.selectedMovieId) ||
//       null,
//     [moviesState, ticket.selectedMovieId]
//   );

//   const selectedSeatsDetail = useMemo(() => {
//     if (!showtime) return [];
//     return showtime.seats.filter((seat) =>
//       ticket.selectedSeats.includes(seat.id)
//     );
//   }, [showtime, ticket.selectedSeats]);

//   const totalAmount = selectedSeatsDetail.reduce(
//     (sum, seat) => sum + seat.price,
//     0
//   );

//   if (noSelection || !showtime || !movie) {
//     return (
//       <div className="payment-page container">
//         <p className="mt-10 text-center">
//           Bạn chưa chọn suất chiếu hoặc ghế. Vui lòng chọn phim và ghế trước.
//         </p>
//         <div className="flex justify-center mt-4">
//           <button className="btn-primary" onClick={() => navigate("/")}>
//             Về trang chủ
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (!fullName || !email || !phone) {
//       alert("Vui lòng điền đầy đủ thông tin khách hàng.");
//       return;
//     }

//     setIsProcessing(true);

//     const order = {
//       movieId: movie.id,
//       showtimeId: showtime.id,
//       seatIds: ticket.selectedSeats,
//       totalAmount,
//       customer: {
//         fullName,
//         email,
//         phone,
//       },
//       createdAt: new Date().toISOString(),
//     };

//     // Giả lập “xử lý thanh toán” 1.5s rồi mới sang trang thành công
//     setTimeout(() => {
//       dispatch(setOrderSummary(order));
//       setIsProcessing(false);
//       navigate("/payment-success");
//     }, 1500);
//   };

//   const dateObj = new Date(showtime.date);
//   const dateStr = dateObj.toLocaleDateString("vi-VN", {
//     weekday: "long",
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });

//   return (
//     <div className="payment-page container">
//       <h1 className="payment-title">THANH TOÁN VÉ XEM PHIM</h1>

//       <div className="payment-layout">
//         {/* CỘT TRÁI - thông tin đặt vé + form */}
//         <section className="booking-summary">
//           <h2>Thông tin đặt vé</h2>

//           <div className="movie-box">
//             <img
//               src={movie.posterUrl}
//               alt={movie.title}
//               className="movie-poster"
//             />
//             <div className="movie-info">
//               <h3>{movie.title}</h3>
//               <p>
//                 <span className="label">Suất chiếu:</span> {showtime.startTime}{" "}
//                 - {showtime.endTime}
//               </p>
//               <p>
//                 <span className="label">Ngày:</span> {dateStr}
//               </p>
//               <p>
//                 <span className="label">Phòng chiếu:</span> {showtime.room}
//               </p>
//               <p>
//                 <span className="label">Ghế:</span>{" "}
//                 {ticket.selectedSeats.join(", ")}
//               </p>
//             </div>
//           </div>

//           <div className="price-summary">
//             <div className="price-row">
//               <span>Giá vé (theo loại ghế)</span>
//               <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
//             </div>
//             <div className="price-row">
//               <span>Phí giao dịch</span>
//               <span>0đ</span>
//             </div>
//             <div className="price-row total">
//               <span>Tổng cộng</span>
//               <span className="total-amount">
//                 {totalAmount.toLocaleString("vi-VN")}đ
//               </span>
//             </div>
//           </div>

//           <form className="customer-form" onSubmit={handleSubmit}>
//             <h2>Thông tin khách hàng</h2>
//             <div className="form-group">
//               <label htmlFor="fullName">Họ và tên</label>
//               <input
//                 id="fullName"
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder="Nhập họ tên"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email nhận vé</label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="example@gmail.com"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="phone">Số điện thoại</label>
//               <input
//                 id="phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Nhập số điện thoại"
//                 required
//               />
//             </div>

//             <div className="form-group payment-method">
//               <label>Phương thức thanh toán</label>
//               <div className="method-options">
//                 <label>
//                   <input
//                     type="radio"
//                     name="method"
//                     value="qr"
//                     checked={paymentMethod === "qr"}
//                     onChange={() => setPaymentMethod("qr")}
//                   />
//                   <span>Chuyển khoản qua VietQR</span>
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="method"
//                     value="offline"
//                     checked={paymentMethod === "offline"}
//                     onChange={() => setPaymentMethod("offline")}
//                   />
//                   <span>Thanh toán tại quầy</span>
//                 </label>
//               </div>
//             </div>

//             <div className="btn-row">
//               <button
//                 type="button"
//                 className="btn-outlinee1"
//                 onClick={() => navigate(-1)}
//               >
//                 Quay lại
//               </button>
//               <button type="submit" className="btn-primary1">
//                 Xác nhận thanh toán
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* CỘT PHẢI - VietQR / hướng dẫn */}
//         <aside className="payment-side">
//           {paymentMethod === "qr" ? (
//             <div className="qr-box">
//               <h2>Quét VietQR để thanh toán</h2>

//               {/* Thông tin tài khoản ngân hàng */}
//               <div className="vietqr-account">
//                 <p>
//                   <span>Ngân hàng:</span> Vietcombank (VCB)
//                 </p>
//                 <p>
//                   <span>Số tài khoản:</span> 0123456789
//                 </p>
//                 <p>
//                   <span>Chủ tài khoản:</span> RAP CHIEU PHIM QUOC GIA
//                 </p>
//                 <p>
//                   <span>Số tiền:</span> {totalAmount.toLocaleString("vi-VN")}đ
//                 </p>
//                 <p>
//                   <span>Nội dung:</span>{" "}
//                   {`VE-${ticket.selectedSeats.join("-")}`}
//                 </p>
//               </div>

//               {/* QR VietQR (ảnh template) */}
//               <div className="qr-image-wrapper">
//                 <img
//                   src="/assets/img/payment/vietqr-demo.png"
//                   alt="VietQR Code"
//                   className="qr-image"
//                 />
//               </div>

//               <p className="note">
//                 Vui lòng thanh toán đúng số tiền và nội dung chuyển khoản để hệ
//                 thống tự động xác nhận vé.
//               </p>
//               <ul className="note-list">
//                 <li>
//                   Vé sẽ được gửi về email sau khi thanh toán được ghi nhận thành
//                   công.
//                 </li>
//                 <li>
//                   Nếu đã chuyển khoản nhưng chưa nhận được vé, vui lòng liên hệ
//                   hotline hỗ trợ của rạp.
//                 </li>
//               </ul>
//             </div>
//           ) : (
//             <div className="qr-box">
//               <h2>Thanh toán tại quầy</h2>
//               <p>
//                 Bạn đã chọn hình thức thanh toán tại quầy. Vui lòng đến quầy vé
//                 trước giờ chiếu ít nhất <strong>30 phút</strong> để hoàn tất
//                 thanh toán.
//               </p>
//               <p>
//                 Nhân viên sẽ hỗ trợ xuất vé dựa trên thông tin đặt vé và số điện
//                 thoại bạn đã cung cấp.
//               </p>
//             </div>
//           )}
//         </aside>
//       </div>

//       {/* LOADER OVERLAY */}
//       {isProcessing && (
//         <div className="payment-loader-overlay">
//           <div className="payment-loader">
//             <div className="sk-chase">
//               <div className="sk-chase-dot" />
//               <div className="sk-chase-dot" />
//               <div className="sk-chase-dot" />
//               <div className="sk-chase-dot" />
//               <div className="sk-chase-dot" />
//               <div className="sk-chase-dot" />
//             </div>
//             <p>Đang xử lý thanh toán...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;
