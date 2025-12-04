import type {
  TMDBPersonDetails,
  TMDBPersonExternalIds,
} from "../database/interface/person";

const genderLabel: Record<number, string> = {
  0: "Unknown",
  1: "Female",
  2: "Male",
  3: "Non-binary",
};

interface PersonHeroProps {
  details?: TMDBPersonDetails;
  externalIds?: TMDBPersonExternalIds;
  backdropUrl: string | null;
  profileUrl: string | null;
}

const PersonHero = ({
  details,
  externalIds,
  backdropUrl,
  profileUrl,
}: PersonHeroProps) => {
  const hasSocial =
    externalIds &&
    (externalIds.imdb_id ||
      externalIds.facebook_id ||
      externalIds.instagram_id ||
      externalIds.twitter_id ||
      externalIds.youtube_id ||
      externalIds.wikidata_id ||
      externalIds.tiktok_id);

  return (
    <section className="relative">
      {backdropUrl && (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center blur-sm brightness-50"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* sửa bg-linear-to-b -> bg-gradient-to-b */}
      <div className="bg-linear-to-b from-neutral-900/80 via-neutral-950/95 to-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-10 pt-24 md:flex-row md:pb-14 md:pt-28">
          {/* Avatar */}
          <div className="flex justify-center md:block md:w-1/3 lg:w-1/4">
            <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/70 md:h-80 md:w-56">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={details?.name ?? "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                  No Image
                </div>
              )}
              {details?.popularity && (
                <div className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-2 py-1 text-xs text-amber-300 shadow">
                  Popularity {details.popularity.toFixed(1)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                {details?.name ?? "Loading..."}
              </h1>
              {details?.known_for_department && (
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-wide text-amber-300">
                  {details.known_for_department}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-300 md:text-sm">
              {details && (
                <>
                  <span className="rounded-full bg-neutral-800/80 px-3 py-1">
                    {genderLabel[details.gender] ?? "Unknown"}
                  </span>

                  {details.birthday && (
                    <span className="rounded-full bg-neutral-800/80 px-3 py-1">
                      Born: {details.birthday}
                    </span>
                  )}

                  {details.deathday && (
                    <span className="rounded-full bg-red-900/70 px-3 py-1">
                      Died: {details.deathday}
                    </span>
                  )}

                  {details.place_of_birth && (
                    <span className="rounded-full bg-neutral-800/80 px-3 py-1">
                      {details.place_of_birth}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Social + homepage */}
            {hasSocial && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {externalIds?.imdb_id && (
                  <a
                    href={`https://www.imdb.com/name/${externalIds.imdb_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300 underline-offset-2 hover:bg-yellow-500/20 hover:underline"
                  >
                    IMDB
                  </a>
                )}
                {externalIds?.facebook_id && (
                  <a
                    href={`https://www.facebook.com/${externalIds.facebook_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/20"
                  >
                    Facebook
                  </a>
                )}
                {externalIds?.instagram_id && (
                  <a
                    href={`https://www.instagram.com/${externalIds.instagram_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-300 hover:bg-pink-500/20"
                  >
                    Instagram
                  </a>
                )}
                {externalIds?.twitter_id && (
                  <a
                    href={`https://twitter.com/${externalIds.twitter_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/20"
                  >
                    Twitter
                  </a>
                )}
                {externalIds?.youtube_id && (
                  <a
                    href={`https://www.youtube.com/${externalIds.youtube_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                  >
                    YouTube
                  </a>
                )}
                {externalIds?.tiktok_id && (
                  <a
                    href={`https://www.tiktok.com/@${externalIds.tiktok_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-neutral-50/5 px-3 py-1 text-xs text-neutral-100 hover:bg-neutral-50/10"
                  >
                    TikTok
                  </a>
                )}
                {details?.homepage && (
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Homepage
                  </a>
                )}
              </div>
            )}

            {/* Short bio – cho scroll nếu dài */}
            {details?.biography && (
              <div className="mt-4 max-h-40 md:max-h-48 overflow-y-auto pr-2 text-sm text-neutral-200 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700/80">
                <p className="whitespace-pre-line leading-relaxed">
                  {details.biography}
                </p>
              </div>
            )}

            {/* Anchor nav */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <a
                href="#known-for"
                className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200 hover:bg-neutral-700"
              >
                Known For
              </a>
              <a
                href="#credits"
                className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200 hover:bg-neutral-700"
              >
                Credits
              </a>
              <a
                href="#images"
                className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200 hover:bg-neutral-700"
              >
                Images
              </a>
              <a
                href="#changes"
                className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200 hover:bg-neutral-700"
              >
                Changes
              </a>
              <a
                href="#translations"
                className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200 hover:bg-neutral-700"
              >
                Translations
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonHero;
