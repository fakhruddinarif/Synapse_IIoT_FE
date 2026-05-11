import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SkeletonStat } from "@ui/skeleton";
import { Card } from "@ui/components";
import { TrendChart, DeviceCard } from "@ui/iiot-widgets";
import { Table } from "@ui/components";
import type { ColumnDef } from "@tanstack/react-table";
import type { Alarm, Device } from "@core/domain/entities";
import { AlarmLevel, DeviceStatus, ProtocolType } from "@core/domain/enums";

const sampleDevices: Device[] = [
  {
    id: "dev-01",
    name: "Compressor A",
    protocol: ProtocolType.MODBUS_TCP,
    status: DeviceStatus.ONLINE,
    lastSeenAt: "2026-05-11 10:32",
    tagCount: 24,
  },
  {
    id: "dev-02",
    name: "Boiler Stack",
    protocol: ProtocolType.OPC_UA,
    status: DeviceStatus.WARNING,
    lastSeenAt: "2026-05-11 10:30",
    tagCount: 18,
  },
];

const sampleAlarms: Alarm[] = [
  {
    id: "alarm-01",
    deviceId: "dev-02",
    level: AlarmLevel.WARNING,
    message: "Stack temperature nearing limit",
    acknowledged: false,
    createdAt: "2026-05-11 10:31",
  },
];

const trendData = Array.from({ length: 12 }).map((_, index) => ({
  timestamp: `10:${index.toString().padStart(2, "0")}`,
  value: 52 + index * 2,
}));

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => ({ devices: sampleDevices, alarms: sampleAlarms }),
  });

  const alarmColumns = useMemo<ColumnDef<Alarm>[]>(
    () => [
      { header: "Device", accessorKey: "deviceId" },
      { header: "Level", accessorKey: "level" },
      { header: "Message", accessorKey: "message" },
      { header: "Time", accessorKey: "createdAt" },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <SkeletonStat count={4} />
        ) : (
          [
            { label: "Total Devices", value: data?.devices.length ?? 0 },
            {
              label: "Online Devices",
              value:
                data?.devices.filter((d) => d.status === DeviceStatus.ONLINE)
                  .length ?? 0,
            },
            { label: "Active Alarms", value: data?.alarms.length ?? 0 },
            { label: "Data Points/s", value: 480 },
          ].map((stat) => (
            <Card key={stat.label} header={stat.label}>
              <div className="text-2xl font-semibold text-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted">Live metric</div>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-primary">
            Critical Devices
          </h3>
          <div className="grid gap-3">
            {data?.devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
        <TrendChart data={trendData} label="Throughput Trend" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">
          Recent alarms
        </h3>
        <Table data={data?.alarms ?? []} columns={alarmColumns} />
      </div>
    </div>
  );
};

export default DashboardPage;
