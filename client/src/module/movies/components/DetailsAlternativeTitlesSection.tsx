// src/pages/DetailsAlternativeTitlesSection.tsx
import Divider from "../../../components/common/ux/Divider";

type AltTitleItem = { iso_3166_1: string; title: string };

type DetailsAlternativeTitlesSectionProps = {
  alternativeTitles: AltTitleItem[];
};

const DetailsAlternativeTitlesSection: React.FC<
  DetailsAlternativeTitlesSectionProps
> = ({ alternativeTitles }) => {
  if (!alternativeTitles.length) return null;

  return (
    <>
      <Divider />
      <div className="mt-4 text-sm">
        <h2 className="font-semibold mb-2 text-sm md:text-base">
          Also known as
        </h2>
        <div className="flex flex-wrap gap-2">
          {alternativeTitles.slice(0, 8).map((t) => (
            <span
              key={`${t.iso_3166_1}-${t.title}`}
              className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800"
            >
              <span className="font-semibold">{t.iso_3166_1}</span>
              {": "}
              {t.title}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsAlternativeTitlesSection;
