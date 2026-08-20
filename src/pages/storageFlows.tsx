import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  discoverFields,
  createStorageFlow,
  deleteStorageFlow,
  listStorageFlows,
  updateStorageFlow,
} from "../api/storageFlows";
import { listDevices } from "../api/device";
import { listMasterTables } from "../api/masterTables";
import type { MasterTableDto, StorageFlowDto } from "../@types/synapse";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  JsonPreviewCard,
  Panel,
  Select,
  SectionHeader,
  TextInput,
} from "../components/Ui";
import {
  CheckIcon,
  EditIcon,
  FlowIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
} from "../components/Icons";

type FlowEditorState = {
  name: string;
  description: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  deviceIds: string[];
  mappings: Array<{
    masterTableFieldId: string;
    sourcePath: string;
    tagId: string;
  }>;
};

const DEFAULT_FLOW_EDITOR: FlowEditorState = {
  name: "",
  description: "",
  isActive: true,
  storageInterval: 5000,
  masterTableId: "",
  deviceIds: [],
  mappings: [
    {
      masterTableFieldId: "",
      sourcePath: "$.data.temperature",
      tagId: "",
    },
  ],
};

const buildMappingsPreview = (mappings: FlowEditorState["mappings"]) =>
  mappings.map((mapping) => ({
    masterTableFieldId: mapping.masterTableFieldId,
    sourcePath: mapping.sourcePath,
    tagId: mapping.tagId || undefined,
  }));

const toggleDeviceId = (
  setEditor: Dispatch<SetStateAction<FlowEditorState>>,
  deviceId: string,
  isSelected: boolean,
) => {
  setEditor((current) => ({
    ...current,
    deviceIds: isSelected
      ? current.deviceIds.filter((id) => id !== deviceId)
      : [...current.deviceIds, deviceId],
  }));
};

const updateMappingRow = (
  setEditor: Dispatch<SetStateAction<FlowEditorState>>,
  index: number,
  field: keyof FlowEditorState["mappings"][number],
  value: string,
) => {
  setEditor((current) => ({
    ...current,
    mappings: current.mappings.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row,
    ),
  }));
};

const addMappingRow = (
  setEditor: Dispatch<SetStateAction<FlowEditorState>>,
) => {
  setEditor((current) => ({
    ...current,
    mappings: [
      ...current.mappings,
      { masterTableFieldId: "", sourcePath: "", tagId: "" },
    ],
  }));
};

const removeMappingRow = (
  setEditor: Dispatch<SetStateAction<FlowEditorState>>,
  index: number,
) => {
  setEditor((current) => ({
    ...current,
    mappings: current.mappings.filter((_, rowIndex) => rowIndex !== index),
  }));
};

const StorageFlowsPage = () => {
  const [flows, setFlows] = useState<StorageFlowDto[]>([]);
  const [devices, setDevices] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [tables, setTables] = useState<MasterTableDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<FlowEditorState>(DEFAULT_FLOW_EDITOR);
  const [discoverDeviceId, setDiscoverDeviceId] = useState("");
  const [discoveredFields, setDiscoveredFields] = useState<
    Array<{ path: string; type: string; sampleValue?: unknown }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [flowResult, deviceResult, tableResult] = await Promise.all([
        listStorageFlows(),
        listDevices({ page: 1, pageSize: 50 }),
        listMasterTables(),
      ]);
      setFlows(flowResult.data ?? []);
      setDevices(
        (deviceResult.data ?? []).map((device) => ({
          id: device.id,
          name: device.name,
        })),
      );
      setTables(tableResult.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const selectedFlow = flows.find((flow) => flow.id === selectedId);
    if (!selectedFlow) {
      setEditor(DEFAULT_FLOW_EDITOR);
      return;
    }

    setEditor({
      name: selectedFlow.name,
      description: selectedFlow.description ?? "",
      isActive: selectedFlow.isActive,
      storageInterval: selectedFlow.storageInterval,
      masterTableId: selectedFlow.masterTableId,
      deviceIds: selectedFlow.devices.map((device) => device.deviceId),
      mappings:
        selectedFlow.mappings?.map((mapping) => ({
          masterTableFieldId: mapping.masterTableFieldId,
          sourcePath: mapping.sourcePath,
          tagId: mapping.tagId ?? "",
        })) ?? DEFAULT_FLOW_EDITOR.mappings,
    });
  }, [flows, selectedId]);

  const selectedFlow = useMemo(
    () => flows.find((flow) => flow.id === selectedId) ?? null,
    [flows, selectedId],
  );

  const saveFlow = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: editor.name,
        description: editor.description || undefined,
        isActive: editor.isActive,
        storageInterval: editor.storageInterval,
        masterTableId: editor.masterTableId,
        deviceIds: editor.deviceIds,
        mappings: editor.mappings
          .filter((mapping) => mapping.masterTableFieldId && mapping.sourcePath)
          .map((mapping) => ({
            masterTableFieldId: mapping.masterTableFieldId,
            sourcePath: mapping.sourcePath,
            tagId: mapping.tagId || undefined,
          })),
      };

      if (selectedId) {
        await updateStorageFlow(selectedId, payload);
        setMessage("Storage flow updated.");
      } else {
        await createStorageFlow(payload);
        setMessage("Storage flow created.");
      }

      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save flow.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeFlow = async (flowId: string) => {
    if (!globalThis.confirm("Delete this storage flow?")) {
      return;
    }

    await deleteStorageFlow(flowId);
    setSelectedId(null);
    await reload();
  };

  const runDiscovery = async () => {
    if (!discoverDeviceId) {
      return;
    }

    const response = await discoverFields(discoverDeviceId);
    setDiscoveredFields(response.data ?? []);
  };

  let saveFlowLabel = "Simpan alur";
  if (selectedFlow) {
    saveFlowLabel = "Simpan perubahan";
  }
  if (saving) {
    saveFlowLabel = "Saving...";
  }

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-300">
        Loading storage flows...
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
      <Panel>
        <SectionHeader
          eyebrow="Mapping engine"
          title="Storage flows"
          description="Kelola alur yang menghubungkan perangkat ke tabel penyimpanan dengan cara yang mudah dipahami."
          actions={
            <>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                <PlusIcon className="h-4 w-4" />
                New flow
              </Button>
              <Button variant="secondary" onClick={reload}>
                <RefreshIcon className="h-4 w-4" />
                Reload
              </Button>
            </>
          }
        />

        <div className="mt-5 grid gap-3">
          {flows.length ? (
            flows.map((flow) => (
              <button
                key={flow.id}
                type="button"
                onClick={() => setSelectedId(flow.id)}
                className={`grid gap-3 rounded-3xl border p-4 text-left transition ${selectedId === flow.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {flow.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {flow.masterTableName}
                    </p>
                  </div>
                  <Badge tone={flow.isActive ? "success" : "warning"}>
                    {flow.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-slate-300">
                  {flow.devices.length} devices • {flow.mappings.length}{" "}
                  pemetaan
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(flow.id);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      void removeFlow(flow.id);
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
              title="No storage flows"
              description="Buat flow untuk menghubungkan data device ke master table."
              icon={<FlowIcon className="h-7 w-7" />}
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
            eyebrow="Flow editor"
            title={selectedFlow ? "Ubah alur" : "Buat alur"}
            description="Pilih perangkat, atur pemetaan, lalu lihat preview JSON otomatis."
          />
          <div className="mt-5 grid gap-4">
            <Field label="Name">
              <TextInput
                value={editor.name}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Description">
              <TextInput
                value={editor.description}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Jarak simpan">
                <TextInput
                  type="number"
                  value={editor.storageInterval}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      storageInterval: Number(event.target.value),
                    }))
                  }
                />
              </Field>
              <Field label="Tabel tujuan">
                <Select
                  value={editor.masterTableId}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      masterTableId: event.target.value,
                    }))
                  }
                >
                  <option value="">Pilih tabel</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-medium text-slate-200">Perangkat</p>
                <p className="mt-1 text-xs text-slate-400">
                  Pilih perangkat yang akan ikut alur ini.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {devices.map((device) => {
                  const isSelected = editor.deviceIds.includes(device.id);

                  return (
                    <button
                      key={device.id}
                      type="button"
                      onClick={() =>
                        toggleDeviceId(setEditor, device.id, isSelected)
                      }
                      className={`rounded-2xl border px-4 py-3 text-left transition ${isSelected ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-slate-950/60 hover:bg-white/5"}`}
                    >
                      <p className="text-sm font-semibold text-white">
                        {device.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {isSelected ? "Dipilih" : "Ketuk untuk memilih"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Pemetaan field
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Setiap baris menunjukkan data perangkat disimpan ke field
                    mana.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addMappingRow(setEditor)}
                >
                  Tambah baris
                </Button>
              </div>
              <div className="grid gap-3">
                {editor.mappings.map((mapping, index) => (
                  <div
                    key={`${index}-${mapping.masterTableFieldId}`}
                    className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/55 p-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end"
                  >
                    <Field label={`Field ${index + 1}`}>
                      <Select
                        value={mapping.masterTableFieldId}
                        onChange={(event) =>
                          updateMappingRow(
                            setEditor,
                            index,
                            "masterTableFieldId",
                            event.target.value,
                          )
                        }
                      >
                        <option value="">Pilih field</option>
                        {tables.map((table) =>
                          table.fields?.map((field) => (
                            <option
                              key={`${table.id}-${field.id}`}
                              value={field.id}
                            >
                              {table.name} · {field.name}
                            </option>
                          )),
                        )}
                      </Select>
                    </Field>
                    <Field label="Source path">
                      <TextInput
                        value={mapping.sourcePath}
                        onChange={(event) =>
                          updateMappingRow(
                            setEditor,
                            index,
                            "sourcePath",
                            event.target.value,
                          )
                        }
                        placeholder="$.data.temperature"
                      />
                    </Field>
                    <Field label="Tag id">
                      <TextInput
                        value={mapping.tagId}
                        onChange={(event) =>
                          updateMappingRow(
                            setEditor,
                            index,
                            "tagId",
                            event.target.value,
                          )
                        }
                        placeholder="Optional tag id"
                      />
                    </Field>
                    <div className="flex xl:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeMappingRow(setEditor, index)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <JsonPreviewCard
                value={{
                  deviceIds: editor.deviceIds,
                  mappings: buildMappingsPreview(editor.mappings),
                }}
                title="Preview JSON"
              />
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <div>
                <p className="font-medium text-white">Aktif</p>
                <p className="text-xs text-slate-400">
                  Alur ini akan ikut berjalan saat perangkat mengirim data.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditor((current) => ({
                    ...current,
                    isActive: !current.isActive,
                  }))
                }
                className={`inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold transition ${editor.isActive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-slate-950/70 text-slate-300"}`}
              >
                {editor.isActive ? "Ya" : "Tidak"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => void saveFlow()} disabled={saving}>
                <CheckIcon className="h-4 w-4" />
                {saveFlowLabel}
              </Button>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Reset
              </Button>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Temukan field"
            title="Baca field dari perangkat"
            description="Gunakan ini untuk melihat field yang tersedia dari perangkat sebelum dipetakan."
          />
          <div className="mt-5 grid gap-4">
            <Field label="Perangkat">
              <Select
                value={discoverDeviceId}
                onChange={(event) => setDiscoverDeviceId(event.target.value)}
              >
                <option value="">Pilih perangkat</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex gap-3">
              <Button onClick={() => void runDiscovery()}>
                <FlowIcon className="h-4 w-4" />
                Discover
              </Button>
            </div>
            <div className="grid gap-3">
              {discoveredFields.length ? (
                discoveredFields.map((field) => (
                  <div
                    key={field.path}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {field.path}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{field.type}</p>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No discovered fields"
                  description="Pilih device lalu jalankan discovery."
                  icon={<FlowIcon className="h-7 w-7" />}
                />
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default StorageFlowsPage;
