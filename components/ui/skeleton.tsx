// SkeletonItemCard.tsx
export const SkeletonItemCard = () => (
  <div className="animate-pulse group shadow-sm rounded-lg overflow-hidden">
    {/* Image placeholder */}
    <div className="h-52 bg-gray-200 rounded-t-lg" />

    {/* Content placeholder */}
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4" /> {/* title */}
      <div className="h-4 bg-gray-200 rounded w-full" /> {/* desc line 1 */}
      <div className="h-4 bg-gray-200 rounded w-5/6" /> {/* desc line 2 */}
      <div className="h-4 bg-gray-200 rounded w-2/3" /> {/* desc line 3 */}
      <div className="h-10 bg-gray-200 rounded w-full" /> {/* buttons bar */}
    </div>
  </div>
);

// SkeletonClaimCard.tsx
export const SkeletonClaimCard = () => (
  <div className="animate-pulse group shadow-sm rounded-lg overflow-hidden">
    {/* Image placeholder */}
    <div className="h-48 bg-gray-200" />

    {/* Content placeholder */}
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-1/2" /> {/* claimant name */}
      <div className="h-4 bg-gray-200 rounded w-full" />{" "}
      {/* claim message line 1 */}
      <div className="h-4 bg-gray-200 rounded w-5/6" /> {/* line 2 */}
      <div className="h-4 bg-gray-200 rounded w-2/3" /> {/* line 3 */}
      <div className="h-8 bg-gray-200 rounded w-1/2 mt-2" />
      {/* date/button */}
    </div>
  </div>
);
