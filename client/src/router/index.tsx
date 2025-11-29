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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/movies",
        element: <AllMoviesPage />,
      },
      {
        path: "/tv",
        element: <AllTvShowsPage />,
      },
      {
        path: "explore/:explore",
        element: <ExplorePage />,
      },
      {
        path: "movie/:id",
        element: <DetailsPage mediaType="movie" />,
      },
      {
        path: "tv/:id",
        element: <DetailsPage mediaType="tv" />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "/collection/:id",
        element: <CollectionPage />,
      },
      { path: "/company/:id", element: <CompanyPage /> },
      { path: "/credits/:creditId", element: <CreditDetailsPage /> },
      { path: "/certifications", element: <CertificationPage /> },
      { path: "/configuration", element: <ConfigurationPage /> },
      { path: "/changes", element: <ChangesPage /> },
      { path: "/discover", element: <DiscoverPage /> },
    ],
  },
  { path: "/test", element: <TmdbLogger /> },
]);

export default router;
