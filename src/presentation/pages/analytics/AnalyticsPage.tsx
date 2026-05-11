import { TrendChart } from "@ui/iiot-widgets";

const trendData = Array.from({ length: 12 }).map((_, index) => ({
  timestamp: `10:${index.toString().padStart(2, "0")}`,
  value: 40 + index * 1.8,
}));

const AnalyticsPage = () => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-primary">Analytics</h2>
    <TrendChart data={trendData} label="Throughput (avg)" />
  </div>
);

export default AnalyticsPage;
