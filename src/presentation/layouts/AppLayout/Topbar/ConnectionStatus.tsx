import { HubConnectionState } from "@microsoft/signalr";
import { useGatewayStore } from "@app/store/useGatewayStore";

/** Displays current SignalR connection state. */
export const ConnectionStatus = () => {
  const state = useGatewayStore((store) => store.connectionState);

  const label =
    state === HubConnectionState.Connected
      ? "Connected"
      : state === HubConnectionState.Reconnecting
        ? "Reconnecting"
        : state === HubConnectionState.Connecting
          ? "Connecting"
          : "Disconnected";

  return (
    <span className="rounded-full border border-default bg-subtle px-3 py-1 text-xs text-secondary">
      {label}
    </span>
  );
};
