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
  MasterTable,
  CreateMasterTableDto,
  UpdateMasterTableDto,
  CreateMasterTableField,
} from "~/types/master-table";
import { DataTypeTableLabels } from "~/types/master-table";

interface MasterTableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterTable?: MasterTable;
  onSubmit: (
    data: CreateMasterTableDto | UpdateMasterTableDto,
  ) => Promise<void>;
}

export function MasterTableFormDialog({
  open,
  onOpenChange,
  masterTable,
  onSubmit,
}: MasterTableFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tableName: "",
    description: "",
    isActive: false,
  });
  const [fields, setFields] = useState<CreateMasterTableField[]>([]);

  useEffect(() => {
    if (masterTable) {
      setFormData({
        name: masterTable.name,
        tableName: masterTable.tableName,
        description: masterTable.description || "",
        isActive: masterTable.isActive,
      });
      setFields(
        masterTable.fields.map((f) => ({
          name: f.name,
          dataType: f.dataType,
          isEnabled: f.isEnabled,
        })),
      );
    } else {
      // Reset form for new table
      setFormData({
        name: "",
        tableName: "",
        description: "",
        isActive: false,
      });
      setFields([]);
    }
  }, [masterTable, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = masterTable
        ? ({
            name: formData.name,
            tableName: formData.tableName,
            description: formData.description,
            isActive: formData.isActive,
          } as UpdateMasterTableDto)
        : ({
            name: formData.name,
            tableName: formData.tableName,
            description: formData.description,
            isActive: formData.isActive,
            fields: fields,
          } as CreateMasterTableDto);

      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        name: "",
        dataType: 0, // STRING
        isEnabled: true,
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    field: keyof CreateMasterTableField,
    value: string | number | boolean,
  ) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFields(newFields);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {masterTable ? "Edit Master Table" : "Add New Master Table"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Table Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  maxLength={200}
                  placeholder="e.g., User Logs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableName">
                  Database Table Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tableName"
                  value={formData.tableName}
                  onChange={(e) =>
                    setFormData({ ...formData, tableName: e.target.value })
                  }
                  required
                  maxLength={255}
                  placeholder="e.g., user_logs"
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

            {/* Fields Section - Only for Create */}
            {!masterTable && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Fields</Label>
                  <Button
                    type="button"
                    onClick={handleAddField}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <i className="ri-add-line" /> Add Field
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No fields added yet. Click "Add Field" to create fields for
                    this table.
                  </p>
                )}

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="md:col-span-4">
                        <Input
                          placeholder="Field name"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldChange(index, "name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <select
                          value={field.dataType}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "dataType",
                              Number.parseInt(e.target.value),
                            )
                          }
                          className="w-full h-10 px-3 border rounded-md"
                        >
                          {Object.entries(DataTypeTableLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="md:col-span-3 flex items-center">
                        <input
                          type="checkbox"
                          checked={field.isEnabled}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "isEnabled",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 mr-2"
                        />
                        <span className="text-sm">Enabled</span>
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleRemoveField(index)}
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
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2" /> Saving...
                </>
              ) : masterTable ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
