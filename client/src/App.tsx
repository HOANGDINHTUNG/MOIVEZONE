// src/App.tsx
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/UseCustomeRedux";
import { useEffect, useState } from "react";
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
import { setPageLoading } from "./stores/appSlice";
import PageLoader from "./components/common/ux/PageLoader";
import SmoothScrollLayout from "./components/common/ux/SmoothScrollLayout";

function App() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const pageLoading = useAppSelector((s) => s.app.pageLoading);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

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
      } finally {
        setDataLoaded(true);
      }
    };

    fetchTrendingAndConfig();
  }, [dispatch, language]);

  useEffect(() => {
    const handleLoad = () => {
      setAssetsLoaded(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (dataLoaded && assetsLoaded) {
      const t = setTimeout(() => {
        dispatch(setPageLoading(false));
      }, 300);
      return () => clearTimeout(t);
    } else {
      dispatch(setPageLoading(true));
    }
  }, [dataLoaded, assetsLoaded, dispatch]);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <SmoothScrollLayout ease={0.08}>
      {/* Header fixed + hide/show theo scroll */}
      <Header />

      {/* Nội dung chính, chừa khoảng trống dưới header bằng pt-20 */}
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-900 dark:text-neutral-100 pb-20 lg:pb-0">
        <ScrollToTop />
        <div className="min-h-[90vh] pt-20">
          <Outlet />
        </div>
        <Footer />
        <MobileNavigation />
      </main>
    </SmoothScrollLayout>
  );
}

export default App;
