// src/module/tvEpisode/pages/TvEpisodePage.tsx
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import { fetchTvEpisode, selectTvEpisodeState } from "../store/tvEpisodeSlice";

import type {
  TMDBTvEpisodeCast,
  TMDBTvEpisodeCreditsCrew,
  TMDBTvEpisodeGuestStars,
  TMDBTvEpisodeAccountStates,
  TMDBTvEpisodeExternalIds,
  TMDBTvEpisodeImages,
  TMDBTvEpisodeTranslations,
  TMDBTvEpisodeVideo,
  TMDBTvEpisodeStill,
  TMDBTvEpisodeChange,
} from "../database/interface/tv_episode";
import EpisodeHero from "../components/episode/EpisodeHero";
import EpisodeOverview from "../components/episode/EpisodeOverview";
import EpisodeCastCrewSection from "../components/episode/EpisodeCastCrewSection";
import EpisodeAccountStatesSection from "../components/episode/EpisodeAccountStatesSection";
import EpisodeExternalIdsSection from "../components/episode/EpisodeExternalIdsSection";
import EpisodeVideosSection from "../components/episode/EpisodeVideosSection";
import EpisodeStillsSection from "../components/episode/EpisodeStillsSection";
import EpisodeTranslationsSection from "../components/episode/EpisodeTranslationsSection";
import EpisodeChangesSection from "../components/episode/EpisodeChangesSection";

const HIRES_BASE = "https://image.tmdb.org/t/p/original/";

const TvEpisodePage = () => {
  const { seriesId, seasonNumber, episodeNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const language = useAppSelector((state) => state.language.current);
  const { loading, error, detail, changes } =
    useAppSelector(selectTvEpisodeState);

  useEffect(() => {
    if (!seriesId || !seasonNumber || !episodeNumber) return;

    dispatch(
      fetchTvEpisode({
        seriesId: Number(seriesId),
        seasonNumber: Number(seasonNumber),
        episodeNumber: Number(episodeNumber),
        language,
      })
    );
  }, [dispatch, seriesId, seasonNumber, episodeNumber, language]);

  const accountStates: TMDBTvEpisodeAccountStates | null = useMemo(
    () => (detail?.account_states ? detail.account_states : null),
    [detail]
  );

  const credits = detail?.credits;
  const cast: TMDBTvEpisodeCast[] = useMemo(
    () => credits?.cast ?? [],
    [credits]
  );
  const crew: TMDBTvEpisodeCreditsCrew[] = useMemo(
    () => credits?.crew ?? [],
    [credits]
  );
  const guestStars: TMDBTvEpisodeGuestStars[] = useMemo(
    () => credits?.guest_stars ?? [],
    [credits]
  );

  const externalIds: TMDBTvEpisodeExternalIds | null = useMemo(
    () => detail?.external_ids ?? null,
    [detail]
  );

  const images: TMDBTvEpisodeImages | null = useMemo(
    () => detail?.images ?? null,
    [detail]
  );

  const translations: TMDBTvEpisodeTranslations | null = useMemo(
    () => detail?.translations ?? null,
    [detail]
  );

  const videos: TMDBTvEpisodeVideo[] = useMemo(
    () => detail?.videos?.results ?? [],
    [detail]
  );

  const stills: TMDBTvEpisodeStill[] = useMemo(
    () => images?.stills ?? [],
    [images]
  );

  const changeGroups: TMDBTvEpisodeChange[] = useMemo(
    () => changes?.changes ?? [],
    [changes]
  );

  const heroStill = useMemo(() => {
    if (detail?.still_path) return `${HIRES_BASE}${detail.still_path}`;
    if (stills.length > 0) return `${HIRES_BASE}${stills[0].file_path}`;
    return null;
  }, [detail, stills]);

  if (!seriesId || !seasonNumber || !episodeNumber) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">
          Missing seriesId / seasonNumber / episodeNumber in route.
        </p>
      </div>
    );
  }

  if (loading && !detail) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">Loading episode details…</p>
      </div>
    );
  }

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
                fetchTvEpisode({
                  seriesId: Number(seriesId),
                  seasonNumber: Number(seasonNumber),
                  episodeNumber: Number(episodeNumber),
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

  if (!detail) return null;

  return (
    <div
      className="
        min-h-screen
        bg-linear-to-b from-[#020617] via-black to-black
        text-slate-50
      "
    >
      <EpisodeHero
        detail={detail}
        heroStill={heroStill}
        onBack={() => navigate(-1)}
        seriesId={Number(seriesId)}
        seasonNumber={Number(seasonNumber)}
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16">
        {loading && (
          <div className="text-[11px] text-slate-400">
            Updating episode data…
          </div>
        )}

        {error && (
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
          {/* LEFT: Overview + Cast/Crew + Guest stars */}
          <div className="space-y-6">
            <EpisodeOverview detail={detail} />
            <EpisodeCastCrewSection
              cast={cast}
              crew={crew}
              guestStars={guestStars}
            />
          </div>

          {/* RIGHT: Account states, External IDs, Videos */}
          <div className="space-y-6">
            <EpisodeAccountStatesSection accountStates={accountStates} />
            <EpisodeExternalIdsSection externalIds={externalIds} />
            <EpisodeVideosSection videos={videos} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <EpisodeStillsSection stills={stills} />
          <EpisodeTranslationsSection
            translations={translations}
            currentLanguage={language}
          />
        </div>

        <EpisodeChangesSection changeGroups={changeGroups} />
      </div>
    </div>
  );
};

export default TvEpisodePage;
