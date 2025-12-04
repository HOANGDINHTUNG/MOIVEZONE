import { useState } from "react";
import BannerHome from "../../../components/common/ui/BannerHome";
import HorizontalScollCard from "../../../components/HorizontalScollCard";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import { useFetch } from "../../../hooks/useFetch";
import LatestTrailersSection, {
  type TrailerItem,
} from "../components/LatestTrailersSection";

import VideoPlay from "../../../components/VideoPlay";
import axiosTMDB from "../../../app/axiosTMDB";
import type { TMDBMovieSummary } from "../../movies/database/interface/movie";
import type { TMDBTvSummary } from "../../movies/database/interface/tvList";
import type { TMDBPaginatedResponse } from "../../movies/database/interface/movieLists";
// TMDB video type đơn giản cho /videos
interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

const HomePage = () => {
  const trendingData = useAppSelector((state) => state.moviesData.bannerData);
  const language = useAppSelector((state) => state.language.current);

  // Fetch using correct types
  // Fetch using correct types
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
      {/* Banner dùng Redux (trending movies) */}
      <BannerHome data={trendingData} />

      {/* Trending */}
      <HorizontalScollCard
        data={trendingData}
        heading="Trending"
        trending
        media_type="movie"
      />

      {/* Latest Trailers (Popular / In Theaters) */}
      <LatestTrailersSection
        popular={popularMoviesData}
        inTheaters={nowPlayingData}
        onPlay={handlePlay}
      />

      {/* Now Playing */}
      <HorizontalScollCard
        data={nowPlayingData}
        heading="Now Playing"
        media_type="movie"
      />

      {/* Top Rated Movies */}
      <HorizontalScollCard
        data={topRatedData}
        heading="Top Rated Movies"
        media_type="movie"
      />

      {/* Popular TV Shows */}
      <HorizontalScollCard
        data={popularTvShowData}
        heading="Popular TV Shows"
        media_type="tv"
      />

      {/* On The Air */}
      <HorizontalScollCard
        data={onTheAirShowData}
        heading="On The Air"
        media_type="tv"
      />

      {/* Popup video trailer */}
      {videoId && (
        <VideoPlay videoId={videoId} onClose={() => setVideoId(null)} />
      )}
    </>
  );
};

export default HomePage;
