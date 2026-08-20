import { useEffect, useMemo, useState } from "react";
import {
  createDevice,
  deleteDevice,
  listDevices,
  testHttpDeviceConnection,
  updateDevice,
} from "../../api/device";
import type { Protocol, DeviceResponseDto } from "../../@types/synapse";
import { useAppContext } from "../../providers/AppProvider";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  JsonPreviewCard,
  KeyValueEditor,
  Panel,
  Select,
  SectionHeader,
  TextInput,
} from "../../components/Ui";
import {
  CheckIcon,
  DeviceIcon,
  EditIcon,
  PlayIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  TrashIcon,
} from "../../components/Icons";

type DeviceEditorState = {
  name: string;
  description: string;
  protocol: Protocol;
  isEnabled: boolean;
  pollingInterval: number;
  connectionUrl: string;
  connectionMethod: string;
  timeoutMs: number;
  headers: Array<{ key: string; value: string }>;
};

type ConnectionConfig = {
  url?: string;
  method?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

const DEFAULT_EDITOR: DeviceEditorState = {
  name: "",
  description: "",
  protocol: "HTTP",
  isEnabled: true,
  pollingInterval: 5000,
  connectionUrl: "http://192.168.1.100/api/sensor",
  connectionMethod: "GET",
  timeoutMs: 5000,
  headers: [{ key: "Authorization", value: "Bearer token" }],
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const buildConnectionConfig = (
  editor: DeviceEditorState,
): ConnectionConfig => ({
  url: editor.connectionUrl || undefined,
  method: editor.connectionMethod || undefined,
  timeoutMs: editor.timeoutMs,
  headers: editor.headers.reduce<Record<string, string>>(
    (accumulator, item) => {
      if (item.key.trim()) {
        accumulator[item.key.trim()] = item.value;
      }

      return accumulator;
    },
    {},
  ),
});

const normalizeHeaders = (config: ConnectionConfig | null | undefined) => {
  const entries = Object.entries(config?.headers ?? {});

  if (!entries.length) {
    return [{ key: "Authorization", value: "Bearer token" }];
  }

  return entries.map(([key, value]) => ({ key, value }));
};

const readStringConfig = (
  config: Record<string, unknown>,
  key: string,
  fallback = "",
) => (typeof config[key] === "string" ? config[key] : fallback);

const readNumberConfig = (
  config: Record<string, unknown>,
  key: string,
  fallback: number,
) => (typeof config[key] === "number" ? config[key] : fallback);

const DevicesPage = () => {
  const { isLoadingSession } = useAppContext();
  const [devices, setDevices] = useState<DeviceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<DeviceEditorState>(DEFAULT_EDITOR);
  const [message, setMessage] = useState<string | null>(null);
  const [connectionResult, setConnectionResult] = useState<string | null>(null);
  const [testUrl, setTestUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1",
  );
  const [testMethod, setTestMethod] = useState("GET");

  const reload = async () => {
    setLoading(true);
    try {
      const response = await listDevices({ page: 1, pageSize: 50 });
      setDevices(response.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setEditor(DEFAULT_EDITOR);
      return;
    }

    const selectedDevice = devices.find((device) => device.id === selectedId);
    if (!selectedDevice) {
      return;
    }

    setEditor({
      name: selectedDevice.name,
      description: selectedDevice.description ?? "",
      protocol: selectedDevice.protocol,
      isEnabled: selectedDevice.isEnabled,
      pollingInterval: selectedDevice.pollingInterval,
      connectionUrl: readStringConfig(selectedDevice.connectionConfig, "url"),
      connectionMethod:
        readStringConfig(selectedDevice.connectionConfig, "method", "GET") ||
        "GET",
      timeoutMs: readNumberConfig(
        selectedDevice.connectionConfig,
        "timeoutMs",
        5000,
      ),
      headers: normalizeHeaders(selectedDevice.connectionConfig),
    });
  }, [devices, selectedId]);

  const filteredDevices = useMemo(
    () =>
      devices.filter((device) => {
        const haystack =
          `${device.name} ${device.description ?? ""} ${device.protocol}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [devices, search],
  );

  const saveDevice = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: editor.name,
        description: editor.description || undefined,
        isEnabled: editor.isEnabled,
        protocol: editor.protocol,
        pollingInterval: editor.pollingInterval,
        connectionConfig: buildConnectionConfig(editor),
      };

      if (selectedId) {
        await updateDevice(selectedId, payload);
        setMessage("Device updated successfully.");
      } else {
        await createDevice(payload);
        setMessage("Device created successfully.");
      }

      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Device save failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeDevice = async (deviceId: string) => {
    if (!globalThis.confirm("Delete this device?")) {
      return;
    }

    await deleteDevice(deviceId);
    if (selectedId === deviceId) {
      setSelectedId(null);
    }
    await reload();
  };

  const testConnection = async () => {
    setTesting(true);
    setConnectionResult(null);

    try {
      const response = await testHttpDeviceConnection({
        url: testUrl,
        method: testMethod,
      });
      setConnectionResult(response.message ?? "Test succeeded");
    } catch (error) {
      setConnectionResult(
        error instanceof Error ? error.message : "Test failed",
      );
    } finally {
      setTesting(false);
    }
  };

  let saveButtonLabel = "Create device";
  if (selectedId) {
    saveButtonLabel = "Update device";
  }
  if (saving) {
    saveButtonLabel = "Saving...";
  }

  if (isLoadingSession || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-slate-300">
        Loading devices...
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel>
        <SectionHeader
          eyebrow="Device registry"
          title="Manage devices"
          description="CRUD device dan test koneksi HTTP disediakan langsung oleh backend."
          actions={
            <>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                <PlusIcon className="h-4 w-4" />
                New device
              </Button>
              <Button variant="secondary" onClick={reload}>
                <RefreshIcon className="h-4 w-4" />
                Reload
              </Button>
            </>
          }
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <SearchIcon className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search devices"
            />
          </label>
          <Badge tone="accent">
            <ShieldIcon className="h-3.5 w-3.5" />
            Cookie required for protected actions
          </Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1.4fr,0.8fr,0.6fr,0.7fr,0.7fr,auto] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
            <span>Name</span>
            <span>Protocol</span>
            <span>Status</span>
            <span>Interval</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>

          <div className="grid gap-3 p-3">
            {filteredDevices.length ? (
              filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className={`grid gap-3 rounded-3xl border p-4 transition lg:grid-cols-[1.4fr,0.8fr,0.6fr,0.7fr,0.7fr,auto] lg:items-center ${selectedId === device.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {device.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {device.description ?? "No description"}
                    </p>
                  </div>
                  <div className="text-sm text-slate-200">
                    {device.protocol}
                  </div>
                  <div>
                    <Badge tone={device.isEnabled ? "success" : "warning"}>
                      {device.isEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-200">
                    {device.pollingInterval} ms
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatDate(device.updatedAt ?? device.createdAt)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedId(device.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => void removeDevice(device.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No devices found"
                description="Tambahkan device pertama untuk mulai menguji koneksi dan real-time streaming."
                icon={<DeviceIcon className="h-7 w-7" />}
              />
            )}
          </div>
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
            eyebrow="Editor"
            title={selectedId ? "Update device" : "Create device"}
            description="Payload connectionConfig dikirim sebagai JSON sesuai kebutuhan backend."
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
                placeholder="Sensor-001"
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
                placeholder="Temperature sensor"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Protocol">
                <Select
                  value={editor.protocol}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      protocol: event.target.value as Protocol,
                    }))
                  }
                >
                  <option value="HTTP">HTTP</option>
                  <option value="MQTT">MQTT</option>
                  <option value="MODBUS_TCP">MODBUS_TCP</option>
                  <option value="MODBUS_RTU">MODBUS_RTU</option>
                  <option value="OPC_UA">OPC_UA</option>
                </Select>
              </Field>
              <Field label="Polling interval">
                <TextInput
                  type="number"
                  value={editor.pollingInterval}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      pollingInterval: Number(event.target.value),
                    }))
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Connection details
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Isi field yang umum dipahami dulu, lalu preview JSON akan
                  terbentuk otomatis.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Endpoint URL">
                  <TextInput
                    value={editor.connectionUrl}
                    onChange={(event) =>
                      setEditor((current) => ({
                        ...current,
                        connectionUrl: event.target.value,
                      }))
                    }
                    placeholder="http://192.168.1.100/api/sensor"
                  />
                </Field>
                <Field label="Method">
                  <Select
                    value={editor.connectionMethod}
                    onChange={(event) =>
                      setEditor((current) => ({
                        ...current,
                        connectionMethod: event.target.value,
                      }))
                    }
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </Select>
                </Field>
              </div>
              <Field label="Timeout (ms)">
                <TextInput
                  type="number"
                  value={editor.timeoutMs}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      timeoutMs: Number(event.target.value),
                    }))
                  }
                />
              </Field>
              <Field label="Headers">
                <KeyValueEditor
                  items={editor.headers}
                  onChange={(items) =>
                    setEditor((current) => ({
                      ...current,
                      headers: items,
                    }))
                  }
                  emptyLabel="Belum ada header. Tambahkan jika endpoint butuh autentikasi atau metadata tambahan."
                  addLabel="Add header"
                  keyPlaceholder="Header name"
                  valuePlaceholder="Header value"
                />
              </Field>
              <JsonPreviewCard
                value={buildConnectionConfig(editor)}
                title="Preview JSON"
              />
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <div>
                <p className="font-medium text-white">Aktif</p>
                <p className="text-xs text-slate-400">
                  Perangkat akan diproses oleh backend.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditor((current) => ({
                    ...current,
                    isEnabled: !current.isEnabled,
                  }))
                }
                className={`inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold transition ${editor.isEnabled ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-slate-950/70 text-slate-300"}`}
              >
                {editor.isEnabled ? "Ya" : "Tidak"}
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void saveDevice()} disabled={saving}>
                <CheckIcon className="h-4 w-4" />
                {saveButtonLabel}
              </Button>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Reset
              </Button>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Connection test"
            title="HTTP test endpoint"
            description="Gunakan endpoint test-http-connection untuk memvalidasi konfigurasi device sebelum disimpan."
          />
          <div className="mt-5 grid gap-4">
            <Field label="Test URL">
              <TextInput
                value={testUrl}
                onChange={(event) => setTestUrl(event.target.value)}
              />
            </Field>
            <Field label="Method">
              <Select
                value={testMethod}
                onChange={(event) => setTestMethod(event.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </Select>
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void testConnection()} disabled={testing}>
                <PlayIcon className="h-4 w-4" />
                {testing ? "Testing..." : "Run test"}
              </Button>
            </div>
            {connectionResult ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {connectionResult}
              </div>
            ) : null}
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Flow</p>
              <p className="mt-2 leading-6">
                Input URL, method, dan optional header/body untuk mengecek
                endpoint eksternal sebelum masuk ke device registry.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default DevicesPage;
