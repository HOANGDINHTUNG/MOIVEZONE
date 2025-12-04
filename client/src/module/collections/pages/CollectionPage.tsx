import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchCollectionById, clearCollection } from "../store/collectionSlice";
import CollectionHero from "../components/CollectionHero";
import CollectionPartsList from "../components/CollectionPartsList";
import SkeletonCollectionPage from "../components/SkeletonCollectionPage";
import CollectionImagesGallery from "../components/CollectionImagesGallery";

import type { TMDBCollectionTranslation } from "../database/interface/collection";
import {
  setLanguage,
  type AppLanguage,
} from "../../movies/store/languageSlice";

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Lấy state collection đầy đủ (đã gồm images + translations trong slice)
  const { current, images, translations, loading, error } = useAppSelector(
    (state) => state.collection
  );

  // Base URL ảnh từ moviesData (đã có sẵn trong project)
  const imageBaseUrl = useAppSelector((state) => state.moviesData.imageURL);

  // Ngôn ngữ hiện tại – global
  const currentLanguage = useAppSelector((state) => state.language.current);

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    // fetch collection (details + images + translations) theo language hiện tại
    dispatch(fetchCollectionById(numericId));

    return () => {
      dispatch(clearCollection());
    };
  }, [id, currentLanguage, dispatch]);

  if (loading && !current) {
    return <SkeletonCollectionPage />;
  }

  if (error && !current) {
    return (
      <div className="py-10 text-center text-sm text-red-400">
        Có lỗi khi tải bộ sưu tập: {error}
      </div>
    );
  }

  if (!current) {
    return (
      <div className="py-10 text-center text-sm text-neutral-400">
        Không tìm thấy bộ sưu tập.
      </div>
    );
  }

  const translationsList: TMDBCollectionTranslation[] =
    translations?.translations ?? [];

  // tạm coi "đang tải translations" khi collection đang loading và chưa có translations
  const isTranslationsLoading = loading && !translations && !error && !!current;

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
      {/* Thanh trên cùng: title nhỏ + info translations + chọn ngôn ngữ */}
      <div className="flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold">
          Collection Details
        </h1>

        <div className="flex items-center gap-2 text-xs">
          {isTranslationsLoading && (
            <span className="text-neutral-500 dark:text-neutral-400">
              Đang tải bản dịch…
            </span>
          )}

          {translationsList.length > 0 && (
            <select
              className="
                rounded-full px-3 py-1 border text-xs outline-none
                bg-white dark:bg-neutral-900
                border-neutral-300 dark:border-neutral-700
                text-neutral-800 dark:text-neutral-100
              "
              value={currentLanguage}
              onChange={(e) => {
                const lang = e.target.value as AppLanguage; // 👈 ép về AppLanguage
                dispatch(setLanguage(lang));
              }}
            >
              {Array.from(
                new Map(translationsList.map((t) => [t.iso_639_1, t])).values()
              ).map((t) => (
                <option key={t.iso_639_1} value={t.iso_639_1}>
                  {t.english_name} ({t.iso_639_1})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Hero – thêm translations + activeLanguage (là currentLanguage) */}
      <CollectionHero
        collection={current}
        images={images ?? undefined}
        imageBaseUrl={imageBaseUrl}
        translations={translationsList}
        activeLanguage={currentLanguage}
      />

      {/* Danh sách phim */}
      <CollectionPartsList parts={current.parts} imageBaseUrl={imageBaseUrl} />

      {/* Gallery hình ảnh */}
      {images && (
        <CollectionImagesGallery images={images} imageBaseUrl={imageBaseUrl} />
      )}
    </div>
  );
};

export default CollectionPage;
