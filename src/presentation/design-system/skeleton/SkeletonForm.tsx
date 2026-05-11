import { Skeleton } from "./Skeleton";

export interface SkeletonFormProps {
  count?: number;
}

/** Form skeleton with label/input rows. */
export const SkeletonForm = ({ count = 4 }: SkeletonFormProps) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton width="30%" height="0.6rem" />
        <Skeleton height="2.2rem" />
      </div>
    ))}
    <Skeleton width="120px" height="2.4rem" />
  </div>
);
