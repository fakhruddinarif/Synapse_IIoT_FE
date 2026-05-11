import {
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";

export type ConnectionState =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Reconnecting"
  | "Error";

/** Manages a single SignalR HubConnection. */
export class SignalRClient {
  private readonly connection: HubConnection;
  private state: HubConnectionState = HubConnectionState.Disconnected;
  private onStateChange?: (state: HubConnectionState) => void;

  constructor(
    url: string,
    onStateChange?: (state: HubConnectionState) => void,
  ) {
    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(
        import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning,
      )
      .build();

    this.onStateChange = onStateChange;

    this.connection.onreconnecting(() => {
      this.updateState(HubConnectionState.Reconnecting);
    });

    this.connection.onreconnected(() => {
      this.updateState(HubConnectionState.Connected);
    });

    this.connection.onclose(() => {
      this.updateState(HubConnectionState.Disconnected);
    });
  }

  get hubConnection() {
    return this.connection;
  }

  get connectionState() {
    return this.state;
  }

  async start() {
    this.updateState(HubConnectionState.Connecting);
    await this.connection.start();
    this.updateState(HubConnectionState.Connected);
  }

  async stop() {
    await this.connection.stop();
    this.updateState(HubConnectionState.Disconnected);
  }

  subscribe(method: string, callback: (...args: unknown[]) => void) {
    this.connection.on(method, callback);
    return () => this.connection.off(method, callback);
  }

  async invoke(method: string, ...args: unknown[]) {
    await this.connection.invoke(method, ...args);
  }

  private updateState(state: HubConnectionState) {
    this.state = state;
    this.onStateChange?.(state);
  }
}
