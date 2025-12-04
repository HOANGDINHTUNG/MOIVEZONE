const SkeletonCollectionPage = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-64 md:h-80 rounded-2xl bg-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* List skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-neutral-800 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 items-center bg-neutral-900/60 rounded-xl p-3"
            >
              <div className="w-16 h-24 bg-neutral-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-neutral-800 rounded" />
                <div className="h-3 w-1/4 bg-neutral-800 rounded" />
                <div className="h-3 w-3/4 bg-neutral-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCollectionPage;
