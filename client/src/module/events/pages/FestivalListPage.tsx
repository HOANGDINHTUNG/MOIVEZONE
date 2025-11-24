// // src/pages/FestivalListPage.tsx
// import { mockFestivals } from "../mock/mockFestivals";

// const FestivalListPage: React.FC = () => {
//   return (
//     <div className="festival-page">
//       {/* banner dùng background trong CSS festival.css */}
//       <div className="banner"></div>

//       <div className="event-list">
//         {mockFestivals.map((event) => (
//           <div className="event-item" key={event.id}>
//             <img src={event.imageUrl} alt={event.title} />
//             <div className="event-details">
//               <div className="event-header">
//                 <h2>{event.title}</h2>
//                 <span className="time">{event.timeRange}</span>
//               </div>
//               <p>{event.description}</p>
//               <p className="time">{event.location}</p>
//             </div>
//           </div>
//         ))}

//         <div className="event-buttons">
//           <button className="btn-back" disabled>
//             Trang trước
//           </button>
//           <button className="btn-next" disabled>
//             Trang sau
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FestivalListPage;
