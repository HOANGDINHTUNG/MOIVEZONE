// // src/pages/NewsListPage.tsx
// import { Link } from "react-router-dom";
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../hooks/UseCustomeRedux";
// import { fetchNewsList } from "../stores/newsSlice";


// const NewsListPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { items: news, loading } = useAppSelector((s) => s.news);

//   useEffect(() => {
//     // nếu sau này đã có API thì giữ; còn đang xài mock thì cũng không sao
//     dispatch(fetchNewsList()).catch(() => {});
//   }, [dispatch]);

//   if (loading && news.length === 0) {
//     return <p className="text-center mt-10">Đang tải tin tức...</p>;
//   }

//   return (
//     <div className="news-page container">
//       <h1 className="news-title">TIN TỨC</h1>
//       <div className="news-list">
//         {news.map((item) => {
//           const date = new Date(item.createdAt).toLocaleDateString("vi-VN", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           });
//           return (
//             <Link key={item.id} to={`/news/${item.id}`} className="news-item">
//               <div className="news-thumb">
//                 <img src={item.imageUrl} alt={item.title} />
//               </div>
//               <div className="news-content">
//                 <h2>{item.title}</h2>
//                 <p className="news-date">{date}</p>
//                 <p className="news-summary">{item.summary}</p>
//                 <span className="news-readmore">Xem chi tiết</span>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default NewsListPage;
