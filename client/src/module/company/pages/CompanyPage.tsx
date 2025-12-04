import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchCompanyById, clearCompany } from "../store/companySlice";
import SkeletonCompanyPage from "../components/SkeletonCompanyPage";
import CompanyHero from "../components/CompanyHero";
import CompanyAltNames from "../components/CompanyAltNames";
import CompanyLogosGallery from "../components/CompanyLogosGallery";
import CompanyMoviesList from "../components/CompanyMoviesList";

const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { details, altNames, images, loading, error } = useAppSelector(
    (state) => state.company
  );

  const imageBaseUrl = useAppSelector((state) => state.moviesData.imageURL);
  const currentLanguage = useAppSelector((state) => state.language.current);

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    dispatch(fetchCompanyById(numericId));

    return () => {
      dispatch(clearCompany());
    };
  }, [id, currentLanguage, dispatch]);

  if (loading && !details) {
    return <SkeletonCompanyPage />;
  }

  if (error && !details) {
    return (
      <div className="py-10 text-center text-sm text-red-400">
        Có lỗi khi tải thông tin hãng phim: {error}
      </div>
    );
  }

  if (!details) {
    return (
      <div className="py-10 text-center text-sm text-neutral-400">
        Không tìm thấy thông tin hãng phim.
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        px-4 md:px-8 py-4 md:py-6 space-y-6
        bg-neutral-100 dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        transition-colors
      "
    >
      <div className="flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold">Company Details</h1>
      </div>

      <CompanyHero company={details} imageBaseUrl={imageBaseUrl} />

      {altNames && altNames.results.length > 0 && (
        <CompanyAltNames altNames={altNames.results} />
      )}

      {images && images.logos.length > 0 && (
        <CompanyLogosGallery images={images} imageBaseUrl={imageBaseUrl} />
      )}

      <CompanyMoviesList companyId={details.id} imageBaseUrl={imageBaseUrl} />
    </div>
  );
};

export default CompanyPage;
