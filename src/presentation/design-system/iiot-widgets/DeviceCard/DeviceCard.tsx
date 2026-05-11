import type { Device } from "@core/domain/entities";
import { StatusIndicator } from "../StatusIndicator/StatusIndicator";
import { ProtocolBadge } from "../ProtocolBadge/ProtocolBadge";

export interface DeviceCardProps {
  device: Device;
}

/** Summary card for devices. */
export const DeviceCard = ({ device }: DeviceCardProps) => (
  <div className="rounded-lg border border-default bg-elevated p-4 transition hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-primary">{device.name}</h3>
        <div className="text-xs text-muted">
          {device.description ?? "Gateway device"}
        </div>
      </div>
      <ProtocolBadge protocol={device.protocol} />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <StatusIndicator status={device.status} showLabel label={device.status} />
      <div className="text-xs text-secondary">{device.tagCount} tags</div>
    </div>
    <div className="mt-2 text-xs text-muted">Last seen {device.lastSeenAt}</div>
  </div>
);
