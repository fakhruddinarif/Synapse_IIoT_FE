import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "@app/hooks";

export interface TrendChartProps {
  data: Array<{ timestamp: string; value: number }>;
  label?: string;
}

/** Real-time trend chart. */
export const TrendChart = ({ data, label }: TrendChartProps) => {
  const theme = useChartTheme();

  return (
    <div className="rounded-lg border border-default bg-elevated p-4">
      {label && <div className="mb-2 text-sm text-secondary">{label}</div>}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="timestamp" stroke={theme.textColor} />
            <YAxis stroke={theme.textColor} />
            <Tooltip
              contentStyle={{
                background: theme.tooltipBg,
                borderColor: theme.tooltipBorder,
                color: theme.textColor,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.lineColors[0]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
