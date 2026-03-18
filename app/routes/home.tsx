import { useEffect } from "react";
import { useDeviceStore } from "~/lib/store";
import type { DeviceState, Device } from "~/lib/store";
import { StatCard } from "~/components/stat-card";
import { SkeletonGrid, SkeletonTable } from "~/components/ui/skeleton";
import { Wifi, WifiOff, AlertCircle, BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export default function Dashboard() {
  const devices = useDeviceStore((state: DeviceState) => state.devices);
  const isLoading = useDeviceStore((state: DeviceState) => state.isLoading);
  const setDevices = useDeviceStore((state: DeviceState) => state.setDevices);
  const setLoading = useDeviceStore((state: DeviceState) => state.setLoading);
  const setError = useDeviceStore((state: DeviceState) => state.setError);

  // Fetch devices on mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/devices", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setDevices(result.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch devices",
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const onlineCount = devices.filter((d: Device) => d.isOnline).length;
  const offlineCount = devices.filter((d: Device) => !d.isOnline).length;
  const errorCount = devices.filter((d: Device) => d.lastErrorMessage).length;
  const enabledCount = devices.filter((d: Device) => d.isEnabled).length;

  const onlinePercentage =
    devices.length > 0 ? Math.round((onlineCount / devices.length) * 100) : 0;

  const isEmpty = devices.length === 0;

  const getDeviceTableContent = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <SkeletonTable rows={5} columns={5} />
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="p-12 text-center">
          <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No devices found. Create your first device to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Error Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device: Device) => (
              <TableRow
                key={device.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {device.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{device.protocol}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {device.isOnline ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Online
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Offline
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {device.lastSuccessfulReadAt
                    ? new Date(device.lastSuccessfulReadAt).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell className="text-sm">
                  {device.lastErrorMessage ? (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs">
                      {device.lastErrorMessage}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time monitoring of your industrial devices
            </p>
          </div>
          <button
            onClick={fetchDevices}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Online Devices"
              value={onlineCount}
              subtext={`${onlinePercentage}% of total`}
              icon={<Wifi className="text-green-600" />}
              variant="success"
              trend={onlinePercentage >= 80 ? "up" : "down"}
              trendValue={onlinePercentage}
            />
            <StatCard
              label="Offline Devices"
              value={offlineCount}
              subtext={`${devices.length > 0 ? Math.round((offlineCount / devices.length) * 100) : 0}% of total`}
              icon={<WifiOff className="text-red-600" />}
              variant="error"
            />
            <StatCard
              label="Devices with Errors"
              value={errorCount}
              subtext="requiring attention"
              icon={<AlertCircle className="text-yellow-600" />}
              variant="warning"
            />
            <StatCard
              label="Active Devices"
              value={enabledCount}
              subtext="currently enabled"
              icon={<BarChart3 className="text-blue-600" />}
              variant="info"
            />
          </div>
        )}
      </div>

      {/* Devices Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Devices
            </h2>
          </div>

          {getDeviceTableContent()}
        </div>
      </div>
    </div>
  );
}
