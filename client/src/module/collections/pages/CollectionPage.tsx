// src/module/collections/pages/CollectionPage.tsx

import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchCollectionById, clearCollection } from "../store/collectionSlice";
import CollectionHero from "../components/CollectionHero";
import CollectionPartsList from "../components/CollectionPartsList";
import SkeletonCollectionPage from "../components/SkeletonCollectionPage";
import CollectionImagesGallery from "../components/CollectionImagesGallery";

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Lấy state collection đầy đủ (đã gồm images trong slice)
  const { current, images, loading, error } = useAppSelector(
    (state) => state.collection
  );

  // Base URL ảnh từ moviesData (đã có sẵn trong project)
  const imageBaseUrl = useAppSelector((state) => state.moviesData.imageURL);

  // Ngôn ngữ hiện tại – để khi đổi language thì refetch
  const currentLanguage = useAppSelector((state) => state.language.current);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!Number.isNaN(numericId)) {
        dispatch(fetchCollectionById(numericId));
      }
    }

    // Khi rời trang thì clear collection khỏi store
    return () => {
      dispatch(clearCollection());
    };
    // Đổi id hoặc đổi ngôn ngữ đều fetch lại
  }, [id, currentLanguage, dispatch]);

  // Đang load và chưa có data lần nào
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

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-8">
      {/* Hero – truyền luôn images nếu slice có */}
      <CollectionHero
        collection={current}
        images={images ?? undefined}
        imageBaseUrl={imageBaseUrl}
      />

      {/* Danh sách các phần trong collection */}
      <CollectionPartsList parts={current.parts} imageBaseUrl={imageBaseUrl} />

      {/* Gallery hình ảnh collection (posters + backdrops) */}
      {images && (
        <CollectionImagesGallery images={images} imageBaseUrl={imageBaseUrl} />
      )}
    </div>
  );
};

export default CollectionPage;
