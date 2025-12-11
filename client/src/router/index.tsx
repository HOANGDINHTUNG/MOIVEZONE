// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy, type JSX } from "react";

import App from "../App";
import ProtectedRoute from "./ProtectedRoute";

// ===== Lazy pages =====
const Home = lazy(() => import("../module/home/pages/HomePage"));
const ExplorePage = lazy(() => import("../module/movies/pages/ExplorePage"));
const DetailsPage = lazy(() => import("../module/movies/pages/DetailsPage"));
const SearchPage = lazy(() => import("../module/home/pages/SearchPage"));
const AllMoviesPage = lazy(
  () => import("../module/movies/pages/AllMoviesPage")
);
const AllTvShowsPage = lazy(
  () => import("../module/movies/pages/AllTvShowsPage")
);
const TmdbLogger = lazy(() => import("../test/TmdbLogger"));
const CollectionPage = lazy(
  () => import("../module/collections/pages/CollectionPage")
);
const CompanyPage = lazy(() => import("../module/company/pages/CompanyPage"));
const CertificationPage = lazy(
  () => import("../module/certifications/pages/CertificationPage")
);
const ConfigurationPage = lazy(
  () => import("../module/configuration/pages/ConfigurationPage")
);
const ChangesPage = lazy(() => import("../module/changes/pages/ChangesPage"));
const CreditDetailsPage = lazy(
  () => import("../module/credits/pages/CreditDetailsPage")
);
const DiscoverPage = lazy(
  () => import("../module/discovers/pages/DiscoverPage")
);
const LoginPage = lazy(() => import("../module/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../module/auth/pages/RegisterPage"));
const AuthLayout = lazy(
  () => import("../module/auth/feature/layout/AuthLayout")
);
const NotFoundPage = lazy(() => import("../components/error/NotFoundPage"));
const NetworkPage = lazy(() => import("../module/networks/pages/NetworkPage"));
const TrendingPage = lazy(
  () => import("../module/trending/pages/TrendingPage")
);
const MoviesCategoryPage = lazy(
  () => import("../module/movies/pages/MoviesCategoryPage")
);
const TvCategoryPage = lazy(
  () => import("../module/movies/pages/TvCategoryPage")
);
const PersonDetailsPage = lazy(
  () => import("../module/persons/pages/PersonDetailsPage")
);
const PersonListPage = lazy(
  () => import("../module/persons/pages/PersonListPage")
);
const ReviewDetailsPage = lazy(
  () => import("../module/review/pages/ReviewDetailsPage")
);
const SearchAdvancedPage = lazy(
  () => import("../module/search/pages/SearchAdvancedPage")
);
const TvSeasonPage = lazy(() => import("../module/tv/pages/TvSeasonPage"));
const TvEpisodePage = lazy(() => import("../module/tv/pages/TvEpisodePage"));
const TvEpisodeGroupPage = lazy(
  () => import("../module/tv/pages/TvEpisodeGroupPage")
);
const UserLibraryPage = lazy(
  () => import("../module/auth/pages/UserLibraryPage")
);
const EventsList = lazy(() => import("../module/events/pages/EventsList"));
const EventDetailPage = lazy(
  () => import("../module/events/pages/DetailEvent")
);

// ===== Helper bọc Suspense =====
const withSuspense = (element: JSX.Element) => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center text-white">
        Đang tải...
      </div>
    }
  >
    {element}
  </Suspense>
);

const router = createBrowserRouter([
  // Layout chính của app
  {
    path: "/",
    element: <App />,
    errorElement: withSuspense(<NotFoundPage />),
    children: [
      // Trang chính: vào đây là Home (ai cũng xem được)
      { index: true, element: withSuspense(<Home />) },

      // Các trang public: ai cũng xem được
      { path: "explore", element: withSuspense(<ExplorePage />) },
      { path: "search", element: withSuspense(<SearchPage />) },
      { path: "movie", element: withSuspense(<AllMoviesPage />) },
      { path: "tv", element: withSuspense(<AllTvShowsPage />) },

      // ================== NHÓM CẦN ĐĂNG NHẬP ==================
      {
        element: <ProtectedRoute />,
        children: [
          // Chi tiết phim / tv
          {
            path: "movie/:id",
            element: withSuspense(<DetailsPage mediaType="movie" />),
          },
          {
            path: "tv/:id",
            element: withSuspense(<DetailsPage mediaType="tv" />),
          },

          {
            path: "tv/:seriesId/season/:seasonNumber",
            element: withSuspense(<TvSeasonPage />),
          },
          {
            path: "tv/:seriesId/season/:seasonNumber/episode/:episodeNumber",
            element: withSuspense(<TvEpisodePage />),
          },
          {
            path: "tv/episode_group/:tv_episode_group_id",
            element: withSuspense(<TvEpisodeGroupPage />),
          },

          // TMDB details
          {
            path: "collection/:id",
            element: withSuspense(<CollectionPage />),
          },
          { path: "company/:id", element: withSuspense(<CompanyPage />) },
          {
            path: "certifications",
            element: withSuspense(<CertificationPage />),
          },
          {
            path: "configuration",
            element: withSuspense(<ConfigurationPage />),
          },
          { path: "changes", element: withSuspense(<ChangesPage />) },
          {
            path: "credits/:creditId",
            element: withSuspense(<CreditDetailsPage />),
          },
          { path: "discover", element: withSuspense(<DiscoverPage />) },
          { path: "network/:id", element: withSuspense(<NetworkPage />) },
          {
            path: "/person/:personId",
            element: withSuspense(<PersonDetailsPage />),
          },
          {
            path: "/review/:reviewId",
            element: withSuspense(<ReviewDetailsPage />),
          },

          { path: "trending", element: withSuspense(<TrendingPage />) },
          { path: "person", element: withSuspense(<PersonListPage />) },
          {
            path: "category_movie/:type",
            element: withSuspense(<MoviesCategoryPage />),
          },
          {
            path: "category_tv/:type",
            element: withSuspense(<TvCategoryPage />),
          },
          {
            path: "search_advanced",
            element: withSuspense(<SearchAdvancedPage />),
          },

          // Account / events
          {
            path: "account",
            element: withSuspense(<UserLibraryPage />),
          },
          { path: "event", element: withSuspense(<EventsList />) },
          {
            path: "event/:id",
            element: withSuspense(<EventDetailPage />),
          },

          // // News / payment / admin: đang comment của bạn, giữ nguyên
          // { path: "news", element: <NewsListPage /> },
          // { path: "news/:id", element: <NewsDetailPage /> },

          // { path: "payment", element: <PaymentPage /> },
          // { path: "payment/success", element: <PaymentSuccessPage /> },
          // { path: "ticket-price", element: <TicketPricePage /> },

          // // Admin (cũng nên bảo vệ)
          // { path: "admin/movies", element: <AdminMoviesPage /> },
          // { path: "admin/schedule", element: <AdminSchedulePage /> },
          // { path: "admin/users", element: <AdminUsersPage /> },
        ],
      },
    ],
  },

  // ================== LAYOUT AUTH (LOGIN / REGISTER) ==================
  {
    element: withSuspense(
      <AuthLayout videoSrc="https://res.cloudinary.com/dmzvum1lp/video/upload/v1764555355/The_Dark_Knight_-_Official_Trailer_3_HD_tsypcl.mp4" />
    ),
    children: [
      { path: "login", element: withSuspense(<LoginPage />) },
      { path: "register", element: withSuspense(<RegisterPage />) },
    ],
  },

  //=================== TEST ====================
  { path: "/test", element: withSuspense(<TmdbLogger />) },

  // ================== 404 ==================
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
]);

export default router;
