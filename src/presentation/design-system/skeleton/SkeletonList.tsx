import { Skeleton } from "./Skeleton";

export interface SkeletonListProps {
  count?: number;
}

/** List skeleton rows with icon and action blocks. */
export const SkeletonList = ({ count = 4 }: SkeletonListProps) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center gap-3">
        <Skeleton variant="circle" width="24px" height="24px" />
        <Skeleton width="60%" height="0.75rem" />
        <Skeleton width="40px" height="0.75rem" />
      </div>
    ))}
  </div>
);
