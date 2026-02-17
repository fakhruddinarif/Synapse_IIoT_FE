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

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: Device;
  protocol: Protocol;
  onSubmit: (data: CreateDeviceDto | UpdateDeviceDto) => Promise<void>;
}

export function DeviceFormDialog({
  open,
  onOpenChange,
  device,
  protocol,
  onSubmit,
}: DeviceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isEnabled: false,
    pollingInterval: 1000,
  });

  const [httpConfig, setHttpConfig] = useState<HttpConfig>({
    url: "http://localhost:5009/api/device/http-test",
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
        pollingInterval: protocol === 2 ? 1000 : 5000,
      });
      setHttpConfig({
        url: "http://localhost:5009/api/device/http-test",
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
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{device ? "Edit Device" : "Add New Device"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Device Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                maxLength={255}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isEnabled"
                checked={formData.isEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, isEnabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isEnabled" className="!mt-0">
                Enable Device
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pollingInterval">
                Polling Interval (ms) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pollingInterval"
                type="number"
                value={formData.pollingInterval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pollingInterval: Number.parseInt(e.target.value) || 1000,
                  })
                }
                required
                min={100}
              />
            </div>

            {/* HTTP Configuration */}
            {protocol === 4 && (
              <>
                <hr className="my-4" />
                <h3 className="font-semibold">HTTP Configuration</h3>

                <div className="space-y-2">
                  <Label htmlFor="url">
                    URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="url"
                    value={httpConfig.url}
                    onChange={(e) =>
                      setHttpConfig({ ...httpConfig, url: e.target.value })
                    }
                    required
                    placeholder="http://localhost:5009/api/device/http-test"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">HTTP Method</Label>
                  <select
                    id="method"
                    value={httpConfig.method}
                    onChange={(e) =>
                      setHttpConfig({ ...httpConfig, method: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </>
            )}

            {/* MQTT Configuration */}
            {protocol === 2 && (
              <>
                <hr className="my-4" />
                <h3 className="font-semibold">MQTT Configuration</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brokerUrl">
                      Broker URL <span className="text-red-500">*</span>
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
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="port">
                      Port <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="port"
                      type="number"
                      value={mqttConfig.port}
                      onChange={(e) =>
                        setMqttConfig({
                          ...mqttConfig,
                          port: Number.parseInt(e.target.value) || 1883,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={mqttConfig.clientId}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, clientId: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">
                    Topic <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    value={mqttConfig.topic}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, topic: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (Optional)</Label>
                    <Input
                      id="username"
                      value={mqttConfig.username || ""}
                      onChange={(e) =>
                        setMqttConfig({
                          ...mqttConfig,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password (Optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={mqttConfig.password || ""}
                      onChange={(e) =>
                        setMqttConfig({
                          ...mqttConfig,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useTls"
                    checked={mqttConfig.useTls}
                    onChange={(e) =>
                      setMqttConfig({ ...mqttConfig, useTls: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="useTls" className="!mt-0">
                    Use TLS/SSL
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
              {loading ? "Saving..." : device ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
