import { cn } from "~/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Card Skeleton - for loading states on card layouts
 */
function SkeletonCard({ count = 1 }: Readonly<{ count?: number }>) {
  return (
    <>
      {new Array(count).fill(0).map(() => (
        <div
          key={crypto.randomUUID()}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-4"
        >
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Text Skeleton - for loading text content
 */
function SkeletonText({
  lines = 3,
  className = "",
}: Readonly<{
  lines?: number;
  className?: string;
}>) {
  return (
    <div className={`space-y-3 ${className}`}>
      {new Array(lines).fill(0).map((_, i) => (
        <Skeleton
          key={crypto.randomUUID()}
          className={i === lines - 1 ? "h-4 w-2/3" : "h-4 w-full"}
        />
      ))}
    </div>
  );
}

/**
 * Table Skeleton - for loading table content
 */
function SkeletonTable({
  rows = 5,
  columns = 5,
}: Readonly<{
  rows?: number;
  columns?: number;
}>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {new Array(columns).fill(0).map(() => (
              <th key={crypto.randomUUID()} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {new Array(rows).fill(0).map(() => (
            <tr
              key={crypto.randomUUID()}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              {new Array(columns).fill(0).map(() => (
                <td key={crypto.randomUUID()} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Grid Skeleton - for loading grid layouts
 */
function SkeletonGrid({ count = 4 }: Readonly<{ count?: number }>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {new Array(count).fill(0).map(() => (
        <div
          key={crypto.randomUUID()}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-3"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonText, SkeletonTable, SkeletonGrid };
