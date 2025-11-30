// src/pages/DetailsTrailerSection.tsx
import Divider from "../../../components/common/ux/Divider";

type TrailerInfo = {
  name: string;
};

type DetailsTrailerSectionProps = {
  trailer: TrailerInfo;
  onOpenTrailer: () => void;
};

const DetailsTrailerSection: React.FC<DetailsTrailerSectionProps> = ({
  trailer,
  onOpenTrailer,
}) => {
  return (
    <>
      <Divider />
      <div className="mt-4" id="trailer">
        <h2 className="font-semibold mb-1 text-sm md:text-base">Trailer</h2>
        <p className="text-xs text-neutral-400 mb-2">{trailer.name}</p>
        <button
          type="button"
          onClick={onOpenTrailer}
          className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          ▶ Xem trailer
        </button>
      </div>
    </>
  );
};

export default DetailsTrailerSection;
