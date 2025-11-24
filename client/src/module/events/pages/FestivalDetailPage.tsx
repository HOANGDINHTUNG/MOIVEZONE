// // src/pages/FestivalDetailPage.tsx
// import { useParams, useNavigate } from "react-router-dom";
// import { findFestivalById } from "../mock/mockFestivals";

// const FestivalDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const event = findFestivalById(id);

//   if (!event) {
//     return (
//       <div className="container">
//         <p style={{ marginTop: 120 }}>Không tìm thấy sự kiện.</p>
//         <button
//           className="btn-primary"
//           style={{ marginTop: 16 }}
//           onClick={() => navigate("/festival")}
//         >
//           Quay lại danh sách sự kiện
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <h1>{event.title}</h1>
//       <p className="paragraph">
//         Thời gian: {event.timeRange} — Địa điểm: {event.location}
//       </p>
//       <p className="title-1">{event.description}</p>

//       {event.imageUrl && (
//         <img src={event.imageUrl} alt={event.title} />
//       )}
//     </div>
//   );
// };

// export default FestivalDetailPage;
