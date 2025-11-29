import type { TMDBCertificationItem } from "../database/interface/certification";

interface CertificationBadgeProps {
  item: TMDBCertificationItem;
}

const CertificationBadge = ({ item }: CertificationBadgeProps) => {
  return (
    <div
      className="
        relative flex flex-col gap-2
        p-3 rounded-xl
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="
            inline-flex items-center justify-center
            px-3 py-1 rounded-full
            text-sm font-bold tracking-wide
            bg-neutral-900 dark:bg-neutral-100
            text-neutral-100 dark:text-neutral-900
          "
        >
          {item.certification || "NR"}
        </span>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          Order #{item.order}
        </span>
      </div>

      {item.meaning && (
        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {item.meaning}
        </p>
      )}
    </div>
  );
};

export default CertificationBadge;
