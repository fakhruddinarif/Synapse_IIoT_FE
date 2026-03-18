/**
 * Stat Card Component
 * Display statistics with optional icon and trend
 */

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | null;
  trendValue?: number;
  variant?: "default" | "success" | "warning" | "error" | "info";
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-100",
    icon: "text-blue-600",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-900 dark:text-green-100",
    icon: "text-green-600",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-900 dark:text-yellow-100",
    icon: "text-yellow-600",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-900 dark:text-red-100",
    icon: "text-red-600",
  },
  info: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-900 dark:text-purple-100",
    icon: "text-purple-600",
  },
};

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  trendValue,
  variant = "default",
  onClick,
  className = "",
}: Readonly<StatCardProps>) {
  const styles = variantStyles[variant];
  const commonClasses = `
    ${styles.bg} ${styles.border} border rounded-lg p-6
    dark:bg-gray-800 dark:border-gray-700
    ${className}
  `;

  const content = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-bold dark:text-white">{value}</p>
          {trend && trendValue ? (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendValue}%
              </span>
            </div>
          ) : null}
        </div>

        {subtext && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {subtext}
          </p>
        )}
      </div>

      {icon && (
        <div className={`shrink-0 text-3xl ml-4 ${styles.icon}`}>{icon}</div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${commonClasses} cursor-pointer hover:shadow-lg transition-shadow text-left`}
      >
        {content}
      </button>
    );
  }

  return <div className={commonClasses}>{content}</div>;
}

/**
 * Mini Stat Card - Smaller version for dashboards
 */
export function MiniStatCard({
  label,
  value,
  icon,
}: Readonly<Omit<StatCardProps, "variant">>) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="text-2xl text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
