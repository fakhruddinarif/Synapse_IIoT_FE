import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

interface NoDataProps {
  readonly title?: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly animationData?: any; // Custom Lottie animation data
  readonly useDefaultAnimation?: boolean; // Use the default no-data animation
  readonly animationSize?: "sm" | "md" | "lg"; // Size of the animation
  readonly className?: string;
}

export function NoData({
  title = "No Data Available",
  description = "There's no data to display at the moment. Try adding some items or adjusting your filters.",
  actionLabel,
  onAction,
  animationData,
  useDefaultAnimation = true,
  animationSize = "md",
  className = "",
}: Readonly<NoDataProps>) {
  const [defaultAnimation, setDefaultAnimation] = useState<any>(null);

  useEffect(() => {
    if (useDefaultAnimation && !animationData) {
      // Load default animation from public folder
      fetch("/assets/no-data.json")
        .then((res) => res.json())
        .then((data) => setDefaultAnimation(data))
        .catch((err) => console.error("Failed to load animation:", err));
    }
  }, [useDefaultAnimation, animationData]);

  // Animation size classes
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  // Determine which animation to use
  const animationToUse =
    animationData || (useDefaultAnimation ? defaultAnimation : null);

  return (
    <Card>
      <div
        className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      >
        <div className="max-w-md w-full text-center">
          {/* Animation or Icon */}
          <div className="mb-6 flex justify-center">
            {animationToUse ? (
              <div className={sizeClasses[animationSize]}>
                <Lottie
                  animationData={animationToUse}
                  loop={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <svg
                className="mx-auto h-32 w-32 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          {/* Action Button */}
          {actionLabel && onAction && (
            <Button onClick={onAction} variant="default">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
