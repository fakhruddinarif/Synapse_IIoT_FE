import { useMemo, useState } from "react";
import { DeviceCard } from "@ui/iiot-widgets";
import { EmptyState, SearchInput, Select } from "@ui/components";
import type { Device } from "@core/domain/entities";
import { DeviceStatus, ProtocolType } from "@core/domain/enums";

const devices: Device[] = [
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
    name: "Cooling Pump",
    protocol: ProtocolType.MQTT,
    status: DeviceStatus.OFFLINE,
    lastSeenAt: "2026-05-11 10:20",
    tagCount: 12,
  },
];

const DevicesPage = () => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      devices.filter((device) =>
        device.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full md:w-64">
          <SearchInput
            placeholder="Search device"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select placeholder="Status" options={[]} />
        </div>
        <div className="w-full md:w-48">
          <Select placeholder="Protocol" options={[]} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No devices online"
          description="Sync your gateway or check connectivity to see devices here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
