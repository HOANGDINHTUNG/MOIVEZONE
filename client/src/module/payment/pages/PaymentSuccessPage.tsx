// // src/pages/PaymentSuccessPage.tsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { selectShowtimeById } from "../stores/showtimesSlice";

// import { useAppDispatch, useAppSelector } from "../hooks/UseCustomeRedux";
// import { resetOrder } from "../stores/ticketSlice";

// export default function PaymentSuccessPage() {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { currentOrder } = useAppSelector((state) => state.ticket);
//   const moviesState = useAppSelector((state) => state.movies);
//   const showtime = useAppSelector((state) =>
//     selectShowtimeById(state, currentOrder?.showtimeId)
//   );

//   useEffect(() => {
//     // Option: sau khi user rời trang này (unmount) thì clear order
//     return () => {
//       // dispatch(resetOrder());
//     };
//   }, [dispatch]);

//   if (!currentOrder) {
//     return (
//       <div className="payment-success container">
//         <p className="mt-10 text-center">
//           Không tìm thấy thông tin đơn hàng. Có thể bạn chưa hoàn tất thanh
//           toán.
//         </p>
//         <div className="flex justify-center mt-4">
//           <button className="btn-primary" onClick={() => navigate("/")}>
//             Về trang chủ
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const movie =
//     moviesState.selectedMovie ||
//     moviesState.nowPlaying.find((m) => m.id === currentOrder.movieId) ||
//     moviesState.upcoming.find((m) => m.id === currentOrder.movieId) ||
//     null;

//   const dateStr =
//     showtime &&
//     new Date(showtime.date).toLocaleDateString("vi-VN", {
//       weekday: "long",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });

//   return (
//     <div className="payment-success container">
//       <div className="success-box">
//         <div className="success-icon">
//           <img src="/assets/img/payment/check-circle.svg" alt="Success" />
//         </div>
//         <h1>ĐẶT VÉ THÀNH CÔNG</h1>
//         <p>
//           Cảm ơn bạn đã đặt vé tại hệ thống rạp. Thông tin vé đã được gửi đến
//           email: <strong>{currentOrder.customer.email}</strong>
//         </p>

//         <div className="ticket-info">
//           <h2>Thông tin vé</h2>
//           {movie && (
//             <p>
//               <span>Phim:</span> {movie.title}
//             </p>
//           )}
//           {showtime && (
//             <>
//               <p>
//                 <span>Suất chiếu:</span> {showtime.startTime} -{" "}
//                 {showtime.endTime}
//               </p>
//               <p>
//                 <span>Ngày:</span> {dateStr}
//               </p>
//               <p>
//                 <span>Phòng chiếu:</span> {showtime.room}
//               </p>
//             </>
//           )}
//           <p>
//             <span>Ghế:</span> {currentOrder.seatIds.join(", ")}
//           </p>
//           <p>
//             <span>Tên khách hàng:</span> {currentOrder.customer.fullName}
//           </p>
//           <p>
//             <span>Số điện thoại:</span> {currentOrder.customer.phone}
//           </p>
//           <p>
//             <span>Tổng tiền:</span>{" "}
//             {currentOrder.totalAmount.toLocaleString("vi-VN")}đ
//           </p>
//         </div>

//         <div className="success-actions">
//           <button
//             className="btn-primary1"
//             onClick={() => {
//               dispatch(resetOrder());
//               navigate("/");
//             }}
//           >
//             Về trang chủ
//           </button>
//           <button
//             className="btn-outlinee1"
//             onClick={() => {
//               // có thể mở popup in vé, hoặc đơn giản reload
//               window.print();
//             }}
//           >
//             In vé
//           </button>
//         </div>

//         <p className="note">
//           Vui lòng có mặt trước giờ chiếu ít nhất 15–30 phút để ổn định chỗ
//           ngồi.
//         </p>
//       </div>
//     </div>
//   );
// }
