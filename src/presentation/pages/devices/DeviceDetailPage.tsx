import { TagValueDisplay, StatusIndicator } from "@ui/iiot-widgets";
import { Card } from "@ui/components";
import { DeviceStatus } from "@core/domain/enums";

const DeviceDetailPage = () => (
  <div className="space-y-6">
    <Card header="Boiler Stack" footer="Last synchronized 2 minutes ago">
      <StatusIndicator
        status={DeviceStatus.WARNING}
        showLabel
        label="Warning"
      />
    </Card>

    <div className="grid gap-4 md:grid-cols-2">
      <Card header="Steam Pressure">
        <TagValueDisplay
          tagId="pressure"
          label="Pressure"
          value={124.5}
          unit="psi"
          quality="GOOD"
          trend="up"
        />
      </Card>
      <Card header="Exhaust Temperature">
        <TagValueDisplay
          tagId="temp"
          label="Temperature"
          value={402}
          unit="°C"
          quality="UNCERTAIN"
          trend="down"
        />
      </Card>
    </div>
  </div>
);

export default DeviceDetailPage;
