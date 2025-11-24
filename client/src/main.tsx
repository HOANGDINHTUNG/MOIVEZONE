// import React from "react";
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import { router } from "./router";
// import "./index.css";

// // import global CSS cũ
// import "./styles/header.css";
// import "./styles/footer.css";
// import "./styles/homepage.css";
// import "./styles/MovieDetail.css";
// import "./styles/news.css";
// import "./styles/festival.css";
// import "./styles/festivalDetails.css";
// import "./styles/TicketPrice.css";
// import "./styles/payment.css";
// import "./styles/payment-success.css";
// import "./styles/ticket.css";
// import "./styles/admin.css";
// import { store } from "./stores";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </React.StrictMode>
// );

// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { store } from "./stores";
import router from "./router";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
