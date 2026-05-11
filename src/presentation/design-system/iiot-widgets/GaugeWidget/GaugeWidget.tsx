import { useMemo } from "react";

export interface GaugeWidgetProps {
  value: number;
  min: number;
  max: number;
  unit?: string;
  label: string;
  size?: number;
}

/** SVG gauge widget for analog values. */
export const GaugeWidget = ({
  value,
  min,
  max,
  unit,
  label,
  size = 200,
}: GaugeWidgetProps) => {
  const radius = size / 2 - 16;
  const circumference = Math.PI * radius;
  const normalized = Math.min(Math.max(value, min), max);
  const progress = ((normalized - min) / (max - min)) * circumference;

  const stroke = useMemo(() => {
    const ratio = (normalized - min) / (max - min);
    if (ratio < 0.6) return "var(--color-status-online)";
    if (ratio < 0.85) return "var(--color-status-warning)";
    return "var(--color-status-alarm)";
  }, [max, min, normalized]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-elevated p-4">
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        <path
          d={`M ${size / 2 - radius} ${size / 2} a ${radius} ${radius} 0 0 1 ${radius * 2} 0`}
          stroke="var(--color-border-default)"
          strokeWidth="12"
          fill="none"
        />
        <path
          d={`M ${size / 2 - radius} ${size / 2} a ${radius} ${radius} 0 0 1 ${radius * 2} 0`}
          stroke={stroke}
          strokeWidth="12"
          strokeDasharray={`${progress} ${circumference}`}
          fill="none"
        />
      </svg>
      <div className="-mt-6 text-center">
        <div className="text-xs text-muted">{label}</div>
        <div className="text-2xl font-semibold text-primary">
          {value}
          {unit && <span className="ml-1 text-sm text-secondary">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
