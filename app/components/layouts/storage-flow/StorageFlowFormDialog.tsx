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
  StorageFlow,
  CreateStorageFlowDto,
  UpdateStorageFlowDto,
  StorageFlowMapping,
} from "~/types/storage-flow";
import type { Device } from "~/types/device";
import type { MasterTable } from "~/types/master-table";
import { DataTypeTableLabels } from "~/types/master-table";
import { deviceService } from "~/services/device.service";
import { masterTableService } from "~/services/master-table.service";
import { useError } from "~/contexts/error.context";

interface StorageFlowFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storageFlow?: StorageFlow;
  onSubmit: (
    data: CreateStorageFlowDto | UpdateStorageFlowDto,
  ) => Promise<void>;
}

export function StorageFlowFormDialog({
  open,
  onOpenChange,
  storageFlow,
  onSubmit,
}: Readonly<StorageFlowFormDialogProps>) {
  const { showError } = useError();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [masterTables, setMasterTables] = useState<MasterTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<MasterTable | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deviceIds: [] as string[],
    masterTableId: "",
    storageInterval: 10000,
    isActive: true,
  });
  const [mappings, setMappings] = useState<
    (StorageFlowMapping & { id?: string })[]
  >([]);

  // Fetch devices and master tables
  useEffect(() => {
    if (open) {
      fetchDevices();
      fetchMasterTables();
    }
  }, [open]);

  useEffect(() => {
    if (storageFlow) {
      setFormData({
        name: storageFlow.name,
        description: storageFlow.description || "",
        deviceIds: storageFlow.devices.map((d) => d.deviceId),
        masterTableId: storageFlow.masterTableId,
        storageInterval: storageFlow.storageInterval,
        isActive: storageFlow.isActive,
      });
      setMappings(
        storageFlow.mappings.map((m, idx) => ({
          ...m,
          id: `mapping-${idx}-${Date.now()}`,
        })),
      );
    } else {
      setFormData({
        name: "",
        description: "",
        deviceIds: [],
        masterTableId: "",
        storageInterval: 10000,
        isActive: true,
      });
      setMappings([]);
    }
  }, [storageFlow, open]);

  const fetchDevices = async () => {
    try {
      const response = await deviceService.getAll({ pageSize: 100 });
      if (response.data) {
        setDevices(response.data);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchMasterTables = async () => {
    try {
      const response = await masterTableService.getAll({ pageSize: 100 });
      if (response.data) {
        setMasterTables(response.data);
      }
    } catch (error) {
      console.error("Error fetching master tables:", error);
    }
  };

  // Fetch selected master table with fields
  const fetchMasterTableDetail = async (tableId: string) => {
    try {
      const response = await masterTableService.getById(tableId);
      if (response.data) {
        setSelectedTable(response.data);
      }
    } catch (error) {
      console.error("Error fetching master table detail:", error);
    }
  };

  // Fetch master table detail when masterTableId changes
  useEffect(() => {
    if (formData.masterTableId) {
      fetchMasterTableDetail(formData.masterTableId);
    } else {
      setSelectedTable(null);
    }
  }, [formData.masterTableId]);

  // Debug: log selectedTable when it changes
  useEffect(() => {
    if (selectedTable) {
      console.log("Selected table:", selectedTable);
      console.log("Fields available:", selectedTable.fields);
    }
  }, [selectedTable]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      // Remove temporary id and masterTableFieldName from mappings before submitting
      const cleanMappings = mappings.map(
        ({ id, masterTableFieldName, ...rest }) => rest,
      );

      if (storageFlow) {
        data = {
          name: formData.name,
          description: formData.description || undefined,
          deviceIds: formData.deviceIds,
          masterTableId: formData.masterTableId,
          storageInterval: formData.storageInterval,
          isActive: formData.isActive,
          mappings: cleanMappings,
        } as UpdateStorageFlowDto;
      } else {
        data = {
          name: formData.name,
          description: formData.description || undefined,
          deviceIds: formData.deviceIds,
          masterTableId: formData.masterTableId,
          storageInterval: formData.storageInterval,
          isActive: formData.isActive,
          mappings: cleanMappings,
        } as CreateStorageFlowDto;
      }

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

  const handleAddMapping = () => {
    setMappings([
      ...mappings,
      {
        id: `mapping-${Date.now()}-${Math.random()}`,
        masterTableFieldId: "",
        masterTableFieldName: "",
        sourcePath: "",
      },
    ]);
  };

  const handleRemoveMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleMappingChange = (
    index: number,
    field: keyof StorageFlowMapping | "masterTableFieldName",
    value: string,
  ) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  const getButtonText = () => {
    if (loading) return "Saving...";
    return storageFlow ? "Update" : "Create";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {storageFlow ? "Edit Storage Flow" : "Add New Storage Flow"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 py-4 px-1">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Storage flow name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageInterval">
                    Storage Interval (ms){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="storageInterval"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.storageInterval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storageInterval: Number.parseInt(e.target.value),
                      })
                    }
                    placeholder="10000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="devices">
                    Devices <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {devices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No devices available
                      </p>
                    ) : (
                      devices.map((device) => (
                        <label
                          key={device.id}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.deviceIds.includes(device.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  deviceIds: [...formData.deviceIds, device.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  deviceIds: formData.deviceIds.filter(
                                    (id) => id !== device.id,
                                  ),
                                });
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{device.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                  {formData.deviceIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formData.deviceIds.length} device(s) selected
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="masterTableId">
                    Master Table <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="masterTableId"
                    value={formData.masterTableId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        masterTableId: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select a master table</option>
                    {masterTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="mt-0!">
                  Active
                </Label>
              </div>
            </div>

            {/* Mappings Section */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-base font-semibold">
                    Data Mappings
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Map device data source paths to table fields
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddMapping}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={!formData.masterTableId}
                >
                  <i className="ri-add-line" /> Add Mapping
                </Button>
              </div>

              {!formData.masterTableId && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                  Please select a master table first to configure mappings
                </p>
              )}

              {mappings.length === 0 && formData.masterTableId && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No mappings added yet. Click "Add Mapping" to create mappings.
                </p>
              )}

              <div className="space-y-2">
                {mappings.map((mapping, index) => (
                  <div
                    key={mapping.id || `mapping-${index}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="md:col-span-5">
                      <Label className="text-xs">Source Path</Label>
                      <Input
                        placeholder="e.g., $.data.temperature or Temp_Sensor_1"
                        value={mapping.sourcePath}
                        onChange={(e) =>
                          handleMappingChange(
                            index,
                            "sourcePath",
                            e.target.value,
                          )
                        }
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        JSONPath for HTTP/MQTT or Tag name for MODBUS/OPC UA
                      </p>
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-2">
                      <i className="ri-arrow-right-line text-xl text-gray-400" />
                    </div>
                    <div className="md:col-span-5">
                      <Label className="text-xs">Master Table Field</Label>
                      <select
                        value={mapping.masterTableFieldId || ""}
                        onChange={(e) => {
                          const fieldId = e.target.value;
                          console.log("Field selected:", fieldId);
                          console.log("Current mapping:", mapping);
                          console.log(
                            "Available fields:",
                            selectedTable?.fields,
                          );

                          const selectedField = selectedTable?.fields.find(
                            (f) => f.id === fieldId,
                          );

                          const newMappings = [...mappings];
                          newMappings[index] = {
                            ...newMappings[index],
                            masterTableFieldId: fieldId,
                            masterTableFieldName: selectedField?.name || "",
                          };
                          setMappings(newMappings);

                          console.log("Updated mappings:", newMappings);
                        }}
                        className="w-full h-10 px-3 border rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                        disabled={
                          !selectedTable || !selectedTable.fields?.length
                        }
                      >
                        <option value="">Select field</option>
                        {selectedTable?.fields
                          ?.filter((f) => f.isEnabled)
                          .map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name} (
                              {DataTypeTableLabels[field.dataType]})
                            </option>
                          ))}
                      </select>
                      {!selectedTable && (
                        <p className="text-xs text-amber-600 mt-1">
                          Loading table fields...
                        </p>
                      )}
                      {selectedTable && !selectedTable.fields?.length && (
                        <p className="text-xs text-red-600 mt-1">
                          No enabled fields in selected table
                        </p>
                      )}
                      {selectedTable && selectedTable.fields?.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {
                            selectedTable.fields.filter((f) => f.isEnabled)
                              .length
                          }{" "}
                          fields available
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-1 flex items-end justify-end pb-2">
                      <Button
                        type="button"
                        onClick={() => handleRemoveMapping(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <i className="ri-delete-bin-line" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                mappings.length === 0 ||
                formData.deviceIds.length === 0 ||
                !formData.name ||
                !formData.masterTableId
              }
            >
              {loading && <i className="ri-loader-4-line animate-spin mr-2" />}
              {getButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
