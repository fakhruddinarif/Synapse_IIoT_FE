import { Skeleton } from "./Skeleton";

export interface SkeletonTableProps {
  count?: number;
}

/** Table skeleton with header and row cells. */
export const SkeletonTable = ({ count = 5 }: SkeletonTableProps) => (
  <div className="space-y-3">
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={`head-${index}`} height="0.75rem" />
      ))}
    </div>
    {Array.from({ length: count }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, cellIndex) => (
          <Skeleton key={`cell-${rowIndex}-${cellIndex}`} height="0.75rem" />
        ))}
      </div>
    ))}
  </div>
);
