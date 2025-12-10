// src/module/tv/pages/TvSeasonPage.tsx
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import { fetchTvSeason, selectTvSeasonState } from "../store/tvSeasonSlice";
import type {
  TMDBTvSeasonEpisode,
  TMDBTvSeasonAggregateCast,
  TMDBTvSeasonAggregateCrew,
  TMDBTvSeasonWatchProviderCountry,
  TMDBTvSeasonChange,
  TMDBTvSeasonTranslation,
  TMDBTvSeasonVideo,
  TMDBTvSeasonPoster,
} from "../database/interface/tv_season";

import SeasonHero from "../components/season/SeasonHero";
import CastCrewSection from "../components/season/CastCrewSection";
import WatchProvidersSection from "../components/season/WatchProvidersSection";
import ExternalIdsSection from "../components/season/ExternalIdsSection";
import VideosSection from "../components/season/VideosSection";
import ImagesSection from "../components/season/ImagesSection";
import TranslationsSection from "../components/season/TranslationsSection";
import ChangesSection from "../components/season/ChangesSection";
import EpisodesList from "../components/season/EpisodesList";

const TvSeasonPage = () => {
  // Lấy params từ URL
  const { seriesId, seasonNumber } = useParams<{
    seriesId?: string;
    seasonNumber?: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const language = useAppSelector((state) => state.language.current);
  const { loading, error, detail, watchProviders, changes } =
    useAppSelector(selectTvSeasonState);

  // 🔄 Fetch data
  useEffect(() => {
    if (!seriesId || !seasonNumber) return;

    dispatch(
      fetchTvSeason({
        seriesId: Number(seriesId),
        seasonNumber: Number(seasonNumber),
        language,
      })
    );
  }, [dispatch, seriesId, seasonNumber, language]);

  // ======== MEMO HOÁ DATA ========
  const episodes: TMDBTvSeasonEpisode[] = useMemo(
    () => detail?.episodes || [],
    [detail]
  );

  const aggregateCast: TMDBTvSeasonAggregateCast[] = useMemo(
    () => detail?.aggregate_credits?.cast || [],
    [detail]
  );

  const aggregateCrew: TMDBTvSeasonAggregateCrew[] = useMemo(
    () => detail?.aggregate_credits?.crew || [],
    [detail]
  );

  const translations: TMDBTvSeasonTranslation[] = useMemo(
    () => detail?.translations?.translations || [],
    [detail]
  );

  const videos: TMDBTvSeasonVideo[] = useMemo(
    () => detail?.videos?.results || [],
    [detail]
  );

  const posters: TMDBTvSeasonPoster[] = useMemo(
    () => detail?.images?.posters || [],
    [detail]
  );

  const region = "US"; // TODO: sau này lấy từ Redux nếu có state region

  const providerCountry: TMDBTvSeasonWatchProviderCountry | null = useMemo(() => {
    if (!watchProviders?.results) return null;
    return watchProviders.results[region] || null;
  }, [watchProviders, region]);

  const changeGroups: TMDBTvSeasonChange[] = useMemo(
    () => changes?.changes || [],
    [changes]
  );

  // ======== GUARD ROUTE PARAMS ========
  if (!seriesId || !seasonNumber) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">
          Missing seriesId / seasonNumber in route.
        </p>
      </div>
    );
  }

  // (Optional) trạng thái loading khi chưa có detail
  if (loading && !detail) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">Loading season data…</p>
      </div>
    );
  }

  // (Optional) error khi không load được gì
  if (error && !detail) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <div className="max-w-md space-y-3 px-4 text-center">
          <p className="text-sm text-red-300">Error: {error}</p>
          <button
            className="
              mt-2 rounded-full border border-white/25
              px-4 py-1.5 text-xs text-slate-100
              bg-white/5 hover:bg-white/10
              transition-colors
            "
            onClick={() =>
              dispatch(
                fetchTvSeason({
                  seriesId: Number(seriesId),
                  seasonNumber: Number(seasonNumber),
                  language,
                })
              )
            }
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ======== MAIN UI ========
  return (
    <div
      className="
        min-h-screen
        bg-linear-to-b from-[#020617] via-black to-black
        text-slate-50
      "
    >
      <SeasonHero
        detail={detail}
        episodes={episodes}
        onBack={() => navigate(-1)}
        seasonNumber={seasonNumber}
      />

      {/* CONTENT SECTIONS */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16">
        {/* Loading trạng thái nhỏ (khi đang refetch nhưng đã có detail) */}
        {loading && detail && (
          <div className="text-[11px] text-slate-400">
            Updating season data…
          </div>
        )}

        {/* Error banner (khi có detail nhưng lần fetch sau lỗi) */}
        {error && detail && (
          <div
            className="
              rounded-xl border border-red-500/50
              bg-red-500/15 px-3 py-2 text-[11px] text-red-100
              shadow-[0_0_14px_#ef444455]
            "
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
          {/* Cast & crew */}
          <div className="space-y-6">
            <CastCrewSection cast={aggregateCast} crew={aggregateCrew} />
          </div>

          {/* Watch providers + external IDs */}
          <div className="space-y-6">
            <WatchProvidersSection provider={providerCountry} region={region} />
            <ExternalIdsSection external={detail?.external_ids || null} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <VideosSection videos={videos} />
          <ImagesSection posters={posters} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          <TranslationsSection
            translations={translations}
            currentLanguage={language}
          />
          <ChangesSection changeGroups={changeGroups} />
        </div>

        {/* Episodes list riêng phía dưới */}
        <div className="mt-4">
          <EpisodesList
            episodes={episodes}
            seriesId={Number(seriesId)}
            seasonNumber={Number(seasonNumber)}
          />
        </div>
      </div>
    </div>
  );
};

export default TvSeasonPage;
