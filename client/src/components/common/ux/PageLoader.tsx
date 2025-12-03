// src/components/common/PageLoader.tsx
const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-neutral-700 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
};

export default PageLoader;
