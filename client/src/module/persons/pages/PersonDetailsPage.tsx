import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchPersonFull } from "../store/personSlice";

import PersonHero from "../components/PersonHero";
import PersonKnownFor from "../components/PersonKnownFor";
import PersonCredits from "../components/PersonCredits";
import PersonImages from "../components/PersonImages";
import PersonChanges from "../components/PersonChanges";
import PersonTranslations from "../components/PersonTranslations";
import PersonLatestCard from "../components/PersonLatestCard";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

const PersonDetailsPage = () => {
  const { personId } = useParams<{ personId: string }>();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const personState = useAppSelector((state) => state.person);
  const { data, status, error } = personState;

  useEffect(() => {
    if (personId) {
      dispatch(
        fetchPersonFull({
          personId: Number(personId),
          language,
        })
      );
    }
  }, [dispatch, personId, language]);

  const details = data?.details;
  const combinedCredits = data?.combinedCredits;
  const movieCredits = data?.movieCredits;
  const tvCredits = data?.tvCredits;
  const externalIds = data?.externalIds;
  const images = data?.images;
  const taggedImages = data?.taggedImages;
  const changes = data?.changes;
  const translations = data?.translations;
  const latest = data?.latest;

  const profileUrl: string | null = details?.profile_path
    ? `${IMAGE_BASE}/w500${details.profile_path}`
    : null;

  const backdropFromCredits = useMemo(() => {
    if (!combinedCredits) return null;
    const sorted = [...combinedCredits.cast].sort(
      (a, b) => b.popularity - a.popularity
    );
    const item = sorted.find((c) => c.backdrop_path || c.poster_path);
    return item?.backdrop_path || item?.poster_path || null;
  }, [combinedCredits]);

  const backdropUrl: string | null = backdropFromCredits
    ? `${IMAGE_BASE}/original${backdropFromCredits}`
    : details?.profile_path
    ? `${IMAGE_BASE}/original${details.profile_path}`
    : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* HERO */}
      <PersonHero
        details={details}
        externalIds={externalIds}
        backdropUrl={backdropUrl}
        profileUrl={profileUrl}
      />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-6">
        {/* Loading & error */}
        {status === "loading" && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-300">
            Đang tải thông tin người này...
          </div>
        )}
        {status === "failed" && (
          <div className="rounded-xl border border-red-800 bg-red-950/80 p-4 text-sm text-red-200">
            Lỗi tải dữ liệu: {error}
          </div>
        )}

        {/* Known For */}
        <PersonKnownFor combinedCredits={combinedCredits} />

        {/* Full Credits */}
        <PersonCredits movieCredits={movieCredits} tvCredits={tvCredits} />

        {/* Images */}
        <PersonImages images={images} taggedImages={taggedImages} />

        {/* Changes */}
        <PersonChanges changes={changes} />

        {/* Translations */}
        <PersonTranslations translations={translations} />

        {/* Latest Person mini card */}
        <PersonLatestCard latest={latest} />

        {/* Back to list */}
        <div className="flex justify-end">
          <Link
            to="/people" // chỉnh route theo app của bạn
            className="text-xs text-neutral-400 underline-offset-2 hover:text-neutral-200 hover:underline"
          >
            ← Quay lại danh sách người
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PersonDetailsPage;
