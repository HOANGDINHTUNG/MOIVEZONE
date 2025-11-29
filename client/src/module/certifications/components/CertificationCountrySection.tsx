import type { TMDBCertificationItem } from "../database/interface/certification";
import CertificationBadge from "./CertificationBadge";

// Map mã quốc gia → label hiển thị đẹp hơn
const COUNTRY_LABELS: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  BR: "Brazil",
  CA: "Canada",
  AU: "Australia",
  RU: "Russia",
  CN: "China",
  MX: "Mexico",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  AR: "Argentina",
  CL: "Chile",
  NZ: "New Zealand",
  // thêm VN nếu TMDB có dùng
  VN: "Vietnam",
};

interface CertificationCountrySectionProps {
  countryCode: string;
  items: TMDBCertificationItem[];
}

const CertificationCountrySection = ({
  countryCode,
  items,
}: CertificationCountrySectionProps) => {
  const title = COUNTRY_LABELS[countryCode] || countryCode;

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
          <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
            ({countryCode})
          </span>
        </h2>

        <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
          {sorted.length} ratings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((item) => (
          <CertificationBadge key={item.certification} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CertificationCountrySection;
