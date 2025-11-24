import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../module/home/pages/HomePage";
import ExplorePage from "../module/movies/pages/ExplorePage";
import DetailsPage from "../module/movies/pages/MoiveDetailsPage";
import SearchPage from "../module/home/pages/SearchPage";
import AllMoviesPage from "../module/movies/pages/AllMoviesPage";
import AllTvShowsPage from "../module/movies/pages/AllTvShowsPage";

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
    ],
  },
]);

export default router;
