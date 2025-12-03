// src/pages/Home.tsx

import BannerHome from "../../../components/common/ui/BannerHome";
import HorizontalScollCard from "../../../components/HorizontalScollCard";

import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import { useFetch } from "../../../hooks/useFetch";

import type { MovieSummary } from "../../movies/database/interface/movie";
import type { TvSummary } from "../../movies/database/interface/tv";
import LatestTrailersSection from "../components/LatestTrailersSection";

const HomePage = () => {
  const trendingData = useAppSelector((state) => state.moviesData.bannerData);

  // Fetch using correct types
  const { data: nowPlayingData } = useFetch<MovieSummary>("/movie/now_playing");
  const { data: topRatedData } = useFetch<MovieSummary>("/movie/top_rated");

  const { data: popularTvShowData } = useFetch<TvSummary>("/tv/popular");
  const { data: onTheAirShowData } = useFetch<TvSummary>("/tv/on_the_air");

  return (
    <div>
      {/* Banner use Redux data (trending movies) */}
      <BannerHome data={trendingData} />

      <HorizontalScollCard
        data={trendingData}
        heading="Trending"
        trending
        media_type="movie"
      />

      <LatestTrailersSection data={nowPlayingData} />

      <HorizontalScollCard
        data={nowPlayingData}
        heading="Now Playing"
        media_type="movie"
      />

      <HorizontalScollCard
        data={topRatedData}
        heading="Top Rated Movies"
        media_type="movie"
      />

      <HorizontalScollCard
        data={popularTvShowData}
        heading="Popular TV Shows"
        media_type="tv"
      />

      <HorizontalScollCard
        data={onTheAirShowData}
        heading="On The Air"
        media_type="tv"
      />
    </div>
  );
};

export default HomePage;
