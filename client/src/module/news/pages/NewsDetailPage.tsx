// // src/pages/NewsDetailPage.tsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../hooks/UseCustomeRedux";
// import { fetchNewsById } from "../stores/newsSlice";

// const NewsDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { items } = useAppSelector((s) => s.news);

//   const news = items.find((n) => n.id === id);

//   useEffect(() => {
//     if (!news && id) {
//       dispatch(fetchNewsById(id)).catch(() => {});
//     }
//   }, [dispatch, id, news]);

//   if (!id) {
//     return <p className="container mt-10">Thiếu id bài viết.</p>;
//   }

//   const current =
//     news || items.find((n) => n.id === id); // sau fetchById

//   if (!current) {
//     return (
//       <div className="container">
//         <p style={{ marginTop: 120 }}>Không tìm thấy bài viết.</p>
//         <button
//           className="btn-primary"
//           style={{ marginTop: 16 }}
//           onClick={() => navigate("/news")}
//         >
//           Quay lại danh sách tin
//         </button>
//       </div>
//     );
//   }

//   const date = new Date(current.createdAt).toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });

//   return (
//     <div className="container">
//       <h1>{current.title}</h1>
//       <p className="paragraph">Ngày đăng: {date}</p>
//       <p className="title-1">{current.content}</p>
//       {current.imageUrl && <img src={current.imageUrl} alt={current.title} />}
//     </div>
//   );
// };

// export default NewsDetailPage;
