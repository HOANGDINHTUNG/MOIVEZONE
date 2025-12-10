import { useEffect } from "react";

const BASE = "https://api.themoviedb.org/3";

export default function TmdbLogger() {
  const V3_KEY = import.meta.env.VITE_TMDB_V3_KEY;
  const V4_TOKEN = import.meta.env.VITE_TMDB_V4_TOKEN;

  // ⚠️ Nếu API nào cần ID thì đặt luôn vào đây
  const PARAMS = {
    account_id: 548,
    collection_id: 10,
    company_id: 1,
    credit_id: "52fe48009251416c750ac387",
    external_id: "tt4154796",
    guest_session_id: "22c76a9b67b55e0190d2e84232e2f0a5",
    keyword_id: 1721,
    list_id: 1,
    movie_id: 550,
    network_id: 213,
    person_id: 287,
    review_id: "5a1e3d0cc3a3680b1b24d9a0",
    time_window: "day",
    tv_episode_group_id: "5aeac7c09251413b220828c9",
    series_id: 1399,
    season_number: 1,
    episode_number: 1,
    season_id: 3627,
    episode_id: 63056,
  };

  // ⭐ LIST TẤT CẢ API CỦA BẠN
  const ENDPOINTS = [
    `/account/${PARAMS.account_id}`,
    `/account/${PARAMS.account_id}/favorite/movies`,
    `/account/${PARAMS.account_id}/favorite/tv`,
    `/account/${PARAMS.account_id}/lists`,
    `/account/${PARAMS.account_id}/rated/movies`,
    `/account/${PARAMS.account_id}/rated/tv`,
    `/account/${PARAMS.account_id}/rated/tv/episodes`,
    `/account/${PARAMS.account_id}/watchlist/movies`,
    `/account/${PARAMS.account_id}/watchlist/tv`,
    `/certification/movie/list`,
    `/certification/tv/list`,
    `/movie/changes`,
    `/person/changes`,
    `/tv/changes`,
    `/collection/${PARAMS.collection_id}`,
    `/collection/${PARAMS.collection_id}/images`,
    `/collection/${PARAMS.collection_id}/translations`,
    `/company/${PARAMS.company_id}`,
    `/company/${PARAMS.company_id}/alternative_names`,
    `/company/${PARAMS.company_id}/images`,
    `/configuration`,
    `/configuration/countries`,
    `/configuration/jobs`,
    `/configuration/languages`,
    `/configuration/primary_translations`,
    `/configuration/timezones`,
    `/credit/${PARAMS.credit_id}`,
    `/discover/movie`,
    `/discover/tv`,
    `/find/${PARAMS.external_id}?external_source=imdb_id`,
    `/genre/movie/list`,
    `/genre/tv/list`,
    `/guest_session/${PARAMS.guest_session_id}/rated/movies`,
    `/guest_session/${PARAMS.guest_session_id}/rated/tv`,
    `/guest_session/${PARAMS.guest_session_id}/rated/tv/episodes`,
    `/keyword/${PARAMS.keyword_id}`,
    `/keyword/${PARAMS.keyword_id}/movies`,
    `/list/${PARAMS.list_id}/item_status`,
    `/list/${PARAMS.list_id}`,
    `/movie/now_playing`,
    `/movie/popular`,
    `/movie/top_rated`,
    `/movie/upcoming`,
    `/movie/${PARAMS.movie_id}`,
    `/movie/${PARAMS.movie_id}/account_states`,
    `/movie/${PARAMS.movie_id}/alternative_titles`,
    `/movie/${PARAMS.movie_id}/changes`,
    `/movie/${PARAMS.movie_id}/credits`,
    `/movie/${PARAMS.movie_id}/external_ids`,
    `/movie/${PARAMS.movie_id}/images`,
    `/movie/${PARAMS.movie_id}/keywords`,
    `/movie/latest`,
    `/movie/${PARAMS.movie_id}/lists`,
    `/movie/${PARAMS.movie_id}/recommendations`,
    `/movie/${PARAMS.movie_id}/release_dates`,
    `/movie/${PARAMS.movie_id}/reviews`,
    `/movie/${PARAMS.movie_id}/similar`,
    `/movie/${PARAMS.movie_id}/translations`,
    `/movie/${PARAMS.movie_id}/videos`,
    `/movie/${PARAMS.movie_id}/watch/providers`,
    `/network/${PARAMS.network_id}`,
    `/network/${PARAMS.network_id}/alternative_names`,
    `/network/${PARAMS.network_id}/images`,
    `/person/popular`,
    `/person/${PARAMS.person_id}`,
    `/person/${PARAMS.person_id}/changes`,
    `/person/${PARAMS.person_id}/combined_credits`,
    `/person/${PARAMS.person_id}/external_ids`,
    `/person/${PARAMS.person_id}/images`,
    `/person/latest`,
    `/person/${PARAMS.person_id}/movie_credits`,
    `/person/${PARAMS.person_id}/tv_credits`,
    `/person/${PARAMS.person_id}/tagged_images`,
    `/person/${PARAMS.person_id}/translations`,
    `/review/${PARAMS.review_id}`,
    `/search/collection?query=avengers`,
    `/search/company?query=marvel`,
    `/search/keyword?query=love`,
    `/search/movie?query=fight`,
    `/search/multi?query=iron man`,
    `/search/person?query=robert`,
    `/search/tv?query=breaking`,
    `/trending/all/${PARAMS.time_window}`,
    `/trending/movie/${PARAMS.time_window}`,
    `/trending/person/${PARAMS.time_window}`,
    `/trending/tv/${PARAMS.time_window}`,
    `/tv/airing_today`,
    `/tv/on_the_air`,
    `/tv/popular`,
    `/tv/top_rated`,
    `/tv/${PARAMS.series_id}`,
    `/tv/${PARAMS.series_id}/account_states`,
    `/tv/${PARAMS.series_id}/aggregate_credits`,
    `/tv/${PARAMS.series_id}/alternative_titles`,
    `/tv/${PARAMS.series_id}/changes`,
    `/tv/${PARAMS.series_id}/content_ratings`,
    `/tv/${PARAMS.series_id}/credits`,
    `/tv/${PARAMS.series_id}/episode_groups`,
    `/tv/${PARAMS.series_id}/external_ids`,
    `/tv/${PARAMS.series_id}/images`,
    `/tv/${PARAMS.series_id}/keywords`,
    `/tv/latest`,
    `/tv/${PARAMS.series_id}/lists`,
    `/tv/${PARAMS.series_id}/recommendations`,
    `/tv/${PARAMS.series_id}/reviews`,
    `/tv/${PARAMS.series_id}/screened_theatrically`,
    `/tv/${PARAMS.series_id}/similar`,
    `/tv/${PARAMS.series_id}/translations`,
    `/tv/${PARAMS.series_id}/videos`,
    `/tv/${PARAMS.series_id}/watch/providers`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/account_states`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/aggregate_credits`,
    `/tv/season/${PARAMS.season_id}/changes`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/credits`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/external_ids`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/images`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/translations`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/videos`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/watch/providers`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/account_states`,
    `/tv/episode/${PARAMS.episode_id}/changes`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/credits`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/external_ids`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/images`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/translations`,
    `/tv/${PARAMS.series_id}/season/${PARAMS.season_number}/episode/${PARAMS.episode_number}/videos`,
    `/tv/episode_group/${PARAMS.tv_episode_group_id}`,
    `/watch/providers/regions`,
    `/watch/providers/movie`,
    `/watch/providers/tv`,
  ];

  // Hàm gọi API
  const callAPI = async (path: string) => {
    const isV4 = path.includes("account_states"); // optional

    const headers: Record<string, string> = isV4
      ? { Authorization: `Bearer ${V4_TOKEN}` }
      : {};

    const url = path.includes("?")
      ? `${BASE}${path}&api_key=${V3_KEY}`
      : `${BASE}${path}?api_key=${V3_KEY}`;

    try {
      const res = await fetch(url, { headers });
      const json = await res.json();

      console.log(`===== ${path} =====`);
      console.log(res);
      console.log(json);
    } catch (err) {
      console.error(`❌ Error loading ${path}`, err);
    }
  };

  useEffect(() => {
    ENDPOINTS.forEach((endpoint) => callAPI(endpoint));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAPI]);

  return (
    <div style={{ padding: 20 }}>
      <h2>TMDB Logger is running…</h2>
      <p>Mở F12 Console để xem toàn bộ dữ liệu.</p>
    </div>
  );
}
