import { useEffect, useState } from "react";

/** Controls skeleton display timing to prevent flicker. */
export const useSkeleton = (isLoading: boolean, minDisplayMs = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      setShowSkeleton(false);
      return;
    }

    const id = window.setTimeout(() => {
      setShowSkeleton(true);
    }, minDisplayMs);

    return () => window.clearTimeout(id);
  }, [isLoading, minDisplayMs]);

  return { isLoading, showSkeleton, minDisplayMs };
};
