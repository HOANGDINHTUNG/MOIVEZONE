// src/App.tsx
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/UseCustomeRedux";
import { useEffect } from "react";
import axiosTMDB from "./app/axiosTMDB";
import type {
  TMDBConfigurationResponse,
  TMDBListResponse,
} from "./module/movies/database/interface/tmdb";
import type { MovieSummary } from "./module/movies/database/interface/movie";
import { setBannerData, setImageURL } from "./module/movies/store/moviesSlice";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MobileNavigation from "./mobile/components/MobileNavigation";
import ScrollToTop from "./components/common/ux/ScrollToTop";

function App() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    const fetchTrendingAndConfig = async () => {
      try {
        const [trendingRes, configRes] = await Promise.all([
          axiosTMDB.get<TMDBListResponse<MovieSummary>>(
            "/trending/movie/week",
            {
              params: { language },
            }
          ),
          axiosTMDB.get<TMDBConfigurationResponse>("/configuration"),
        ]);

        dispatch(setBannerData(trendingRes.data.results));
        dispatch(setImageURL(configRes.data.images.secure_base_url + "w500"));
      } catch (error) {
        console.error("Error fetching TMDB config/trending:", error);
      }
    };

    fetchTrendingAndConfig();
  }, [dispatch, language]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-900 dark:text-neutral-100 pb-14 lg:pb-0">
      <Header />
      <div className="min-h-[90vh]">
        <ScrollToTop />
        <Outlet />
      </div>
      <Footer />
      <MobileNavigation />
    </main>
  );
}

export default App;
