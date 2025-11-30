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
      <div className="mt-4">
        <h2 className="font-semibold mb-2 text-sm md:text-base">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k.id}
              className="px-2 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
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
