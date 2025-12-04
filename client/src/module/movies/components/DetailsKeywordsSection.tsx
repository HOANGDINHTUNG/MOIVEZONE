// src/pages/DetailsKeywordsSection.tsx
import Divider from "../../../components/common/ux/Divider";

type KeywordItem = { id: number; name: string };

type DetailsKeywordsSectionProps = {
  keywords: KeywordItem[];
};

const DetailsKeywordsSection: React.FC<DetailsKeywordsSectionProps> = ({
  keywords,
}) => {
  if (!keywords.length) return null;

  return (
    <>
      <Divider />
      <div className="mt-4 px-1 sm:px-0">
        <h2 className="mb-2 text-[13px] font-semibold sm:text-sm md:text-base">
          Keywords
        </h2>
        {/* Keywords list */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {keywords.map((k) => (
            <span
              key={k.id}
              className="rounded-full bg-neutral-200 px-2 py-1 
                          text-[10px] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100
                          sm:text-xs sm:px-2.5"
            >
              {k.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsKeywordsSection;
