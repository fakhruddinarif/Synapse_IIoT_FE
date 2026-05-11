import { useSignalRContext } from "./SignalRContext";

/** Hook to access SignalR connection helpers. */
export const useSignalR = () => {
  const {
    connection,
    connectionState,
    isConnected,
    startConnection,
    stopConnection,
  } = useSignalRContext();

  return {
    subscribe: connection.subscribe.bind(connection),
    invoke: connection.invoke.bind(connection),
    connectionState,
    isConnected,
    startConnection,
    stopConnection,
  };
};
