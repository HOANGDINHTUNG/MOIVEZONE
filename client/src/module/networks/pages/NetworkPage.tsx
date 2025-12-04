import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type {
  TMDBNetworkDetails,
  TMDBNetworkAltName,
  TMDBNetworkLogo,
} from "../database/interface/network";
import {
  fetchNetworkAltNames,
  fetchNetworkDetails,
  fetchNetworkImages,
} from "../../../api/movie/TMDBNetwork.api";

// TMDB image base
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type LogoTypeFilter = "all" | "png" | "svg";

const NetworkPage = () => {
  const { id } = useParams<{ id: string }>();

  const [details, setDetails] = useState<TMDBNetworkDetails | null>(null);
  const [altNames, setAltNames] = useState<TMDBNetworkAltName[]>([]);
  const [logos, setLogos] = useState<TMDBNetworkLogo[]>([]);
  const [logoType, setLogoType] = useState<LogoTypeFilter>("all");
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // thêm: lưu id của altNames response & images response để dùng hết dữ liệu
  const [altNamesSetId, setAltNamesSetId] = useState<number | null>(null);
  const [imagesSetId, setImagesSetId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsRes, altRes, imagesRes] = await Promise.all([
          fetchNetworkDetails(id),
          fetchNetworkAltNames(id),
          fetchNetworkImages(id),
        ]);

        setDetails(detailsRes);
        setAltNames(altRes.results || []);
        setAltNamesSetId(altRes.id ?? null);

        setLogos(
          (imagesRes.logos || [])
            .slice()
            .sort((a, b) => b.vote_count - a.vote_count)
        );
        setImagesSetId(imagesRes.id ?? null);
      } catch (err) {
        console.error("NetworkPage error:", err);
        setError("Không tải được dữ liệu network. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const filteredLogos = useMemo(() => {
    if (logoType === "all") return logos;
    return logos.filter((l) => l.file_type === logoType);
  }, [logos, logoType]);

  if (!id) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center">
        <p>Không có ID network trong URL.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-950 via-neutral-900 to-black text-neutral-50">
      {/* HERO */}
      <section className="relative border-b border-neutral-800/70">
        {/* background gradient nhẹ + pattern */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-red-900/20 via-neutral-900 to-black" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_top,#ffffff22,transparent_60%),radial-gradient(circle_at_bottom,#f9731622,transparent_55%)]" />

        <div className="mx-auto max-w-6xl px-4 pt-24 pb-10 md:pt-28 md:pb-14">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-xs text-neutral-400">
            <Link
              to="/"
              className="hover:text-neutral-200 transition-colors underline-offset-4 hover:underline"
            >
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-neutral-300">Network</span>
            <span>/</span>
            <span className="text-neutral-100 font-medium">#{id}</span>
          </div>

          {/* Hero nội dung chính */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Logo lớn bên trái */}
            <div className="shrink-0">
              <div className="relative flex h-32 w-56 items-center justify-center rounded-2xl border border-neutral-700/70 bg-neutral-900/70 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-sm md:h-36 md:w-64">
                {details?.logo_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE}/w300${details.logo_path}`}
                    alt={details.name}
                    className="max-h-20 max-w-[80%] object-contain md:max-h-24"
                  />
                ) : (
                  <span className="text-sm text-neutral-400">
                    Không có logo
                  </span>
                )}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
              </div>
            </div>

            {/* Thông tin text bên phải */}
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-300">
                Network
                {details?.origin_country && (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-100">
                    {details.origin_country}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                {details ? details.name : "Đang tải..."}
              </h1>

              {details?.headquarters && (
                <p className="text-sm text-neutral-300">
                  <span className="font-medium text-neutral-200">
                    Trụ sở chính:
                  </span>{" "}
                  {details.headquarters}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                <div className="inline-flex items-center gap-1 rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>ID: {details?.id ?? "—"}</span>
                </div>

                {details?.homepage && (
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1 text-emerald-300 hover:border-emerald-400 hover:text-emerald-200"
                  >
                    <span>Trang chủ</span>
                    <span className="text-xs">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 space-y-8 md:space-y-10">
        {/* ALT NAMES + INFO */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Card info chính */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] md:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Thông tin tổng quan
            </h2>
            <div className="mt-4 space-y-3 text-sm text-neutral-200">
              <div className="flex gap-2">
                <span className="w-28 text-neutral-400">Tên chính:</span>
                <span className="flex-1 font-medium">
                  {details?.name ?? "—"}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="w-28 text-neutral-400">Quốc gia:</span>
                <span className="flex-1">{details?.origin_country || "—"}</span>
              </div>

              <div className="flex gap-2">
                <span className="w-28 text-neutral-400">Trụ sở:</span>
                <span className="flex-1">
                  {details?.headquarters || "Không có thông tin"}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="w-28 text-neutral-400">Homepage:</span>
                <span className="flex-1 break-all">
                  {details?.homepage ? (
                    <a
                      href={details.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-300 hover:text-emerald-200 hover:underline"
                    >
                      {details.homepage}
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Card alt names */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] md:p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
                  Tên thay thế
                </h2>
                {altNamesSetId !== null && (
                  <p className="mt-1 text-[10px] text-neutral-500">
                    Alt names set ID: {altNamesSetId}
                  </p>
                )}
              </div>
              <span className="text-xs text-neutral-400">
                {altNames.length} tên
              </span>
            </div>

            {altNames.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-400">
                Network này không có tên thay thế nào được TMDB cung cấp.
              </p>
            ) : (
              <div className="mt-3 grid gap-2 text-xs md:text-sm">
                {altNames.map((item, idx) => (
                  <div
                    key={idx + item.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/80 px-3 py-2"
                  >
                    <span className="text-neutral-100">{item.name}</span>
                    {item.type && (
                      <span className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
                        {item.type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* LOGO GALLERY */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
                Logo gallery
              </h2>
              <p className="mt-1 text-xs text-neutral-400">
                Các logo do TMDB cung cấp. Sắp xếp theo số lượng bình chọn.
              </p>
              {imagesSetId !== null && (
                <p className="mt-1 text-[10px] text-neutral-500">
                  Images set ID: {imagesSetId}
                </p>
              )}
            </div>

            {/* Filter type */}
            <div className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setLogoType("all")}
                className={`rounded-full px-3 py-1 transition ${
                  logoType === "all"
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setLogoType("png")}
                className={`rounded-full px-3 py-1 transition ${
                  logoType === "png"
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => setLogoType("svg")}
                className={`rounded-full px-3 py-1 transition ${
                  logoType === "svg"
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                SVG
              </button>
            </div>
          </div>

          {logos.length === 0 && !loading && (
            <p className="mt-5 text-sm text-neutral-400">
              Không có logo nào cho network này.
            </p>
          )}

          {loading && (
            <div className="mt-5 flex items-center gap-2 text-sm text-neutral-200">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              Đang tải dữ liệu...
            </div>
          )}

          {filteredLogos.length > 0 && !loading && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredLogos.map((logo) => (
                <div
                  key={logo.id}
                  className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4"
                >
                  <img
                    src={`${TMDB_IMAGE_BASE}/w500${logo.file_path}`}
                    alt={`${details?.name || "Network logo"}`}
                    className="max-h-20 w-full object-contain transition duration-300 group-hover:scale-[1.04] group-hover:brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-6 text-[10px] text-neutral-300 opacity-0 transition group-hover:opacity-100">
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        {logo.width}×{logo.height} (
                        {logo.file_type.toUpperCase()})
                      </span>
                      <span>AR: {logo.aspect_ratio.toFixed(2)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span>
                        ⭐ {logo.vote_average.toFixed(1)} · {logo.vote_count}{" "}
                        votes
                      </span>
                      <span className="truncate max-w-[90px]">
                        ID: {logo.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NetworkPage;
