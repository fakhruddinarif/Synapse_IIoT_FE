import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";

export interface SkeletonCardProps {
  count?: number;
}

/** Card skeleton with header and text rows. */
export const SkeletonCard = ({ count = 1 }: SkeletonCardProps) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-lg border border-default bg-elevated p-4"
      >
        <Skeleton width="40%" height="1rem" />
        <div className="mt-4">
          <SkeletonText count={3} />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton width="80px" height="0.9rem" />
          <Skeleton width="60px" height="0.9rem" />
        </div>
      </div>
    ))}
  </div>
);
