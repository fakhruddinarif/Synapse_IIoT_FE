import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Device, DeviceData } from "~/types/device";
import { ProtocolLabels } from "~/types/device";
import { useDeviceSignalR } from "~/hooks/useDeviceSignalR";

interface DeviceInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device | null;
}

export function DeviceInfoDialog({
  open,
  onOpenChange,
  device,
}: Readonly<DeviceInfoDialogProps>) {
  const { isConnected, deviceData, subscribeToDevice, unsubscribeFromDevice } =
    useDeviceSignalR();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [numericFields, setNumericFields] = useState<string[]>([]);
  const [latestData, setLatestData] = useState<DeviceData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Subscribe to device data when dialog opens
  useEffect(() => {
    if (open && device?.id) {
      subscribeToDevice(device.id);
    }
    return () => {
      if (device?.id) {
        unsubscribeFromDevice(device.id);
      }
    };
  }, [open, device?.id, subscribeToDevice, unsubscribeFromDevice]);

  // Update data when device data changes
  useEffect(() => {
    if (device?.id && deviceData.has(device.id)) {
      const data = deviceData.get(device.id);
      if (data && data.length > 0) {
        const latest = data.at(-1);
        if (latest) {
          setLatestData(latest);

          // Extract available fields from the data
          if (latest.data && typeof latest.data === "object") {
            const fields = Object.keys(latest.data);
            setAvailableFields(fields);

            // Separate numeric and non-numeric fields
            const numFields: string[] = [];
            fields.forEach((field) => {
              const value = latest.data[field];
              const numValue = Number(value);
              // Check if value can be converted to a valid number
              if (
                !isNaN(numValue) &&
                value !== null &&
                value !== "" &&
                typeof value !== "object"
              ) {
                numFields.push(field);
              }
            });
            setNumericFields(numFields);

            // Auto-select first 3 numeric fields if none selected
            if (selectedFields.length === 0 && numFields.length > 0) {
              setSelectedFields(
                numFields.slice(0, Math.min(3, numFields.length)),
              );
            }
          }
        }

        // Prepare chart data (last 10 points, FIFO)
        const chartPoints = data.slice(-10).map((point) => {
          const time = new Date(point.timestamp);
          const timeStr = time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          const dataPoint: any = { time: timeStr };
          if (point.data && typeof point.data === "object") {
            Object.keys(point.data).forEach((key) => {
              const value = point.data[key];
              // Try to convert to number if possible, otherwise keep original
              const numValue = Number(value);
              dataPoint[key] =
                !isNaN(numValue) && value !== null && value !== ""
                  ? numValue
                  : null; // Set to null instead of keeping original non-numeric value
            });
          }
          return dataPoint;
        });

        console.log("Chart Data:", chartPoints);
        console.log("Chart Data Length:", chartPoints.length);
        setChartData(chartPoints);
      }
    }
  }, [deviceData, device?.id]);

  const handleFieldToggle = (field: string) => {
    // Only allow toggling numeric fields
    if (!numericFields.includes(field)) {
      return;
    }

    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field);
      }
      return [...prev, field];
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Generate chart config dynamically
  const chartConfig: ChartConfig = selectedFields.reduce(
    (config, field, index) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ];
      config[field] = {
        label: field,
        color: colors[index % colors.length],
      };
      return config;
    },
    {} as ChartConfig,
  );

  // Debug logging for chart configuration
  useEffect(() => {
    console.log("Selected Fields:", selectedFields);
    console.log("Chart Config:", chartConfig);
    console.log("Available Fields:", availableFields);
    console.log("Numeric Fields:", numericFields);
  }, [selectedFields, availableFields, numericFields]);

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Device Information</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* Device Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Device Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{device.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Protocol</Label>
                <p className="font-medium">{device.protocol}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      device.isEnabled
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {device.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Polling Interval
                </Label>
                <p className="font-medium">{device.pollingInterval} ms</p>
              </div>
              {device.description && (
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{device.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Data Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Latest Data</h3>
            {latestData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p
                      className={`font-medium ${
                        latestData.status.toLowerCase() === "success"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {latestData.status}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Timestamp</Label>
                    <p className="font-medium">
                      {new Date(latestData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {latestData.data && (
                  <div>
                    <Label className="text-muted-foreground">Data</Label>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(latestData.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </div>

          {/* Real-time Chart Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Real-time Data</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    isConnected
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-600" : "bg-red-600"
                    }`}
                  />
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>
            </div>

            {/* Field Selector */}
            {availableFields.length > 0 && (
              <div className="space-y-2">
                <Label>Select Fields to Display (Numeric Only)</Label>
                <div className="flex flex-wrap gap-2">
                  {availableFields.map((field) => {
                    const isNumeric = numericFields.includes(field);
                    return (
                      <label
                        key={field}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${
                          isNumeric
                            ? "cursor-pointer hover:bg-muted"
                            : "cursor-not-allowed opacity-50 bg-muted/30"
                        }`}
                        title={
                          isNumeric
                            ? undefined
                            : "Non-numeric field cannot be charted"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() => handleFieldToggle(field)}
                          disabled={!isNumeric}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-medium">
                          {field}
                          {!isNumeric && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              (non-numeric)
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chart */}
            {chartData.length > 0 && selectedFields.length > 0 ? (
              <div className="w-full h-[300px]">
                <ChartContainer config={chartConfig}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {selectedFields.map((field) => {
                      console.log(
                        `Rendering line for field: ${field}, color: ${chartConfig[field]?.color}`,
                      );
                      return (
                        <Line
                          key={field}
                          type="monotone"
                          dataKey={field}
                          stroke={
                            chartConfig[field]?.color || "hsl(var(--chart-1))"
                          }
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          name={String(chartConfig[field]?.label || field)}
                          isAnimationActive={false}
                          connectNulls={true}
                        />
                      );
                    })}
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <p className="text-muted-foreground">
                  {availableFields.length === 0
                    ? "Waiting for data..."
                    : "Select at least one field to display chart"}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
