import type { TMDBCompanyAltName } from "../database/interface/company";

interface CompanyAltNamesProps {
  altNames: TMDBCompanyAltName[];
}

const CompanyAltNames = ({ altNames }: CompanyAltNamesProps) => {
  if (!altNames.length) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Tên thay thế của hãng
      </h3>

      <div className="flex flex-wrap gap-2 text-xs md:text-sm">
        {altNames.map((n, index) => (
          <span
            key={`${n.name}-${index}`}
            className="
              px-2 py-1 rounded-full
              bg-neutral-200 dark:bg-neutral-800
              text-neutral-800 dark:text-neutral-100
            "
          >
            {n.name}
            {n.type && (
              <span className="ml-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                ({n.type})
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
};

export default CompanyAltNames;
