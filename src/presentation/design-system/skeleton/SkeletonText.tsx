import { Skeleton } from "./Skeleton";

export interface SkeletonTextProps {
  count?: number;
}

/** Multi-line text skeleton with varied widths. */
export const SkeletonText = ({ count = 3 }: SkeletonTextProps) => {
  const widths = ["100%", "85%", "70%"];
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          width={widths[index % widths.length]}
          height="0.75rem"
          variant="text"
        />
      ))}
    </div>
  );
};
