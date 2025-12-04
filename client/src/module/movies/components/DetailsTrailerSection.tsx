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
      <section className="mt-4" id="trailer">
        <h2 className="font-semibold mb-1 text-sm md:text-base">Trailer</h2>

        {/* Tên trailer – responsive text */}
        <p className="text-xs md:text-sm text-neutral-400 mb-2">
          {trailer.name}
        </p>

        {/* Nút xem trailer – responsive size + hiệu ứng */}
        <button
          type="button"
          onClick={onOpenTrailer}
          className="
            flex items-center gap-2
            px-4 py-2
            text-xs md:text-sm font-semibold
            rounded-full bg-red-600
            text-white shadow-md shadow-red-900/40
            transition-all
            hover:bg-red-500 hover:shadow-red-700/60
            active:scale-[0.97]
          "
        >
          <span className="text-base md:text-lg">▶</span>
          <span>▶ Xem trailer</span>
        </button>
      </section>
    </>
  );
};

export default DetailsTrailerSection;
