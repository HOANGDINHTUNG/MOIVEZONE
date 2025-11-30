// src/pages/DetailsRelatedSection.tsx
import Divider from "../../../components/common/ux/Divider";
import HorizontalScollCard from "../../../components/HorizontalScollCard";
import type { MovieSummary } from "../database/interface/movie";
import type { TvSummary } from "../database/interface/tv";

type MediaSummary = MovieSummary | TvSummary;

type DetailsRelatedSectionProps = {
  similarList: MediaSummary[];
  recommendationList: MediaSummary[];
  resolvedMediaType: "movie" | "tv";
};

const DetailsRelatedSection: React.FC<DetailsRelatedSectionProps> = ({
  similarList,
  recommendationList,
  resolvedMediaType,
}) => {
  return (
    <>
      {/* Similar */}
      {similarList && similarList.length > 0 && (
        <>
          <Divider />
          <div className="mt-4">
            <HorizontalScollCard
              heading={
                resolvedMediaType === "movie"
                  ? "Similar Movies"
                  : "Similar TV Shows"
              }
              data={similarList}
              media_type={resolvedMediaType}
            />
          </div>
        </>
      )}

      {/* Recommendations */}
      {recommendationList && recommendationList.length > 0 && (
        <>
          <Divider />
          <div className="mt-4 mb-4">
            <HorizontalScollCard
              heading={
                resolvedMediaType === "movie"
                  ? "Recommended Movies"
                  : "Recommended TV Shows"
              }
              data={recommendationList}
              media_type={resolvedMediaType}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DetailsRelatedSection;
