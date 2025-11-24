// // src/pages/admin/AdminUsersPage.tsx
// import { useState } from "react";
// import { mockAdminUsers } from "../mock/mockAdminUsers";
// import { AdminTable, type Column } from "../components/admin/AdminTable";
// import AdminModal from "../components/admin/AdminModal";
// import type { User } from "../types/interface/server/user";

// const AdminUsersPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>(mockAdminUsers);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<User["status"] | "all">(
//     "all"
//   );
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const filteredUsers = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       u.name.toLowerCase().includes(q) ||
//       u.email.toLowerCase().includes(q) ||
//       u.phone.includes(search);
//     const matchStatus = statusFilter === "all" || u.status === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   const columns: Column<User>[] = [
//     { key: "name", title: "Tên khách hàng" },
//     { key: "email", title: "Email" },
//     { key: "phone", title: "Số điện thoại" },
//     {
//       key: "totalTickets",
//       title: "Số vé đã mua",
//     },
//     {
//       key: "createdAt",
//       title: "Ngày tạo",
//       render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
//     },
//     {
//       key: "status",
//       title: "Trạng thái",
//       render: (row) => (row.status === "active" ? "Hoạt động" : "Đã khóa"),
//     },
//     {
//       key: "actions",
//       title: "Hành động",
//       render: (row) => (
//         <div className="table-actions">
//           <button className="btn-outlinee1" onClick={() => handleEdit(row)}>
//             Sửa
//           </button>
//           <button
//             className={row.status === "active" ? "btn-danger" : "btn-primary"}
//             onClick={() => toggleBlock(row.id)}
//           >
//             {row.status === "active" ? "Khóa" : "Mở khóa"}
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const handleEdit = (user: User) => {
//     setEditingUser(user);
//     setIsModalOpen(true);
//   };

//   const toggleBlock = (id: string) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === id
//           ? {
//               ...u,
//               status: u.status === "active" ? "blocked" : "active",
//             }
//           : u
//       )
//     );
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     const updated: User = {
//       ...editingUser,
//       name: (formData.get("name") as string) || editingUser.name,
//       email: (formData.get("email") as string) || editingUser.email,
//       phone: (formData.get("phone") as string) || editingUser.phone,
//     };

//     setUsers((prev) =>
//       prev.map((u) => (u.id === editingUser.id ? updated : u))
//     );
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="admin-page admin-users">
//       <div className="admin-page-header">
//         <h2>Quản lý khách hàng</h2>
//       </div>

//       <div className="admin-filters">
//         <input
//           type="text"
//           placeholder="Tìm theo tên, email hoặc SĐT..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="filter-input"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as User["status"])}
//           className="filter-select"
//         >
//           <option value="all">Tất cả trạng thái</option>
//           <option value="active">Hoạt động</option>
//           <option value="blocked">Đã khóa</option>
//         </select>
//       </div>

//       <AdminTable
//         columns={columns}
//         data={filteredUsers}
//         rowKey={(row) => row.id}
//       />

//       <AdminModal
//         open={isModalOpen}
//         title="Sửa thông tin khách hàng"
//         onClose={() => setIsModalOpen(false)}
//       >
//         {editingUser && (
//           <form className="admin-form" onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Tên khách hàng</label>
//               <input name="name" defaultValue={editingUser.name} />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input name="email" defaultValue={editingUser.email} />
//             </div>
//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input name="phone" defaultValue={editingUser.phone} />
//             </div>

//             <div className="modal-actions">
//               <button
//                 type="button"
//                 className="btn-outlinee1"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Hủy
//               </button>
//               <button type="submit" className="btn-primary1">
//                 Lưu
//               </button>
//             </div>
//           </form>
//         )}
//       </AdminModal>
//     </div>
//   );
// };

// export default AdminUsersPage;
