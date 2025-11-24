// // src/pages/admin/AdminSchedulePage.tsx
// import { useState } from "react";
// import { mockAdminSchedule, type AdminShowtime } from "../mock/mockAdminSchedule";
// import { AdminTable, type Column } from "../components/admin/AdminTable";
// import AdminModal from "../components/admin/AdminModal";
// import Barcode from "../components/admin/Barcode";

// const AdminSchedulePage: React.FC = () => {
//   const [showtimes] =
//     useState<AdminShowtime[]>(mockAdminSchedule);
//   const [dateFilter, setDateFilter] = useState<string>("");
//   const [roomFilter, setRoomFilter] = useState<string>("all");

//   const [selectedShowtime, setSelectedShowtime] =
//     useState<AdminShowtime | null>(null);
//   const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

//   const filteredShowtimes = showtimes.filter((s) => {
//     const matchDate = !dateFilter || s.date === dateFilter;
//     const matchRoom = roomFilter === "all" || s.room === roomFilter;
//     return matchDate && matchRoom;
//   });

//   const columns: Column<AdminShowtime>[] = [
//     { key: "movieTitle", title: "Phim" },
//     { key: "room", title: "Phòng" },
//     {
//       key: "date",
//       title: "Ngày",
//       render: (row) => new Date(row.date).toLocaleDateString("vi-VN"),
//     },
//     {
//       key: "startTime",
//       title: "Giờ chiếu",
//       render: (row) => `${row.startTime} - ${row.endTime}`,
//     },
//     {
//       key: "sold",
//       title: "Vé đã bán",
//       render: (row) => `${row.sold}/${row.totalSeats}`,
//     },
//     {
//       key: "actions",
//       title: "Hành động",
//       render: (row) => (
//         <div className="table-actions">
//           <button
//             className="btn-outlinee1"
//             onClick={() => openTicketModal(row)}
//           >
//             Xem vé / Barcode
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const openTicketModal = (st: AdminShowtime) => {
//     setSelectedShowtime(st);
//     setIsTicketModalOpen(true);
//   };

//   return (
//     <div className="admin-page admin-schedule">
//       <div className="admin-page-header">
//         <h2>Quản lý lịch chiếu</h2>
//       </div>

//       <div className="admin-filters">
//         <input
//           type="date"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           className="filter-input"
//         />
//         <select
//           value={roomFilter}
//           onChange={(e) => setRoomFilter(e.target.value)}
//           className="filter-select"
//         >
//           <option value="all">Tất cả phòng</option>
//           <option value="P1">Phòng 1</option>
//           <option value="P2">Phòng 2</option>
//           <option value="P3">Phòng 3</option>
//         </select>
//       </div>

//       <AdminTable
//         columns={columns}
//         data={filteredShowtimes}
//         rowKey={(row) => row.id}
//       />

//       {/* Modal vé + barcode cho suất chiếu */}
//       <AdminModal
//         open={isTicketModalOpen}
//         title="Thông tin vé & Barcode"
//         onClose={() => setIsTicketModalOpen(false)}
//       >
//         {selectedShowtime && (
//           <div className="ticket-modal-content">
//             <p>
//               <b>Phim:</b> {selectedShowtime.movieTitle}
//             </p>
//             <p>
//               <b>Phòng:</b> {selectedShowtime.room}
//             </p>
//             <p>
//               <b>Ngày:</b>{" "}
//               {new Date(selectedShowtime.date).toLocaleDateString("vi-VN")}
//             </p>
//             <p>
//               <b>Giờ chiếu:</b> {selectedShowtime.startTime} -{" "}
//               {selectedShowtime.endTime}
//             </p>
//             <p>
//               <b>Vé đã bán:</b> {selectedShowtime.sold}/
//               {selectedShowtime.totalSeats}
//             </p>

//             <div className="ticket-barcode-section">
//               <h4>Mã vé mẫu</h4>
//               <Barcode value={`ST-${selectedShowtime.id}`} />
//             </div>

//             <p className="ticket-note">
//               (Ở bản thật, phần này có thể liệt kê danh sách vé, mã QR / mã vạch
//               cho từng vé. Hiện mình demo 1 barcode cho suất chiếu.)
//             </p>
//           </div>
//         )}
//       </AdminModal>
//     </div>
//   );
// };

// export default AdminSchedulePage;
