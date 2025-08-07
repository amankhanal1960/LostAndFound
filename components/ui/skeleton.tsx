import { Card, CardContent } from "@/components/ui/card";

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6 mb-6 lg:mb-0">
            <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded mb-2 animate-pulse" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

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

export const SkeletonStatsCard = () => (
  <Card className="animate-pulse border-gray-200/60 shadow-sm bg-white/90 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3 w-full">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mt-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mt-2"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);
