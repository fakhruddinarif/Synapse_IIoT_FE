import type { ProtocolType } from "@core/domain/enums";

export interface ProtocolBadgeProps {
  protocol: ProtocolType;
}

/** Protocol label badge. */
export const ProtocolBadge = ({ protocol }: ProtocolBadgeProps) => (
  <span className="rounded-full border border-default bg-subtle px-2.5 py-1 text-xs text-secondary">
    {protocol.replace("_", "-")}
  </span>
);
