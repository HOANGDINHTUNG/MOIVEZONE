const SkeletonCompanyPage = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-40 md:h-48 rounded-2xl bg-neutral-800 overflow-hidden" />

      {/* Info skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-neutral-800 rounded" />
        <div className="h-4 w-1/2 bg-neutral-800 rounded" />
        <div className="h-4 w-1/3 bg-neutral-800 rounded" />
      </div>
    </div>
  );
};

export default SkeletonCompanyPage;
