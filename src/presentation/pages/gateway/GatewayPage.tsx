import { Card } from "@ui/components";
import { DataFlowIndicator } from "@ui/iiot-widgets";

const GatewayPage = () => (
  <div className="space-y-6">
    <Card header="Gateway Health" footer="Synapse Core v1.0.0">
      <div className="text-sm text-secondary">
        Realtime bus active • 12 devices linked
      </div>
      <div className="mt-3">
        <DataFlowIndicator label="SignalR streaming" />
      </div>
    </Card>
    <div className="grid gap-4 md:grid-cols-2">
      <Card header="Edge Storage">
        <div className="text-sm text-secondary">
          Buffering 8 minutes of telemetry.
        </div>
      </Card>
      <Card header="Protocol Drivers">
        <div className="text-sm text-secondary">
          MODBUS TCP, OPC-UA, MQTT online.
        </div>
      </Card>
    </div>
  </div>
);

export default GatewayPage;
