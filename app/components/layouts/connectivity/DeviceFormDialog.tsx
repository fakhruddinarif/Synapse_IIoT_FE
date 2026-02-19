import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type {
  Device,
  CreateDeviceDto,
  UpdateDeviceDto,
  Protocol,
  HttpConfig,
  MqttConfig,
} from "~/types/device";
import { useError } from "~/contexts/error.context";

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: Device | null;
  protocol: Protocol;
  onSubmit: (data: CreateDeviceDto | UpdateDeviceDto) => Promise<void>;
}

export function DeviceFormDialog({
  open,
  onOpenChange,
  device,
  protocol,
  onSubmit,
}: Readonly<DeviceFormDialogProps>) {
  const { showError } = useError();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isEnabled: false,
    pollingInterval: 1000,
  });

  const [httpConfig, setHttpConfig] = useState<HttpConfig>({
    url: "",
    method: "GET",
    headers: {},
  });

  const [mqttConfig, setMqttConfig] = useState<MqttConfig>({
    protocol: "mqtt",
    brokerUrl: "localhost",
    port: 1883,
    clientId: crypto.randomUUID(),
    topic: "#",
    useTls: false,
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        description: device.description || "",
        isEnabled: device.isEnabled,
        pollingInterval: device.pollingInterval,
      });

      if (device.protocol === 4) {
        // HTTP
        setHttpConfig(device.connectionConfig as HttpConfig);
      } else if (device.protocol === 2) {
        // MQTT
        setMqttConfig(device.connectionConfig as MqttConfig);
      }
    } else {
      // Reset form for new device
      setFormData({
        name: "",
        description: "",
        isEnabled: false,
        pollingInterval: 0,
      });
      setHttpConfig({
        url: "",
        method: "GET",
        headers: {},
      });
      setMqttConfig({
        protocol: "mqtt",
        brokerUrl: "localhost",
        port: 1883,
        clientId: crypto.randomUUID(),
        topic: "#",
        useTls: false,
      });
    }
  }, [device, protocol, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const connectionConfig = protocol === 4 ? httpConfig : mqttConfig;

      const data = device
        ? ({
            name: formData.name,
            description: formData.description,
            isEnabled: formData.isEnabled,
            pollingInterval: formData.pollingInterval,
            connectionConfig,
          } as UpdateDeviceDto)
        : ({
            name: formData.name,
            description: formData.description,
            isEnabled: formData.isEnabled,
            protocol,
            connectionConfig,
            pollingInterval: formData.pollingInterval,
          } as CreateDeviceDto);

      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError(
        error instanceof Error ? error.message : "An error occurred",
        "Form Error",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitButtonText = loading ? "Saving..." : device ? "Update" : "Create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {device ? "Update Device" : "Add New Device"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            {/* Device Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Device Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter device name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter device description"
              />
            </div>

            {/* Polling Interval */}
            <div className="space-y-2">
              <Label htmlFor="pollingInterval">
                Polling Interval (ms)<span className="text-red-500">*</span>
              </Label>
              <Input
                id="pollingInterval"
                type="number"
                value={formData.pollingInterval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pollingInterval: Number.parseInt(e.target.value),
                  })
                }
                placeholder="Enter polling interval"
                required
                min="100"
              />
            </div>

            {/* Is Enabled */}
            <div className="flex items-center space-x-2">
              <input
                id="isEnabled"
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, isEnabled: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="isEnabled" className="cursor-pointer">
                Enable Device
              </Label>
            </div>

            {/* HTTP Configuration */}
            {protocol === 4 && (
              <>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">HTTP Configuration</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">
                    URL<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="url"
                    value={httpConfig.url}
                    onChange={(e) =>
                      setHttpConfig({ ...httpConfig, url: e.target.value })
                    }
                    placeholder="Enter endpoint URL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">
                    Method<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="method"
                    value={httpConfig.method}
                    onChange={(e) =>
                      setHttpConfig({
                        ...httpConfig,
                        method: e.target.value as "GET" | "POST",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
              </>
            )}

            {/* MQTT Configuration */}
            {protocol === 2 && (
              <>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">MQTT Configuration</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerUrl">
                    Broker URL<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brokerUrl"
                    value={mqttConfig.brokerUrl}
                    onChange={(e) =>
                      setMqttConfig({
                        ...mqttConfig,
                        brokerUrl: e.target.value,
                      })
                    }
                    placeholder="localhost"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">
                    Port<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="port"
                    type="number"
                    value={mqttConfig.port}
                    onChange={(e) =>
                      setMqttConfig({
                        ...mqttConfig,
                        port: Number.parseInt(e.target.value),
                      })
                    }
                    placeholder="1883"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId">
                    Client ID<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clientId"
                    value={mqttConfig.clientId}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, clientId: e.target.value })
                    }
                    placeholder="client-id"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">
                    Topic<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    value={mqttConfig.topic}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, topic: e.target.value })
                    }
                    placeholder="#"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="useTls"
                    type="checkbox"
                    checked={mqttConfig.useTls}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, useTls: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="useTls" className="cursor-pointer">
                    Use TLS
                  </Label>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
