import { Skeleton } from "./Skeleton";

export interface SkeletonStatProps {
  count?: number;
}

/** KPI card skeleton. */
export const SkeletonStat = ({ count = 1 }: SkeletonStatProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-lg border border-default bg-elevated p-4"
      >
        <Skeleton width="50%" height="0.7rem" />
        <Skeleton width="70%" height="1.6rem" className="mt-3" />
        <Skeleton width="40%" height="0.6rem" className="mt-2" />
      </div>
    ))}
  </div>
);
