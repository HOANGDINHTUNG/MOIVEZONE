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
      <div className="mt-4 text-sm md:text-base">
        <h2 className="font-semibold mb-3 text-sm md:text-base">
          Also known as
        </h2>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {alternativeTitles.slice(0, 8).map((t) => (
            <span
              key={`${t.iso_3166_1}-${t.title}`}
              className="inline-flex max-w-full items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 sm:text-sm"
            >
              <span className="mr-1 rounded-full bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white dark:bg-neutral-200 dark:text-neutral-900">
                {t.iso_3166_1}
              </span>
              <span className="truncate">{t.title}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsAlternativeTitlesSection;
