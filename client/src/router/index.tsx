import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../module/home/pages/HomePage";
import ExplorePage from "../module/movies/pages/ExplorePage";
import DetailsPage from "../module/movies/pages/MoiveDetailsPage";
import SearchPage from "../module/home/pages/SearchPage";
import AllMoviesPage from "../module/movies/pages/AllMoviesPage";
import AllTvShowsPage from "../module/movies/pages/AllTvShowsPage";
import TmdbLogger from "../test/TmdbLogger";
import CollectionPage from "../module/collections/pages/CollectionPage";
import CompanyPage from "../module/company/pages/CompanyPage";
import CertificationPage from "../module/certifications/pages/CertificationPage";
import ConfigurationPage from "../module/configuration/pages/ConfigurationPage";
import ChangesPage from "../module/changes/pages/ChangesPage";
import CreditDetailsPage from "../module/credits/pages/CreditDetailsPage";
import DiscoverPage from "../module/discovers/pages/DiscoverPage";
import LoginPage from "../module/auth/feature/pages/LoginPage";
import RegisterPage from "../module/auth/feature/pages/RegisterPage";
import AuthLayout from "../module/auth/feature/layout/AuthLayout";
import NotFoundPage from "../components/error/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import NetworkPage from "../module/networks/pages/NetworkPage";
import TrendingPage from "../module/trending/pages/TrendingPage";
import MoviesCategoryPage from "../module/movies/pages/MoviesCategoryPage";
import TvCategoryPage from "../module/movies/pages/TvCategoryPage";
import PersonDetailsPage from "../module/persons/pages/PersonDetailsPage";
import PersonListPage from "../module/persons/pages/PersonListPage";
import ReviewDetailsPage from "../module/review/pages/ReviewDetailsPage";
import SearchAdvancedPage from "../module/search/pages/SearchAdvancedPage";
import TvSeasonPage from "../module/tv/pages/TvSeasonPage";
import TvEpisodePage from "../module/tv/pages/TvEpisodePage";
import TvEpisodeGroupPage from "../module/tv/pages/TvEpisodeGroupPage";

const router = createBrowserRouter([
  // Layout chính của app
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      // Trang chính: vào đây là Home (ai cũng xem được)
      { index: true, element: <Home /> },

      // Các trang public: ai cũng xem được
      { path: "explore", element: <ExplorePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "movie", element: <AllMoviesPage /> },
      { path: "tv", element: <AllTvShowsPage /> },

      // ================== NHÓM CẦN ĐĂNG NHẬP ==================
      {
        element: <ProtectedRoute />,
        children: [
          // Chi tiết phim / tv
          { path: "movie/:id", element: <DetailsPage mediaType="movie" /> },
          { path: "tv/:id", element: <DetailsPage mediaType="tv" /> },

          {
            path: "tv/:seriesId/season/:seasonNumber",
            element: <TvSeasonPage />,
          },
          {
            path: "tv/:seriesId/season/:seasonNumber/episode/:episodeNumber",
            element: <TvEpisodePage />,
          },
          {
            path: "tv/episode_group/:tv_episode_group_id",
            element: <TvEpisodeGroupPage />,
          },

          // TMDB details
          { path: "collection/:id", element: <CollectionPage /> },
          { path: "company/:id", element: <CompanyPage /> },
          { path: "certifications", element: <CertificationPage /> },
          { path: "configuration", element: <ConfigurationPage /> },
          { path: "changes", element: <ChangesPage /> },
          { path: "credits/:creditId", element: <CreditDetailsPage /> },
          { path: "discover", element: <DiscoverPage /> },
          { path: "network/:id", element: <NetworkPage /> },
          { path: "/person/:personId", element: <PersonDetailsPage /> },
          { path: "/review/:reviewId", element: <ReviewDetailsPage /> },

          { path: "trending", element: <TrendingPage /> },
          { path: "person", element: <PersonListPage /> },
          { path: "category_movie/:type", element: <MoviesCategoryPage /> },
          { path: "category_tv/:type", element: <TvCategoryPage /> },
          { path: "search_advanced", element: <SearchAdvancedPage /> },

          // // Account / news / payment
          // { path: "account", element: <AccountPage /> },
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
    element: (
      <AuthLayout videoSrc="https://res.cloudinary.com/dmzvum1lp/video/upload/v1764555355/The_Dark_Knight_-_Official_Trailer_3_HD_tsypcl.mp4" />
    ),
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  //=================== TEST ====================
  { path: "/test", element: <TmdbLogger /> },

  // ================== 404 ==================
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
