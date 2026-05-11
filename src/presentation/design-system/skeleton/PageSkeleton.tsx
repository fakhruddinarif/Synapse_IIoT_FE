import { Skeleton } from "./Skeleton";
import { SkeletonCard } from "./SkeletonCard";

/** Full-page skeleton matching the main app layout. */
export const PageSkeleton = () => (
  <div className="min-h-screen bg-canvas text-primary">
    <div className="flex">
      <aside className="hidden w-64 flex-shrink-0 border-r border-default bg-surface p-6 md:block">
        <Skeleton width="70%" height="1.2rem" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height="0.8rem" />
          ))}
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-default bg-surface px-6 py-4">
          <Skeleton width="25%" height="0.8rem" />
          <div className="flex gap-2">
            <Skeleton width="28px" height="28px" variant="circle" />
            <Skeleton width="28px" height="28px" variant="circle" />
          </div>
        </div>
        <main className="p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonCard count={2} />
          </div>
        </main>
      </div>
    </div>
  </div>
);
