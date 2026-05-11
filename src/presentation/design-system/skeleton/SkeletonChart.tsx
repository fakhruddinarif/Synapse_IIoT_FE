import { Skeleton } from "./Skeleton";

export interface SkeletonChartProps {
  height?: string;
}

/** Chart area skeleton with subtle grid overlay. */
export const SkeletonChart = ({ height = "220px" }: SkeletonChartProps) => (
  <div className="relative rounded-lg border border-default bg-elevated p-4">
    <Skeleton height={height} />
    <div className="pointer-events-none absolute inset-4 rounded-lg border border-default opacity-40" />
  </div>
);
