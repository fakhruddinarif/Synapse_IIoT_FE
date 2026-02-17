import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { Device, DeviceData } from "~/types/device";
import { ProtocolLabels } from "~/types/device";

interface DeviceInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device | null;
  deviceDataHistory: DeviceData[];
  onOpen?: (deviceId: string) => void;
  onClose?: (deviceId: string) => void;
}

export function DeviceInfoDialog({
  open,
  onOpenChange,
  device,
  deviceDataHistory,
  onOpen,
  onClose,
}: DeviceInfoDialogProps) {
  useEffect(() => {
    if (open && device && onOpen) {
      onOpen(device.id);
    }
    return () => {
      if (device && onClose) {
        onClose(device.id);
      }
    };
  }, [open, device, onOpen, onClose]);

  const chartData = useMemo(() => {
    if (!deviceDataHistory || deviceDataHistory.length === 0) return [];

    return deviceDataHistory.map((item, index) => {
      const date = new Date(item.timestamp);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;

      const data = item.data || {};

      // Extract numeric values from data object
      const values: Record<string, any> = { time, index: index + 1 };

      // Handle different data structures
      if (typeof data === "object" && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "number") {
            values[key] = value;
          }
        });
      }

      return values;
    });
  }, [deviceDataHistory]);

  const dataKeys = useMemo(() => {
    if (chartData.length === 0) return [];
    const firstItem = chartData[0];
    return Object.keys(firstItem).filter(
      (key) => key !== "time" && key !== "index",
    );
  }, [chartData]);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#a78bfa",
    "#fb923c",
  ];

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    dataKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: colors[index % colors.length],
      };
    });
    return config;
  }, [dataKeys]);

  if (!device) return null;

  const latestData = deviceDataHistory.at(-1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Device Information - {device.name}</DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
          <div className="space-y-6 py-4">
            {/* Device Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold">{device.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Protocol</p>
                <p className="font-semibold">
                  {ProtocolLabels[device.protocol]}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-semibold">
                  {device.description || "No description"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">
                  {device.isEnabled ? (
                    <span className="text-green-600">Enabled</span>
                  ) : (
                    <span className="text-red-600">Disabled</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Polling Interval</p>
                <p className="font-semibold">{device.pollingInterval} ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold">
                  {new Date(device.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Connection Config */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Connection Configuration</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(device.connectionConfig, null, 2)}
              </pre>
            </div>

            {/* Latest Data */}
            {latestData && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Latest Data</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Timestamp</p>
                    <p className="font-semibold">
                      {new Date(latestData.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold">{latestData.status}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">Data</p>
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto mt-1">
                    {JSON.stringify(latestData.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Real-time Chart */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Real-time Data</h3>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-75 w-full">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {dataKeys.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`var(--color-${key})`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <i className="ri-line-chart-line text-4xl mb-2"></i>
                    <p>No data available yet</p>
                    <p className="text-sm">
                      {device.isEnabled
                        ? "Waiting for device data..."
                        : "Device is disabled"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
