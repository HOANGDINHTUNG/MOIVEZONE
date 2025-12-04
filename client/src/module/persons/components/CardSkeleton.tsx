// src/components/common/CardSkeleton.tsx
const CardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/80">
      <div className="h-56 w-full animate-pulse bg-neutral-800 md:h-64" />
      <div className="space-y-2 px-3 pb-3 pt-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-800" />
        <div className="h-2 w-1/2 animate-pulse rounded bg-neutral-800" />
        <div className="h-2 w-2/3 animate-pulse rounded bg-neutral-800" />
      </div>
    </div>
  );
};

export default CardSkeleton;
