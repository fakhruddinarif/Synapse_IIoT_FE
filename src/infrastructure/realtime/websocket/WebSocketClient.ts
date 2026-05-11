/** Basic WebSocket client wrapper. */
export class WebSocketClient {
  private socket: WebSocket | null = null;

  connect(url: string, onMessage?: (event: MessageEvent) => void) {
    this.socket = new WebSocket(url);
    if (onMessage) {
      this.socket.addEventListener("message", onMessage);
    }
  }

  send(data: string) {
    this.socket?.send(data);
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}
