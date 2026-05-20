import { useEffect, useMemo, useState } from "react";
import {
  createMasterTable,
  createMasterTableField,
  deleteMasterTable,
  deleteMasterTableField,
  getMasterTableFields,
  listMasterTables,
  updateMasterTable,
  updateMasterTableField,
} from "../api/masterTables";
import type {
  DataTypeTable,
  MasterTableDto,
  MasterTableFieldDto,
} from "../@types/synapse";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Panel,
  Select,
  SectionHeader,
  TextArea,
  TextInput,
} from "../components/Ui";
import {
  CheckIcon,
  EditIcon,
  PlusIcon,
  RefreshIcon,
  TableIcon,
  TrashIcon,
} from "../components/Icons";

type TableEditorState = {
  name: string;
  tableName: string;
  description: string;
  isActive: boolean;
  fieldsText: string;
};

type FieldEditorState = {
  name: string;
  dataType: DataTypeTable;
  isEnabled: boolean;
};

const DEFAULT_TABLE_EDITOR: TableEditorState = {
  name: "",
  tableName: "",
  description: "",
  isActive: true,
  fieldsText: JSON.stringify(
    [
      { name: "temperature", dataType: "FLOAT", isEnabled: true },
      { name: "humidity", dataType: "FLOAT", isEnabled: true },
    ],
    null,
    2,
  ),
};

const DEFAULT_FIELD_EDITOR: FieldEditorState = {
  name: "",
  dataType: "FLOAT",
  isEnabled: true,
};

const parseFields = (value: string) =>
  JSON.parse(value) as Array<{
    name: string;
    dataType: DataTypeTable;
    isEnabled: boolean;
  }>;

const MasterTablesPage = () => {
  const [tables, setTables] = useState<MasterTableDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<MasterTableFieldDto[]>(
    [],
  );
  const [tableEditor, setTableEditor] =
    useState<TableEditorState>(DEFAULT_TABLE_EDITOR);
  const [fieldEditor, setFieldEditor] =
    useState<FieldEditorState>(DEFAULT_FIELD_EDITOR);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const response = await listMasterTables();
      setTables(response.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const selectedTable = tables.find((item) => item.id === selectedId);

    if (!selectedTable) {
      setTableEditor(DEFAULT_TABLE_EDITOR);
      setSelectedFields([]);
      setActiveFieldId(null);
      setFieldEditor(DEFAULT_FIELD_EDITOR);
      return;
    }

    setTableEditor({
      name: selectedTable.name,
      tableName: selectedTable.tableName,
      description: selectedTable.description ?? "",
      isActive: selectedTable.isActive,
      fieldsText: JSON.stringify(selectedTable.fields ?? [], null, 2),
    });

    void (async () => {
      const fields = await getMasterTableFields(selectedTable.id);
      setSelectedFields(fields.data ?? []);
      if (fields.data?.length) {
        const firstField = fields.data[0];
        setActiveFieldId(firstField.id);
        setFieldEditor({
          name: firstField.name,
          dataType: firstField.dataType,
          isEnabled: firstField.isEnabled,
        });
      }
    })();
  }, [selectedId, tables]);

  const selectedTable = useMemo(
    () => tables.find((item) => item.id === selectedId) ?? null,
    [selectedId, tables],
  );

  const saveTable = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: tableEditor.name,
        tableName: tableEditor.tableName,
        description: tableEditor.description || undefined,
        isActive: tableEditor.isActive,
        fields: parseFields(tableEditor.fieldsText),
      };

      if (selectedId) {
        await updateMasterTable(selectedId, payload);
        setMessage("Master table updated.");
      } else {
        await createMasterTable(payload);
        setMessage("Master table created.");
      }

      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save master table.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveField = async () => {
    if (!selectedId) {
      setMessage("Select a master table first.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (activeFieldId) {
        await updateMasterTableField(selectedId, activeFieldId, fieldEditor);
        setMessage("Field updated.");
      } else {
        await createMasterTableField(selectedId, fieldEditor);
        setMessage("Field added.");
      }

      const fields = await getMasterTableFields(selectedId);
      setSelectedFields(fields.data ?? []);
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save field.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTable = async (tableId: string) => {
    if (!globalThis.confirm("Delete this master table?")) {
      return;
    }

    await deleteMasterTable(tableId);
    setSelectedId(null);
    await reload();
  };

  const removeField = async (fieldId: string) => {
    if (!selectedId) {
      return;
    }

    if (!globalThis.confirm("Delete this field?")) {
      return;
    }

    await deleteMasterTableField(selectedId, fieldId);
    const fields = await getMasterTableFields(selectedId);
    setSelectedFields(fields.data ?? []);
    setActiveFieldId(null);
    setFieldEditor(DEFAULT_FIELD_EDITOR);
  };

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-300">
        Loading master tables...
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
      <Panel>
        <SectionHeader
          eyebrow="Schema builder"
          title="Master tables"
          description="CRUD master table dan field tersedia pada backend untuk memetakan hasil data device ke storage schema."
          actions={
            <>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                <PlusIcon className="h-4 w-4" />
                New table
              </Button>
              <Button variant="secondary" onClick={reload}>
                <RefreshIcon className="h-4 w-4" />
                Reload
              </Button>
            </>
          }
        />

        <div className="mt-5 grid gap-3">
          {tables.length ? (
            tables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedId(table.id)}
                className={`grid gap-3 rounded-3xl border p-4 text-left transition lg:grid-cols-[1.3fr,0.8fr,0.5fr,auto] lg:items-center ${selectedId === table.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {table.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {table.tableName}
                  </p>
                </div>
                <div className="text-sm text-slate-300">
                  {table.fields?.length ?? 0} fields
                </div>
                <div>
                  <Badge tone={table.isActive ? "success" : "warning"}>
                    {table.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(table.id);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      void removeTable(table.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </button>
            ))
          ) : (
            <EmptyState
              title="No master tables"
              description="Buat master table pertama untuk memetakan data device ke storage flow."
              icon={<TableIcon className="h-7 w-7" />}
            />
          )}
        </div>
        {message ? (
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-5">
        <Panel>
          <SectionHeader
            eyebrow="Table editor"
            title={
              selectedTable ? "Update master table" : "Create master table"
            }
            description="Field array dikirim sebagai JSON array ke backend."
          />
          <div className="mt-5 grid gap-4">
            <Field label="Name">
              <TextInput
                value={tableEditor.name}
                onChange={(event) =>
                  setTableEditor((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Table name">
              <TextInput
                value={tableEditor.tableName}
                onChange={(event) =>
                  setTableEditor((current) => ({
                    ...current,
                    tableName: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Description">
              <TextInput
                value={tableEditor.description}
                onChange={(event) =>
                  setTableEditor((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </Field>
            <Field
              label="Fields JSON"
              hint="Array dengan name, dataType, isEnabled."
            >
              <TextArea
                value={tableEditor.fieldsText}
                onChange={(event) =>
                  setTableEditor((current) => ({
                    ...current,
                    fieldsText: event.target.value,
                  }))
                }
              />
            </Field>
            <label className="inline-flex items-center gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={tableEditor.isActive}
                onChange={(event) =>
                  setTableEditor((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-400"
              />
              Active
            </label>
            <div className="flex gap-3">
              <Button onClick={() => void saveTable()} disabled={saving}>
                <CheckIcon className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : selectedTable
                    ? "Update table"
                    : "Create table"}
              </Button>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Reset
              </Button>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Field editor"
            title="Manage fields"
            description="Tambah, update, atau delete field untuk master table yang sedang dipilih."
          />
          <div className="mt-5 grid gap-4">
            <Field label="Field name">
              <TextInput
                value={fieldEditor.name}
                onChange={(event) =>
                  setFieldEditor((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Data type">
              <Select
                value={fieldEditor.dataType}
                onChange={(event) =>
                  setFieldEditor((current) => ({
                    ...current,
                    dataType: event.target.value as DataTypeTable,
                  }))
                }
              >
                <option value="STRING">STRING</option>
                <option value="INTEGER">INTEGER</option>
                <option value="FLOAT">FLOAT</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DATETIME">DATETIME</option>
              </Select>
            </Field>
            <label className="inline-flex items-center gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={fieldEditor.isEnabled}
                onChange={(event) =>
                  setFieldEditor((current) => ({
                    ...current,
                    isEnabled: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-400"
              />
              Enabled
            </label>
            <div className="flex gap-3">
              <Button
                onClick={() => void saveField()}
                disabled={!selectedId || saving}
              >
                <CheckIcon className="h-4 w-4" />
                {activeFieldId ? "Update field" : "Add field"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveFieldId(null);
                  setFieldEditor(DEFAULT_FIELD_EDITOR);
                }}
              >
                New field
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {selectedFields.length ? (
              selectedFields.map((field) => (
                <div
                  key={field.id}
                  className={`rounded-3xl border p-4 ${activeFieldId === field.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {field.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {field.dataType}
                      </p>
                    </div>
                    <Badge tone={field.isEnabled ? "success" : "warning"}>
                      {field.isEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setActiveFieldId(field.id);
                        setFieldEditor({
                          name: field.name,
                          dataType: field.dataType,
                          isEnabled: field.isEnabled,
                        });
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => void removeField(field.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No fields selected"
                description="Pilih master table terlebih dahulu atau buat field baru."
                icon={<TableIcon className="h-7 w-7" />}
              />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default MasterTablesPage;
