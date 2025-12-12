import { useEffect, useMemo, useState, type JSX } from "react";
import BannerHome from "../../../components/common/ui/BannerHome";
import { useAppSelector, useAppDispatch } from "../../../hooks/UseCustomeRedux";
import { useFetch } from "../../../hooks/useFetch";
import LatestTrailersSection, {
  type TrailerItem,
} from "../components/LatestTrailersSection";

import VideoPlay from "../../../components/home/VideoPlay";
import axiosTMDB from "../../../app/axiosTMDB";

import type { TMDBMovieSummary } from "../../movies/database/interface/movie";
import type { TMDBTvSummary } from "../../movies/database/interface/tvList";
import type {
  TMDBPaginatedResponse,
  TMDBMediaBase,
  MediaType,
} from "../../movies/database/interface/movieLists";

import {
  fetchTrending,
  setCategory,
  setTimeWindow,
} from "../../trending/store/trendingSlice";

import type {
  TMDBTimeWindow,
  TMDBTrendingAllItem,
  TMDBTrendingMovieItem,
} from "../../trending/database/interface/trending";
import HorizontalScollCard from "../../../components/home/HorizontalScollCard";
import { selectAdminState, type AdminFeatureKey } from "../../admin/store/adminSlice";

// TMDB video type đơn giản cho /videos
interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

const HomePage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Banner hero dùng data trending từ store riêng
  const bannerData = useAppSelector((state) => state.moviesData.bannerData);
  const language = useAppSelector((state) => state.language.current);
  const { sections, features } = useAppSelector(selectAdminState);

  const isSectionVisible = (id: string) =>
    sections.find((s) => s.id === id)?.visible !== false;

  const isFeatureOn = (key: AdminFeatureKey) =>
    features.find((f) => f.key === key)?.value !== false;

  // Lấy state trending từ trendingSlice (dùng chung với TrendingPage)
  const {
    timeWindow,
    category,
    items: trendingItems,
  } = useAppSelector((s) => s.trending);

  // Đảm bảo category cho Home trending strip là "movie"
  useEffect(() => {
    if (category !== "movie") {
      dispatch(setCategory("movie"));
    }
  }, [category, dispatch]);

  // Fetch trending movie theo timeWindow + language (giống TrendingPage)
  useEffect(() => {
    const tw: TMDBTimeWindow = timeWindow ?? "day";

    dispatch(
      fetchTrending({
        category: "movie",
        timeWindow: tw,
        page: 1,
        language,
      })
    );
  }, [timeWindow, language, dispatch]);

  // Map trendingItems -> TMDBMediaBase[] để phù hợp với HorizontalScollCard
  const trendingForCard: TMDBMediaBase[] = useMemo(
    () =>
      (trendingItems as TMDBTrendingAllItem[])
        .filter((item) => item.media_type === "movie")
        .map((item) => {
          const m = item as TMDBTrendingMovieItem;

          const base: TMDBMediaBase = {
            id: m.id,
            poster_path: m.poster_path ?? null,
            backdrop_path: m.backdrop_path ?? null,
            title: m.title,
            // nếu TMDBMediaBase có field name thì có thể gán undefined
            name: undefined as unknown as string,
            overview: m.overview ?? "",
            vote_average: m.vote_average ?? 0,
            vote_count: m.vote_count ?? 0,
            // nếu TMDBMediaBase có media_type
            media_type: "movie" as MediaType,
          };

          return base;
        }),
    [trendingItems]
  );

  // Movies cho các block khác
  const { data: nowPlayingData } =
    useFetch<TMDBMovieSummary>("/movie/now_playing");
  const { data: topRatedData } = useFetch<TMDBMovieSummary>("/movie/top_rated");

  // Movies cho tab Popular (trailer)
  const { data: popularMoviesData } =
    useFetch<TMDBMovieSummary>("/movie/popular");

  // TV list
  const { data: popularTvShowData } = useFetch<TMDBTvSummary>("/tv/popular");
  const { data: onTheAirShowData } = useFetch<TMDBTvSummary>("/tv/on_the_air");

  // State để show VideoPlay
  const [videoId, setVideoId] = useState<string | null>(null);

  const handlePlay = async (item: TrailerItem) => {
    try {
      const res = await axiosTMDB.get<TMDBPaginatedResponse<TMDBVideo>>(
        `/movie/${item.id}/videos`,
        {
          params: { language },
        }
      );

      const videos = res.data.results || [];

      // Ưu tiên Official YouTube Trailer
      const trailer =
        videos.find(
          (v) =>
            v.site === "YouTube" && v.type === "Trailer" && v.official === true
        ) ||
        videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        videos.find((v) => v.site === "YouTube");

      if (!trailer) {
        console.warn("No YouTube trailer found for item", item.id);
        return;
      }

      setVideoId(trailer.key);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <>
      {/* Banner dùng Redux (trending movies cho hero) */}
      {isFeatureOn("showHomeBanner") && isSectionVisible("home-banner") && (
        <BannerHome data={bannerData} />
      )}

      {/* Trending Movies – dùng Redux timeWindow giống TrendingPage */}
      {isFeatureOn("showHomeTrending") && isSectionVisible("home-trending") && (
        <HorizontalScollCard
          data={trendingForCard}
          heading="Trending Movies"
          headingTo="/trending"
          trending
          media_type="movie"
          showTimeToggle
          timeWindow={timeWindow ?? "day"}
          onTimeWindowChange={(tw) => dispatch(setTimeWindow(tw))}
        />
      )}

      {/* Latest Trailers (Popular / In Theaters) */}
      {isFeatureOn("showHomeLatestTrailers") &&
        isSectionVisible("home-latest-trailers") && (
          <LatestTrailersSection
            popular={popularMoviesData}
            inTheaters={nowPlayingData}
            onPlay={handlePlay}
          />
        )}

      {/* Now Playing */}
      <HorizontalScollCard
        data={nowPlayingData}
        heading="Now Playing"
        media_type="movie"
        headingTo="/category_movie/now_playing"
      />

      {/* Top Rated Movies */}
      <HorizontalScollCard
        data={topRatedData}
        heading="Top Rated Movies"
        media_type="movie"
        headingTo="/category_movie/top_rated"
      />

      {/* Popular TV Shows */}
      <HorizontalScollCard
        data={popularTvShowData}
        heading="Popular TV Shows"
        media_type="tv"
        headingTo="/category_tv/popular"
      />

      {/* On The Air */}
      <HorizontalScollCard
        data={onTheAirShowData}
        heading="On The Air"
        media_type="tv"
        headingTo="/category_tv/on_the_air"
      />

      {/* Popup video trailer */}
      {videoId && (
        <VideoPlay videoId={videoId} onClose={() => setVideoId(null)} />
      )}
    </>
  );
};

export default HomePage;
