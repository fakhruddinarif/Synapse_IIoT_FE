import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUploadConfig } from "../../api/files";
import { listDevices } from "../../api/device";
import { listMasterTables } from "../../api/masterTables";
import { listStorageFlows } from "../../api/storageFlows";
import { listTags } from "../../api/tags";
import {
  createDeviceHubConnection,
  subscribeToDevice,
  type DeviceStreamEvent,
} from "../../api/signalr";
import type {
  DeviceResponseDto,
  FileUploadConfig,
  MasterTableDto,
  StorageFlowDto,
  TagResponseDto,
} from "../../@types/synapse";
import { useAppContext } from "../../providers/AppProvider";
import {
  ConnectionIcon,
  DeviceIcon,
  FlowIcon,
  RefreshIcon,
  SparkIcon,
  TableIcon,
  TagIcon,
} from "../../components/Icons";
import {
  Badge,
  Button,
  EmptyState,
  InlineLoader,
  MetricCard,
  MiniStat,
  Panel,
  SectionHeader,
  SuccessLine,
} from "../../components/Ui";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

const connectionTone: Record<
  ConnectionState,
  "success" | "danger" | "accent" | "warning"
> = {
  idle: "accent",
  connecting: "accent",
  connected: "success",
  error: "danger",
};

const connectionLabel: Record<ConnectionState, string> = {
  idle: "Idle",
  connecting: "Connecting",
  connected: "Connected",
  error: "Error",
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const useDashboardOverview = () => {
  const [devices, setDevices] = useState<DeviceResponseDto[]>([]);
  const [masterTables, setMasterTables] = useState<MasterTableDto[]>([]);
  const [storageFlows, setStorageFlows] = useState<StorageFlowDto[]>([]);
  const [tags, setTags] = useState<TagResponseDto[]>([]);
  const [uploadConfig, setUploadConfig] = useState<FileUploadConfig | null>(
    null,
  );
  const [streamEvents, setStreamEvents] = useState<DeviceStreamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("idle");

  const appendStreamEvent = (payload: DeviceStreamEvent) => {
    setStreamEvents((current) => {
      const nextEvents = [payload, ...current];
      return nextEvents.slice(0, 5);
    });
  };

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      setLoading(true);
      try {
        const [
          deviceResult,
          masterTableResult,
          storageFlowResult,
          tagResult,
          fileResult,
        ] = await Promise.all([
          listDevices({ page: 1, pageSize: 8 }),
          listMasterTables(),
          listStorageFlows(),
          listTags({ page: 1, pageSize: 8 }),
          getUploadConfig(),
        ]);

        if (cancelled) {
          return;
        }

        setDevices(deviceResult.data ?? []);
        setMasterTables(masterTableResult.data ?? []);
        setStorageFlows(storageFlowResult.data ?? []);
        setTags(tagResult.data ?? []);
        setUploadConfig(fileResult.data);
      } catch {
        if (!cancelled) {
          setDevices([]);
          setMasterTables([]);
          setStorageFlows([]);
          setTags([]);
          setUploadConfig(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!devices.length) {
      return;
    }

    const connection = createDeviceHubConnection();
    let mounted = true;
    const handleStreamEvent = (payload: DeviceStreamEvent) =>
      appendStreamEvent(payload);

    setConnectionState("connecting");
    connection.on("ReceiveDeviceData", handleStreamEvent);
    connection
      .start()
      .then(async () => {
        if (!mounted) {
          return;
        }

        setConnectionState("connected");

        for (const device of devices.slice(0, 4)) {
          await subscribeToDevice(connection, device.id);
        }
      })
      .catch(() => {
        if (mounted) {
          setConnectionState("error");
        }
      });

    return () => {
      mounted = false;
      connection.off("ReceiveDeviceData", handleStreamEvent);
      connection.stop();
    };
  }, [devices]);

  const metrics = useMemo(
    () => [
      {
        label: "Devices",
        value: String(devices.length),
        detail: "Perangkat yang dipantau",
        tone: "cyan" as const,
        icon: <DeviceIcon className="h-5 w-5" />,
      },
      {
        label: "Master tables",
        value: String(masterTables.length),
        detail: "Tabel penyimpanan data",
        tone: "violet" as const,
        icon: <TableIcon className="h-5 w-5" />,
      },
      {
        label: "Flows",
        value: String(storageFlows.length),
        detail: "Alur pengiriman data",
        tone: "emerald" as const,
        icon: <FlowIcon className="h-5 w-5" />,
      },
      {
        label: "Tags",
        value: String(tags.length),
        detail: "Penanda dan field",
        tone: "amber" as const,
        icon: <TagIcon className="h-5 w-5" />,
      },
    ],
    [devices.length, masterTables.length, storageFlows.length, tags.length],
  );

  const clearStreamEvents = () => setStreamEvents([]);

  return {
    devices,
    masterTables,
    storageFlows,
    tags,
    uploadConfig,
    streamEvents,
    loading,
    connectionState,
    metrics,
    clearStreamEvents,
  };
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoadingSession } = useAppContext();
  const {
    devices,
    masterTables,
    storageFlows,
    tags,
    uploadConfig,
    streamEvents,
    loading,
    connectionState,
    metrics,
    clearStreamEvents,
  } = useDashboardOverview();

  if (isLoadingSession || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <InlineLoader label="Loading Synapse workspace" />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <Panel className="p-0">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:items-end">
              <div className="space-y-4">
                <Badge tone="accent">
                  <SparkIcon className="h-3.5 w-3.5" />
                  Ringkasan sistem
                </Badge>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                    Status umum
                  </p>
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {user
                      ? `Halo, ${user.username}.`
                      : "Selamat datang di Synapse IIoT."}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Semua menu utama tersedia di sini: perangkat, alur data,
                    tabel penyimpanan, tag, dan file.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => navigate("/devices")}>
                    Buka perangkat
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/storage-flows")}
                  >
                    Lihat alur data
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>
                    Masuk
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl">
                <MiniStat
                  label="SignalR"
                  value={connectionLabel[connectionState]}
                />
                <MiniStat label="Session" value={user ? user.role : "Guest"} />
                <MiniStat
                  label="Upload max"
                  value={
                    uploadConfig
                      ? `${uploadConfig.maxFileSizeMB} MB`
                      : "Unknown"
                  }
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Status"
            title="Ringkasan cepat"
            description="Informasi singkat yang paling sering dibutuhkan saat membuka aplikasi."
          />
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Sesi aktif</span>
              <Badge tone={user ? "success" : "warning"}>
                {user ? "Ya" : "Belum"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Koneksi frontend</span>
              <Badge tone="success">Siap</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Data langsung</span>
              <Badge tone={connectionTone[connectionState]}>
                {connectionLabel[connectionState]}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Jenis file</span>
              <Badge tone="accent">
                {uploadConfig ? uploadConfig.allowedExtensions.length : 0}
              </Badge>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel>
          <SectionHeader
            eyebrow="Live stream"
            title="Data terbaru"
            description="Update terbaru dari perangkat akan muncul di bagian ini."
            actions={
              <Button variant="secondary" onClick={clearStreamEvents}>
                <RefreshIcon className="h-4 w-4" />
                Bersihkan
              </Button>
            }
          />

          <div className="mt-5 grid gap-3">
            {streamEvents.length ? (
              streamEvents.map((event) => (
                <div
                  key={`${event.deviceId}-${event.timestamp}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {event.deviceName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {event.protocol} • {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                    <Badge
                      tone={event.status === "success" ? "success" : "warning"}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-xs leading-6 text-cyan-100">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <EmptyState
                title="Belum ada data masuk"
                description="Saat perangkat mulai mengirim data, kartu ini akan terisi otomatis."
                icon={<ConnectionIcon className="h-7 w-7" />}
                action={
                  <SuccessLine>
                    Sistem siap menerima data saat perangkat aktif.
                  </SuccessLine>
                }
              />
            )}
          </div>
        </Panel>

        <div className="grid gap-5">
          <Panel>
            <SectionHeader
              eyebrow="Menu"
              title="Akses cepat"
              description="Pilih fitur yang paling sering dipakai."
            />
            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Masuk</p>
                <p className="mt-1 text-sm text-slate-300">
                  Login atau buat akun baru.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">
                  Perangkat & alur data
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Kelola perangkat dan aliran datanya.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">File</p>
                <p className="mt-1 text-sm text-slate-300">
                  Unggah dan hapus file dengan aman.
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Snapshot"
              title="Ringkasan data"
              description="Angka yang paling penting di satu tempat."
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Devices" value={String(devices.length)} />
              <MiniStat label="Tables" value={String(masterTables.length)} />
              <MiniStat label="Flows" value={String(storageFlows.length)} />
              <MiniStat label="Tags" value={String(tags.length)} />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
