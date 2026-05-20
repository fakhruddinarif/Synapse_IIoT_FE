import { useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  DashboardIcon,
  DeviceIcon,
  FileIcon,
  FlowIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
  TableIcon,
  TagIcon,
  UserIcon,
} from "./components/Icons";
import { Badge, Button } from "./components/Ui";
import AuthPage from "./pages/auth.tsx";
import DashboardPage from "./pages/dashboard/index.tsx";
import DevicesPage from "./pages/devices/index.tsx";
import FilesPage from "./pages/files.tsx";
import MasterTablesPage from "./pages/masterTables.tsx";
import StorageFlowsPage from "./pages/storageFlows.tsx";
import TagsPage from "./pages/tags.tsx";
import { useAppContext } from "./providers/AppProvider";

type NavItem = {
  label: string;
  to: string;
  hint: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    hint: "Overview dan telemetry",
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    label: "Devices",
    to: "/devices",
    hint: "Device registry dan test koneksi",
    icon: <DeviceIcon className="h-5 w-5" />,
  },
  {
    label: "Master Tables",
    to: "/master-tables",
    hint: "Skema penyimpanan data",
    icon: <TableIcon className="h-5 w-5" />,
  },
  {
    label: "Storage Flows",
    to: "/storage-flows",
    hint: "Mapping data ke tabel",
    icon: <FlowIcon className="h-5 w-5" />,
  },
  {
    label: "Tags",
    to: "/tags",
    hint: "Scaling dan address field",
    icon: <TagIcon className="h-5 w-5" />,
  },
  {
    label: "Files",
    to: "/files",
    hint: "Upload config dan assets",
    icon: <FileIcon className="h-5 w-5" />,
  },
];

const ShellLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAppContext();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-[float_14s_ease-in-out_infinite]" />
        <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-[float_18s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl animate-[float_16s_ease-in-out_infinite]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-screen-2xl gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-5">
        <aside
          className={`fixed inset-y-4 left-4 z-40 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.9)] backdrop-blur-2xl transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"} lg:sticky lg:top-5 lg:z-auto lg:h-[calc(100vh-2.5rem)] lg:w-auto lg:translate-x-0 lg:self-start lg:overflow-y-auto`}
          aria-label="Primary navigation"
        >
          <div className="flex items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 via-violet-400 to-emerald-400 text-slate-950 shadow-[0_14px_30px_-14px_rgba(34,211,238,0.7)]">
                <SparkIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                  Synapse
                </p>
                <h1 className="text-xl font-semibold tracking-tight">
                  IIoT Core
                </h1>
                <p className="text-sm text-slate-400">Modern control center</p>
              </div>
            </div>
            <Badge tone="success">Live</Badge>
          </div>

          <nav className="mt-4 grid gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-3xl border px-4 py-3 transition duration-200 ${
                    isActive
                      ? "border-cyan-400/30 bg-cyan-400/10 shadow-[0_16px_36px_-24px_rgba(34,211,238,0.8)]"
                      : "border-transparent bg-white/0 hover:border-white/10 hover:bg-white/5"
                  }`
                }
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-950/80 text-cyan-200 transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {item.hint}
                  </span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-linear-to-br from-cyan-400/10 via-slate-950 to-violet-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Session
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {user ? user.username : "Guest"}
                </p>
              </div>
              <UserIcon className="h-9 w-9 text-cyan-200" />
            </div>
            <p className="text-sm leading-6 text-slate-300">
              {user
                ? `Signed in as ${user.role}.`
                : "Login untuk membuka endpoint yang butuh cookie auth."}
            </p>
            <Button
              variant="secondary"
              onClick={async () => {
                if (user) {
                  await logout();
                  navigate("/auth");
                  return;
                }

                navigate("/auth");
              }}
              className="w-full"
            >
              <LogoutIcon className="h-4 w-4" />
              {user ? "Logout" : "Go to auth"}
            </Button>
          </div>
        </aside>

        {isSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <div className="relative min-w-0">
          <header className="sticky top-4 z-20 rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.9)] backdrop-blur-2xl lg:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 lg:hidden"
                  aria-label={
                    isSidebarOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  aria-expanded={isSidebarOpen}
                  onClick={() => setIsSidebarOpen((current) => !current)}
                >
                  <MenuIcon className="h-5 w-5" />
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    Industrial dashboard
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Synapse IIoT operations
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-center xl:justify-end">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <SearchIcon className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search endpoint, device, table, or file"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <Badge tone="success">CORS ready</Badge>
                  <Badge tone="accent">
                    <ShieldIcon className="h-3.5 w-3.5" />
                    Cookie auth
                  </Badge>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-cyan-400/20 hover:bg-white/8"
                  onClick={() => navigate("/auth")}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 via-violet-400 to-emerald-400 text-slate-950">
                    {user ? user.username.slice(0, 2).toUpperCase() : "GO"}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      {user ? user.username : "Sign in"}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {user ? user.role : "Open auth page"}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </header>

          <main className="mt-4 min-w-0 rounded-4xl border border-white/10 bg-slate-950/60 p-4 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.92)] backdrop-blur-2xl lg:p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route element={<ShellLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/master-tables" element={<MasterTablesPage />} />
      <Route path="/storage-flows" element={<StorageFlowsPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/files" element={<FilesPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);

export const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
