// // src/pages/admin/AdminMoviesPage.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { mockAdminMovies } from "../mock/mockAdminMovies";
// import { AdminTable, type Column } from "../components/admin/AdminTable";
// import AdminModal from "../components/admin/AdminModal";

// interface AdminMovie {
//   id: string;
//   title: string;
//   posterUrl: string;
//   duration: number;
//   ageRating: string;
//   categories: string[];
//   status: "now_playing" | "upcoming" | "archived";
// }

// const AdminMoviesPage: React.FC = () => {
//   const [movies, setMovies] = useState<AdminMovie[]>(mockAdminMovies);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     AdminMovie["status"] | "all"
//   >("all");

//   const [editingMovie, setEditingMovie] = useState<AdminMovie | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const navigate = useNavigate();

//   const filteredMovies = movies.filter((m) => {
//     const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter === "all" || m.status === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   const columns: Column<AdminMovie>[] = [
//     {
//       key: "posterUrl",
//       title: "Poster",
//       render: (row) => (
//         <img
//           src={row.posterUrl}
//           alt={row.title}
//           style={{ width: 60, borderRadius: 4 }}
//         />
//       ),
//     },
//     { key: "title", title: "Tên phim" },
//     {
//       key: "duration",
//       title: "Thời lượng",
//       render: (row) => `${row.duration} phút`,
//     },
//     {
//       key: "ageRating",
//       title: "P.L.Tuổi",
//     },
//     {
//       key: "categories",
//       title: "Thể loại",
//       render: (row) => row.categories.join(", "),
//     },
//     {
//       key: "status",
//       title: "Trạng thái",
//       render: (row) => {
//         if (row.status === "now_playing") return "Đang chiếu";
//         if (row.status === "upcoming") return "Sắp chiếu";
//         return "Ngừng chiếu";
//       },
//     },
//     {
//       key: "actions",
//       title: "Hành động",
//       render: (row) => (
//         <div className="table-actions">
//           <button className="btn-outlinee1" onClick={() => handleEdit(row)}>
//             Sửa
//           </button>
//           <button className="btn-danger" onClick={() => handleDelete(row.id)}>
//             Xóa
//           </button>
//           <button
//             className="btn-outline"
//             onClick={() => navigate(`/movie/${row.id}`)}
//           >
//             Xem public
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const handleEdit = (movie: AdminMovie) => {
//     setEditingMovie(movie);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm("Xóa phim này?")) {
//       setMovies((prev) => prev.filter((m) => m.id !== id));
//     }
//   };

//   const handleCreate = () => {
//     setEditingMovie(null);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     const newMovie: AdminMovie = {
//       id: editingMovie?.id || Date.now().toString(),
//       title: (formData.get("title") as string) || "",
//       posterUrl:
//         (formData.get("posterUrl") as string) ||
//         "/assets/img/movies/default.jpg",
//       duration: Number(formData.get("duration") || 90),
//       ageRating: (formData.get("ageRating") as string) || "P",
//       categories:
//         (formData.get("categories") as string)
//           .split(",")
//           .map((c) => c.trim()) || [],
//       status: (formData.get("status") as AdminMovie["status"]) || "now_playing",
//     };

//     if (editingMovie) {
//       setMovies((prev) =>
//         prev.map((m) => (m.id === editingMovie.id ? newMovie : m))
//       );
//     } else {
//       setMovies((prev) => [newMovie, ...prev]);
//     }

//     setIsModalOpen(false);
//   };

//   return (
//     <div className="admin-page admin-movies">
//       <div className="admin-page-header">
//         <h2>Quản lý phim</h2>
//         <button className="btn-primary" onClick={handleCreate}>
//           + Thêm phim
//         </button>
//       </div>

//       <div className="admin-filters">
//         <input
//           type="text"
//           placeholder="Tìm theo tên phim..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="filter-input"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as AdminMovie["status"])}
//           className="filter-select"
//         >
//           <option value="all">Tất cả trạng thái</option>
//           <option value="now_playing">Đang chiếu</option>
//           <option value="upcoming">Sắp chiếu</option>
//           <option value="archived">Ngừng chiếu</option>
//         </select>
//       </div>

//       <AdminTable
//         columns={columns}
//         data={filteredMovies}
//         rowKey={(row) => row.id}
//       />

//       <AdminModal
//         open={isModalOpen}
//         title={editingMovie ? "Sửa phim" : "Thêm phim mới"}
//         onClose={() => setIsModalOpen(false)}
//       >
//         <form className="admin-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Tên phim</label>
//             <input
//               name="title"
//               defaultValue={editingMovie?.title || ""}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Poster URL</label>
//             <input
//               name="posterUrl"
//               defaultValue={editingMovie?.posterUrl || ""}
//             />
//           </div>
//           <div className="form-group">
//             <label>Thời lượng (phút)</label>
//             <input
//               type="number"
//               name="duration"
//               defaultValue={editingMovie?.duration || 90}
//             />
//           </div>
//           <div className="form-group">
//             <label>Phân loại tuổi</label>
//             <input
//               name="ageRating"
//               defaultValue={editingMovie?.ageRating || "P"}
//             />
//           </div>
//           <div className="form-group">
//             <label>Thể loại (ngăn cách bởi dấu phẩy)</label>
//             <input
//               name="categories"
//               defaultValue={editingMovie?.categories.join(", ") || ""}
//             />
//           </div>
//           <div className="form-group">
//             <label>Trạng thái</label>
//             <select
//               name="status"
//               defaultValue={editingMovie?.status || "now_playing"}
//             >
//               <option value="now_playing">Đang chiếu</option>
//               <option value="upcoming">Sắp chiếu</option>
//               <option value="archived">Ngừng chiếu</option>
//             </select>
//           </div>

//           <div className="modal-actions">
//             <button
//               type="button"
//               className="btn-outlinee1"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Hủy
//             </button>
//             <button type="submit" className="btn-primary1">
//               Lưu
//             </button>
//           </div>
//         </form>
//       </AdminModal>
//     </div>
//   );
// };

// export default AdminMoviesPage;
