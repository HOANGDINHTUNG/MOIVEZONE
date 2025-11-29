import type { TMDBImageConfig } from "../database/interface/configuration";

interface ImagesSectionProps {
  images: TMDBImageConfig;
}

export const ImagesSection = ({ images }: ImagesSectionProps) => {
  const entries: { label: string; key: keyof TMDBImageConfig }[] = [
    { label: "Backdrops", key: "backdrop_sizes" },
    { label: "Posters", key: "poster_sizes" },
    { label: "Logos", key: "logo_sizes" },
    { label: "Profiles", key: "profile_sizes" },
    { label: "Stills", key: "still_sizes" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Base URLs */}
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Base URLs
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Global
          </span>
        </div>
        <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
          <div className="break-all">
            <span className="font-medium">Base URL: </span>
            {images.base_url}
          </div>
          <div className="break-all">
            <span className="font-medium">Secure Base URL: </span>
            {images.secure_base_url}
          </div>
          <p className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Sử dụng secure URL cho production, kết hợp với size ở bên cạnh.
          </p>
        </div>
      </div>

      {/* Size cards */}
      {entries.map(({ label, key }) => {
        const sizes = images[key] as string[];
        return (
          <div
            key={key}
            className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {label}
              </h2>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {sizes.length} size
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
