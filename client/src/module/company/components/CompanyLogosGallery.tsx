import type { TMDBCompanyImagesResponse } from "../database/interface/company";

interface CompanyLogosGalleryProps {
  images: TMDBCompanyImagesResponse;
  imageBaseUrl: string;
}

const CompanyLogosGallery = ({
  images,
  imageBaseUrl,
}: CompanyLogosGalleryProps) => {
  const { logos } = images;

  if (!logos.length) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Logo của hãng
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="
              aspect-video rounded-xl overflow-hidden
              bg-neutral-200 dark:bg-neutral-800
              flex items-center justify-center
            "
          >
            <img
              src={imageBaseUrl + logo.file_path}
              alt={`Logo ${images.id}`}
              className="w-full h-full object-contain p-4"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyLogosGallery;
