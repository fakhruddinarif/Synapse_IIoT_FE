import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type {
  MasterTable,
  MasterTableField,
  CreateMasterTableField,
  UpdateMasterTableFieldDto,
} from "~/types/master-table";
import { DataTypeTableLabels } from "~/types/master-table";
import { masterTableService } from "~/services/master-table.service";

interface MasterTableFieldsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterTable: MasterTable | null;
}

export function MasterTableFieldsDialog({
  open,
  onOpenChange,
  masterTable,
}: MasterTableFieldsDialogProps) {
  const [fields, setFields] = useState<MasterTableField[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingField, setAddingField] = useState(false);
  const [newField, setNewField] = useState<CreateMasterTableField>({
    name: "",
    dataType: 0,
    isEnabled: true,
  });

  useEffect(() => {
    if (masterTable && open) {
      setFields(masterTable.fields);
    }
  }, [masterTable, open]);

  const handleAddField = async () => {
    if (!masterTable) return;
    setLoading(true);
    try {
      const response = await masterTableService.createField(
        masterTable.id,
        newField,
      );
      if (response.data) {
        setFields([...fields, response.data]);
        setNewField({ name: "", dataType: 0, isEnabled: true });
        setAddingField(false);
      }
    } catch (error) {
      console.error("Error adding field:", error);
      alert(error instanceof Error ? error.message : "Failed to add field");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (
    fieldId: string,
    data: UpdateMasterTableFieldDto,
  ) => {
    if (!masterTable) return;
    setLoading(true);
    try {
      const response = await masterTableService.updateField(
        masterTable.id,
        fieldId,
        data,
      );
      if (response.data) {
        setFields(fields.map((f) => (f.id === fieldId ? response.data! : f)));
      }
    } catch (error) {
      console.error("Error updating field:", error);
      alert(error instanceof Error ? error.message : "Failed to update field");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!masterTable) return;
    if (!confirm("Are you sure you want to delete this field?")) return;

    setLoading(true);
    try {
      await masterTableService.deleteField(masterTable.id, fieldId);
      setFields(fields.filter((f) => f.id !== fieldId));
    } catch (error) {
      console.error("Error deleting field:", error);
      alert(error instanceof Error ? error.message : "Failed to delete field");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (field: MasterTableField) => {
    await handleUpdateField(field.id, { isEnabled: !field.isEnabled });
  };

  if (!masterTable) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Fields - {masterTable.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add Field Button */}
          {!addingField && (
            <Button
              onClick={() => setAddingField(true)}
              className="gap-2"
              size="sm"
            >
              <i className="ri-add-line" /> Add Field
            </Button>
          )}

          {/* Add Field Form */}
          {addingField && (
            <div className="border rounded-lg p-4 bg-green-50 space-y-3">
              <h4 className="font-semibold text-sm">New Field</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4">
                  <Label>Field Name</Label>
                  <Input
                    value={newField.name}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                    placeholder="Field name"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Data Type</Label>
                  <select
                    value={newField.dataType}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        dataType: Number.parseInt(e.target.value),
                      })
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
                <div className="md:col-span-3 flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newField.isEnabled}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          isEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label className="mt-0!">Enabled</Label>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <Button
                    onClick={handleAddField}
                    disabled={loading || !newField.name}
                    size="sm"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setAddingField(false);
                      setNewField({ name: "", dataType: 0, isEnabled: true });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Fields List */}
          <div className="space-y-2">
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No fields defined yet
              </p>
            )}

            {fields.map((field) => (
              <div
                key={field.id}
                className="border rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-4">
                    <p className="font-medium">{field.name}</p>
                  </div>
                  <div className="md:col-span-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {DataTypeTableLabels[field.dataType]}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <button
                      onClick={() => handleToggleEnabled(field)}
                      disabled={loading}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        field.isEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {field.isEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button
                      onClick={() => handleDeleteField(field.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={loading}
                    >
                      <i className="ri-delete-bin-line" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
