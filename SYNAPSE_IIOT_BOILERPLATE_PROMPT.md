# 🧠 Synapse IIoT — Boilerplate Generation Prompt

> **Target Executor**: GPT-5.2 Codex  
> **Project**: Synapse IIoT — Industrial IoT Gateway & Mini-SCADA Platform  
> **Stack**: React 18 + TypeScript + Tailwind CSS v4 + React Router v7  
> **Architecture**: Clean Architecture (Domain-Driven)

---

## 📋 EXECUTIVE CONTEXT

You are generating a **complete, production-grade frontend boilerplate** for **Synapse IIoT** — a modern Industrial IoT Gateway and Mini-SCADA platform. The platform bridges the gap between factory hardware (OT Layer: MODBUS RTU/TCP, OPC-UA, MQTT, HTTP) and data management systems (IT Layer: REST API, SignalR) in real-time, securely, and flexibly.

The **backend is already built** using ASP.NET Core (.NET 10) with Clean Architecture and is the source of truth for all API contracts. The frontend must integrate precisely with it.

**Backend base URLs (development):**

- REST API: `http://localhost:5009/api`
- SignalR Hub: `http://localhost:5009/signalr/device-hub`
- OpenAPI spec: `http://localhost:5009/openapi/v1.json`
- File assets: `http://localhost:5009/uploads/{filename}`

This boilerplate is the **design system foundation** — equivalent in quality to shadcn/ui but with:

- A **fresh, distinctive industrial-futuristic aesthetic** (not generic)
- **Fluid animations** and purposeful micro-interactions
- **General-purpose skeleton loading** system (no per-page skeletons needed)
- **Clean Architecture** structure enforced at the folder level
- **Full dark mode & light mode support** — theme-aware at every layer (CSS vars, Tailwind, components, stores)

Do NOT generate placeholder lorem ipsum content. Every component must reflect real IIoT/SCADA domain language.

---

## 🎨 DESIGN SYSTEM SPECIFICATION

### Visual Identity

- **Aesthetic Direction**: _Dark Precision Industrial_ — the aesthetic of a high-end control room combined with modern SaaS polish. Think Grafana meets Linear meets a Siemens SIMATIC HMI, but beautiful.
- **Mood**: Authoritative, precise, data-dense yet breathable. Dark background with surgical use of color for status and emphasis.

### Color Palette (CSS Custom Properties — Dual Theme)

The color system uses a **single set of semantic CSS variable names** that are overridden per theme. Components always reference `var(--color-*)` — never hardcoded hex values. Theme switching is zero-refactor.

```css
/* ============================================================
   DARK THEME (default) — class="dark" on <html>
   Aesthetic: Dark Precision Industrial
   ============================================================ */
:root,
.dark {
  /* === BACKGROUNDS === */
  --color-bg-canvas: #080c12; /* deepest background */
  --color-bg-surface: #0d1117; /* primary surfaces */
  --color-bg-elevated: #131b24; /* cards, panels */
  --color-bg-overlay: #1a2332; /* modals, dropdowns */
  --color-bg-subtle: #1e2a3a; /* hover states, dividers */

  /* === BORDERS === */
  --color-border-default: #1e3a4a;
  --color-border-muted: #162535;
  --color-border-strong: #2a5068;

  /* === BRAND / PRIMARY (same in both themes — brand identity) === */
  --color-brand-primary: #00d4ff;
  --color-brand-secondary: #0099cc;
  --color-brand-glow: rgba(0, 212, 255, 0.18);
  --color-brand-faint: rgba(0, 212, 255, 0.07);

  /* === ACCENT (same in both themes) === */
  --color-accent-amber: #f59e0b;
  --color-accent-emerald: #10b981;
  --color-accent-rose: #f43f5e;
  --color-accent-violet: #8b5cf6;
  --color-accent-sky: #38bdf8;

  /* === STATUS (same in both themes) === */
  --color-status-online: #10b981;
  --color-status-warning: #f59e0b;
  --color-status-alarm: #f43f5e;
  --color-status-offline: #6b7280;
  --color-status-unknown: #94a3b8;
  --color-status-idle: #38bdf8;

  /* === TEXT === */
  --color-text-primary: #e2ebf0;
  --color-text-secondary: #8ba3b8;
  --color-text-muted: #4a6580;
  --color-text-inverse: #080c12;
  --color-text-brand: #00d4ff;

  /* === SHADOWS (dark — stronger) === */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.45);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.65);
  --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.25);
  --shadow-glow-amber: 0 0 20px rgba(245, 158, 11, 0.25);
  --shadow-glow-rose: 0 0 20px rgba(244, 63, 94, 0.25);

  /* === SKELETON SHIMMER COLORS === */
  --skeleton-base: #131b24;
  --skeleton-highlight: #1e2a3a;
}

/* ============================================================
   LIGHT THEME — class="light" on <html>
   Aesthetic: Clean Industrial — crisp white + steel blue + cyan accents
   Inspired by modern process engineering software (e.g. Ignition, WinCC OA Light)
   ============================================================ */
.light {
  /* === BACKGROUNDS === */
  --color-bg-canvas: #f0f4f8; /* lightest — page background */
  --color-bg-surface: #ffffff; /* primary surfaces */
  --color-bg-elevated: #ffffff; /* cards, panels */
  --color-bg-overlay: #f7fafc; /* modals, dropdowns */
  --color-bg-subtle: #e8edf3; /* hover states, dividers, sidebar */

  /* === BORDERS === */
  --color-border-default: #cbd5e0;
  --color-border-muted: #e2e8f0;
  --color-border-strong: #0099cc; /* brand blue for focus rings */

  /* === BRAND / PRIMARY (same — brand identity unchanged) === */
  --color-brand-primary: #0099cc; /* slightly deeper cyan for light bg legibility */
  --color-brand-secondary: #007aa3;
  --color-brand-glow: rgba(0, 153, 204, 0.12);
  --color-brand-faint: rgba(0, 153, 204, 0.06);

  /* === ACCENT (same values — readable on light bg) === */
  --color-accent-amber: #d97706; /* slightly darker for light bg contrast */
  --color-accent-emerald: #059669;
  --color-accent-rose: #e11d48;
  --color-accent-violet: #7c3aed;
  --color-accent-sky: #0284c7;

  /* === STATUS (darker shades for light bg legibility) === */
  --color-status-online: #059669;
  --color-status-warning: #d97706;
  --color-status-alarm: #e11d48;
  --color-status-offline: #6b7280;
  --color-status-unknown: #64748b;
  --color-status-idle: #0284c7;

  /* === TEXT === */
  --color-text-primary: #0f1923; /* near-black — strong contrast */
  --color-text-secondary: #475569; /* slate */
  --color-text-muted: #94a3b8; /* placeholder, disabled */
  --color-text-inverse: #ffffff; /* text on dark/brand bg */
  --color-text-brand: #0099cc; /* brand-colored text */

  /* === SHADOWS (light — softer) === */
  --shadow-sm: 0 1px 3px rgba(15, 25, 35, 0.08);
  --shadow-md: 0 4px 12px rgba(15, 25, 35, 0.1);
  --shadow-lg: 0 8px 32px rgba(15, 25, 35, 0.12);
  --shadow-glow: 0 0 20px rgba(0, 153, 204, 0.2);
  --shadow-glow-amber: 0 0 20px rgba(217, 119, 6, 0.2);
  --shadow-glow-rose: 0 0 20px rgba(225, 29, 72, 0.2);

  /* === SKELETON SHIMMER COLORS === */
  --skeleton-base: #e2e8f0;
  --skeleton-highlight: #f0f4f8;
}

/* ============================================================
   SHARED — TYPOGRAPHY, SPACING, ANIMATION (theme-independent)
   ============================================================ */
:root {
  /* === TYPOGRAPHY === */
  --font-display: "Exo 2", sans-serif;
  --font-body: "DM Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-numeric: "Exo 2", sans-serif;

  /* === SPACING & RADIUS === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* === ANIMATION === */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 1, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-lazy: 600ms;
}
```

### Typography Rules

- **Display/H1-H2**: `Exo 2` Bold/SemiBold — used for page titles, widget headers, numeric KPIs
- **Body**: `DM Sans` Regular/Medium — all prose, labels, descriptions
- **Monospace**: `JetBrains Mono` — all sensor values, device IDs, tag names, raw data, timestamps
- **Numeric Readouts**: `Exo 2` — all live metrics displayed as large numbers
- Load all fonts via `@fontsource` npm packages (no Google Fonts CDN dependency)

---

## 🌗 THEME SYSTEM — DARK / LIGHT / SYSTEM

This is a **first-class feature**, not an afterthought. Every layer of the stack must be theme-aware.

### Theme Modes

| Mode     | Behavior                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dark`   | Applies `.dark` class to `<html>`. _Default for new users._                                                                |
| `light`  | Applies `.light` class to `<html>`.                                                                                        |
| `system` | Reads `window.matchMedia('(prefers-color-scheme: dark)')` and applies the matching class. Auto-updates on OS theme change. |

### `useThemeStore.ts` (Zustand)

```typescript
// Full spec:
type ThemeMode = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeState {
  mode: ThemeMode; // user preference (persisted)
  resolved: ResolvedTheme; // actual applied theme
  setMode: (mode: ThemeMode) => void;
  toggle: () => void; // cycles dark ↔ light (skips 'system')
}

// Implementation requirements:
// - Persist `mode` in localStorage key: 'synapse-theme'
// - On init: read from localStorage, fall back to 'dark'
// - resolved = mode === 'system' ? detect OS preference : mode
// - setMode() must: update state + update localStorage + apply class to document.documentElement
// - Listen to window.matchMedia for 'system' mode: add/remove event listener on mode change
// - Applying theme: remove ['dark','light'] classes, add resolved class to <html>
// - Use zustand/middleware persist for storage
```

### `ThemeProvider.tsx`

```tsx
// Requirements:
// - On mount: read useThemeStore, apply theme class to document.documentElement
// - Register matchMedia listener if mode === 'system'
// - Provide useTheme() convenience hook:
//   { mode, resolved, setMode, toggle, isDark, isLight }
// - Smooth theme transition: add CSS transition to body on theme switch
//   transition: background-color 300ms ease, color 300ms ease
//   but only AFTER initial mount (prevent flash on first load)
// - Wrap children, no visible output
```

### Theme Toggle Component (`ThemeToggle.tsx`)

```
Location: src/presentation/design-system/components/ThemeToggle/

Variants: 'icon-button' | 'segmented' | 'dropdown'

icon-button variant:
  - Single button: clicking cycles dark → light → system → dark
  - Animated icon swap: sun ↔ moon ↔ monitor (Motion layout animation)
  - Placed in Topbar, right side

segmented variant:
  - 3-segment control: [🌙 Dark] [☀️ Light] [💻 System]
  - Active segment: brand-primary bg + text-inverse
  - Inactive: transparent, hover bg-subtle
  - Smooth sliding indicator using Motion layoutId
  - Used in Settings page

dropdown variant:
  - Dropdown menu with 3 options (icon + label each)
  - Shows current mode with a checkmark
  - Used optionally in compact layouts
```

### Tailwind Dark/Light Mode Strategy

```typescript
// tailwind.config.ts:
// - darkMode: 'class'  ← controls via .dark class on <html>
// - All theme-sensitive utility classes use dark: prefix
// - However, since we use CSS vars for ALL colors, most components
//   need ZERO Tailwind dark: variants — they inherit from CSS vars automatically
//
// RULE:
//   ✅ Use CSS vars → automatic theme switch, no Tailwind dark: needed
//   ✅ Use Tailwind dark: only for structural differences (e.g. different images,
//      display behavior, or when a CSS var approach is impractical)
//   ❌ Never hardcode hex colors in Tailwind classes on themed components
//
// Example — CORRECT:
//   className="bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
//   or via custom Tailwind utilities: className="bg-elevated text-primary"
//
// Example — WRONG:
//   className="bg-gray-900 dark:bg-white text-white dark:text-gray-900"
```

### Theme-Aware Component Patterns

```tsx
// Pattern 1 — CSS vars (preferred, zero dark: overhead):
<div className="bg-surface border border-default text-primary rounded-lg p-4">

// Pattern 2 — inline CSS var for dynamic values only:
<div style={{ boxShadow: 'var(--shadow-glow)' }}>

// Pattern 3 — structural dark: override (rare, only when needed):
<img
  src={isDark ? '/assets/diagram-dark.svg' : '/assets/diagram-light.svg'}
  alt="Architecture diagram"
/>

// Pattern 4 — useTheme() hook for conditional logic:
const { isDark, resolved } = useTheme();
const chartTheme = isDark ? darkChartConfig : lightChartConfig;
```

### Recharts Theme Integration

```typescript
// Charts must adapt to theme. Provide a useChartTheme() hook:
// Returns chart config object with:
// {
//   backgroundColor: 'transparent',
//   gridColor: resolved === 'dark' ? '#1E3A4A' : '#CBD5E0',
//   textColor: resolved === 'dark' ? '#8BA3B8' : '#475569',
//   tooltipBg: resolved === 'dark' ? '#1A2332' : '#FFFFFF',
//   tooltipBorder: resolved === 'dark' ? '#1E3A4A' : '#CBD5E0',
//   lineColors: ['#00D4FF', '#10B981', '#F59E0B', '#8B5CF6'],  // same both themes
// }
// All Recharts components (TrendChart, etc.) consume this hook
```

### Login Page Theme Note

```
// LoginPage uses AuthLayout which applies its own full-screen background
// Dark mode: animated circuit/data-flow SVG on left panel (dark bg)
// Light mode: same layout but with:
//   - White/light-surface background
//   - Muted/outlined version of the animated background
//   - Brand cyan accents remain unchanged
// The ThemeToggle (icon-button variant) must be visible on LoginPage
// even before authentication — place it in the top-right corner of AuthLayout
```

---

## 🏗️ FOLDER STRUCTURE

Generate this **exact** folder structure. It follows the flat, pragmatic frontend architecture shown in the reference image — no over-engineered nesting, every folder is purposeful.

> **Architecture principle**: Clean separation by concern, not by DDD layers. The image reference shows: `@types`, `api`, `assets`, `components`, `hooks`, `pages`, `routes`, `templates`, `themes`, `utils`, `validators` — all flat under `src/`. We adapt this for the IIoT domain with additions for `stores`, `providers`, and `styles`.

```
synapse-iiot/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── brand/
│           ├── logo.svg             # Synapse IIoT SVG logo (full wordmark)
│           └── logo-mark.svg        # Icon-only mark (32px)
│
├── src/
│   │
│   ├── 📁 @types/                   # Global TypeScript declarations
│   │   ├── api.d.ts                 # API request/response interfaces (all endpoints)
│   │   ├── signalr.d.ts             # SignalR hub message payload types
│   │   ├── entities.d.ts            # Core domain entity interfaces (from DB schema)
│   │   ├── enums.d.ts               # All enum types (Protocol, DataType, AccessMode, Role)
│   │   └── index.d.ts               # Re-exports + global augmentations (vite-env, etc.)
│   │
│   ├── 📁 api/                      # HTTP client layer — all backend communication
│   │   ├── client.ts                # Axios instance (baseURL, withCredentials, interceptors)
│   │   ├── auth.api.ts              # /api/auth/* endpoints
│   │   ├── device.api.ts            # /api/device/* endpoints
│   │   ├── tag.api.ts               # /api/tags/* endpoints
│   │   ├── masterTable.api.ts       # /api/master-tables/* endpoints
│   │   ├── storageFlow.api.ts       # /api/storage-flow/* endpoints
│   │   ├── file.api.ts              # /api/file/* endpoints
│   │   └── index.ts
│   │
│   ├── 📁 assets/                   # Static assets
│   │   ├── brand/
│   │   │   ├── logo.svg
│   │   │   └── logo-mark.svg
│   │   └── illustrations/
│   │       ├── empty-devices.svg    # Empty state for devices page
│   │       ├── empty-tags.svg
│   │       └── empty-data.svg
│   │
│   ├── 📁 components/               # All reusable UI components
│   │   │
│   │   ├── 📁 ui/                   # Design system — base components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── Input/               # TextInput, NumberInput, SearchInput
│   │   │   ├── Select/              # Single, Multi (react-select wrapper)
│   │   │   ├── Checkbox/
│   │   │   ├── Toggle/              # Switch toggle
│   │   │   ├── Badge/               # Status badges with pulse animation
│   │   │   ├── Tooltip/             # Floating UI tooltip
│   │   │   ├── Popover/             # Floating UI popover
│   │   │   ├── Modal/               # Dialog with backdrop blur
│   │   │   ├── Drawer/              # Side drawer panel
│   │   │   ├── Tabs/                # Animated tab switcher
│   │   │   ├── Accordion/
│   │   │   ├── Table/               # TanStack Table v8 wrapper
│   │   │   ├── Pagination/
│   │   │   ├── ProgressBar/
│   │   │   ├── Spinner/
│   │   │   ├── Alert/               # Inline alert (info/warning/error/success)
│   │   │   ├── Avatar/
│   │   │   ├── Dropdown/
│   │   │   ├── DatePicker/          # Date & DateRange (react-datepicker)
│   │   │   ├── Breadcrumb/
│   │   │   ├── Card/                # Surface card with variants
│   │   │   ├── Divider/
│   │   │   ├── EmptyState/          # Zero-data placeholder
│   │   │   ├── ErrorBoundary/       # React error boundary
│   │   │   ├── ThemeToggle/         # Dark/Light/System toggle (3 variants)
│   │   │   └── index.ts             # Barrel export of all ui components
│   │   │
│   │   ├── 📁 skeleton/             # 🦴 General-purpose skeleton system
│   │   │   ├── Skeleton.tsx         # Base shimmer block
│   │   │   ├── SkeletonText.tsx     # N text line skeletons
│   │   │   ├── SkeletonCard.tsx     # Generic card skeleton
│   │   │   ├── SkeletonTable.tsx    # Table skeleton (header + N rows)
│   │   │   ├── SkeletonChart.tsx    # Chart area skeleton
│   │   │   ├── SkeletonStat.tsx     # KPI stat widget skeleton
│   │   │   ├── SkeletonList.tsx     # List item skeletons
│   │   │   ├── SkeletonForm.tsx     # Form field skeletons
│   │   │   ├── PageSkeleton.tsx     # Full-page default Suspense fallback
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 widgets/              # IIoT domain-specific components
│   │   │   ├── GaugeWidget/         # SVG circular gauge for analog values
│   │   │   ├── TrendChart/          # Real-time Recharts line chart
│   │   │   ├── StatusIndicator/     # LED-style dot with pulse animation
│   │   │   ├── TagValueDisplay/     # Live sensor value (JetBrains Mono)
│   │   │   ├── ProtocolBadge/       # HTTP/MQTT/MODBUS/OPC-UA badge
│   │   │   ├── DeviceCard/          # Device summary card
│   │   │   ├── ConnectionStatus/    # SignalR connection state indicator
│   │   │   ├── DataFlowIndicator/   # Animated data flow arrow
│   │   │   └── index.ts
│   │   │
│   │   └── 📁 layout/               # Page layout shells
│   │       ├── AppLayout/
│   │       │   ├── AppLayout.tsx    # Authenticated shell (sidebar + topbar + outlet)
│   │       │   ├── Sidebar/
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   ├── SidebarNav.tsx
│   │       │   │   ├── SidebarItem.tsx
│   │       │   │   └── index.ts
│   │       │   ├── Topbar/
│   │       │   │   ├── Topbar.tsx
│   │       │   │   ├── UserMenu.tsx
│   │       │   │   └── index.ts
│   │       │   └── index.ts
│   │       ├── AuthLayout/
│   │       │   ├── AuthLayout.tsx   # Centered layout for login
│   │       │   └── index.ts
│   │       ├── FullscreenLayout/
│   │       │   ├── FullscreenLayout.tsx  # SCADA fullscreen mode (no chrome)
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── useAuth.ts               # Auth state + login/logout actions
│   │   ├── useSignalR.ts            # SignalR subscribe/invoke
│   │   ├── useDeviceData.ts         # Real-time device data from SignalR
│   │   ├── usePermissions.ts        # RBAC: can(), canAny(), canAll()
│   │   ├── useTheme.ts              # { mode, resolved, isDark, toggle, setMode }
│   │   ├── useChartTheme.ts         # Recharts config adapted to current theme
│   │   ├── useDebounce.ts           # Debounce input values
│   │   ├── useLocalStorage.ts       # Typed localStorage hook
│   │   └── index.ts
│   │
│   ├── 📁 pages/                    # Route-level page components (all lazy loaded)
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── devices/
│   │   │   ├── DevicesPage.tsx
│   │   │   └── DeviceDetailPage.tsx
│   │   ├── tags/
│   │   │   ├── TagsPage.tsx
│   │   │   └── TagDetailPage.tsx
│   │   ├── master-tables/
│   │   │   ├── MasterTablesPage.tsx
│   │   │   └── MasterTableDetailPage.tsx
│   │   ├── storage-flow/
│   │   │   ├── StorageFlowPage.tsx
│   │   │   └── StorageFlowDetailPage.tsx
│   │   ├── audit-logs/
│   │   │   └── AuditLogsPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── errors/
│   │       ├── NotFoundPage.tsx     # 404
│   │       ├── UnauthorizedPage.tsx # 403
│   │       └── ServerErrorPage.tsx  # 500
│   │
│   ├── 📁 routes/                   # Routing configuration
│   │   ├── router.tsx               # createBrowserRouter (React Router v7)
│   │   ├── ProtectedRoute.tsx       # Auth guard
│   │   ├── PermissionRoute.tsx      # RBAC guard
│   │   ├── LazyPage.tsx             # Suspense[PageSkeleton] + ErrorBoundary wrapper
│   │   ├── paths.ts                 # All typed route path constants
│   │   └── index.ts
│   │
│   ├── 📁 stores/                   # Zustand state stores
│   │   ├── authStore.ts             # User, isAuthenticated, login, logout
│   │   ├── themeStore.ts            # ThemeMode, resolved, setMode — persisted
│   │   ├── uiStore.ts               # Sidebar collapse, active modals
│   │   ├── gatewayStore.ts          # SignalR connection state
│   │   ├── deviceStore.ts           # Device list cache + selected device
│   │   ├── tagStore.ts              # Real-time tag value map { [tagId]: TagValue }
│   │   └── index.ts
│   │
│   ├── 📁 providers/                # React Context providers (composed in AppProvider)
│   │   ├── AppProvider.tsx          # Root — wraps all providers in correct order
│   │   ├── AuthProvider.tsx         # Calls GET /api/auth/info on mount, populates authStore
│   │   ├── ThemeProvider.tsx        # Reads themeStore, applies class to <html>
│   │   ├── SignalRProvider.tsx      # HubConnection lifecycle (connect/disconnect)
│   │   └── index.ts
│   │
│   ├── 📁 templates/                # Page-level layout compositions (reusable page shells)
│   │   ├── PageHeader.tsx           # Breadcrumb + title + action buttons slot
│   │   ├── DataTableTemplate.tsx    # Table + filters + pagination assembled
│   │   ├── DetailTemplate.tsx       # Detail page with back button + tabs
│   │   └── index.ts
│   │
│   ├── 📁 themes/                   # Design tokens (JS mirrors of CSS vars)
│   │   ├── tokens.ts                # All color, spacing, radius, shadow tokens
│   │   ├── animations.ts            # Easing curves, duration constants
│   │   └── index.ts
│   │
│   ├── 📁 utils/                    # Pure utility functions
│   │   ├── cn.ts                    # clsx + tailwind-merge
│   │   ├── format.ts                # Date, number, duration, file size formatters
│   │   ├── tagScaling.ts            # Raw→EU value scaling (RawMin/Max → EuMin/Max)
│   │   ├── protocolHelpers.ts       # Protocol label, icon, color mapping
│   │   ├── storageFlowHelpers.ts    # JSONPath source parser for StorageFlowMapping
│   │   └── index.ts
│   │
│   ├── 📁 validators/               # Zod schemas for all forms
│   │   ├── auth.schema.ts           # Login: { email, password }
│   │   ├── device.schema.ts         # Device create/edit form validation
│   │   ├── tag.schema.ts            # Tag create/edit (Address, DataType, scaling)
│   │   ├── masterTable.schema.ts    # MasterTable + MasterTableField forms
│   │   ├── storageFlow.schema.ts    # StorageFlow + mapping config
│   │   └── index.ts
│   │
│   ├── 📁 styles/
│   │   ├── globals.css              # Tailwind v4 @import + all CSS vars (dark & light)
│   │   ├── animations.css           # Keyframe library (shimmer, pulse-ring, glow, flash)
│   │   └── typography.css           # @fontsource imports + type scale base
│   │
│   ├── App.tsx                      # RouterProvider root
│   ├── main.tsx                     # Entry point — mounts AppProvider > App
│   └── vite-env.d.ts
│
├── .env.example
├── .env.development
├── biome.json                       # Biome formatter + linter config (replaces ESLint + Prettier)
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🗃️ DOMAIN TYPES — DERIVED FROM DATABASE SCHEMA

All types in `src/@types/` must **exactly match** the backend database schema from `AppDbContext`. These are the source of truth for all frontend entity shapes.

### `entities.d.ts` — All Domain Entities

```typescript
// ================================================================
// USER — table: Users
// ================================================================
interface User {
  id: string; // Guid → string (UUID)
  username: string; // varchar(100)
  role: UserRole; // varchar(50) enum
  createdAt: string; // datetime → ISO string
  updatedAt: string | null;
  deletedAt: string | null; // soft delete
}

// ================================================================
// DEVICE — table: Devices
// ================================================================
interface Device {
  id: string;
  name: string; // varchar(100)
  description: string | null; // varchar(255)?
  isEnabled: boolean;
  protocol: ProtocolType; // varchar(50) enum
  connectionConfigJson: string; // json — raw JSON string, parsed per protocol
  pollingInterval: number; // int — milliseconds
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

// ConnectionConfig shapes per protocol (parsed from Device.connectionConfigJson):
interface ModbusTcpConfig {
  host: string;
  port: number;
  unitId: number;
}
interface ModbusRtuConfig {
  portName: string;
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: string;
  unitId: number;
}
interface OpcUaConfig {
  endpointUrl: string;
  securityMode: string;
  username?: string;
  password?: string;
}
interface MqttConfig {
  brokerUrl: string;
  port: number;
  clientId: string;
  username?: string;
  password?: string;
  topic: string;
}
interface HttpDeviceConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  authType?: string;
}

type ConnectionConfig =
  | ModbusTcpConfig
  | ModbusRtuConfig
  | OpcUaConfig
  | MqttConfig
  | HttpDeviceConfig;

// ================================================================
// TAG — table: Tags
// ================================================================
interface Tag {
  id: string;
  deviceId: string;
  name: string; // varchar(100)
  address: string; // varchar(100) — MODBUS register, OPC-UA NodeId path, etc.
  dataType: DataType; // varchar(50) enum
  accessMode: AccessMode; // varchar(50) enum
  isScaled: boolean;
  rawMin: number | null; // double? — raw value range for scaling
  rawMax: number | null;
  euMin: number | null; // double? — engineering unit range
  euMax: number | null;
  unit: string; // varchar(20) — e.g. "°C", "bar", "RPM"
  currentRawValue: number | null; // double? — last raw value (cached)
  currentEngValue: number | null; // double? — last engineering value (cached)
  valueUpdatedAt: string | null; // datetime? — when cache was last updated
  isActive: boolean;
  opcUaNodeId: string | null; // varchar(100)? — OPC-UA specific
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

// ================================================================
// MASTER TABLE — table: MasterTables
// ================================================================
interface MasterTable {
  id: string;
  name: string; // varchar(200)
  tableName: string; // varchar(255) — actual DB table name
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  fields?: MasterTableField[]; // included when fetching with fields
}

// ================================================================
// MASTER TABLE FIELD — table: MasterTableFields
// ================================================================
interface MasterTableField {
  id: string;
  masterTableId: string;
  name: string; // varchar(255)
  dataType: FieldDataType; // varchar(50) enum
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

// ================================================================
// STORAGE FLOW — table: StorageFlows
// ================================================================
interface StorageFlow {
  id: string;
  name: string; // varchar(100)
  description: string | null;
  isActive: boolean;
  storageInterval: number; // int — seconds between storage writes
  masterTableId: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  masterTable?: MasterTable; // included in detail responses
  devices?: StorageFlowDevice[]; // M2M relation
  mappings?: StorageFlowMapping[]; // field mappings
}

// ================================================================
// STORAGE FLOW DEVICE — table: StorageFlowDevices (M2M)
// ================================================================
interface StorageFlowDevice {
  id: string;
  storageFlowId: string;
  deviceId: string;
  createdAt: string;
  device?: Device; // included in responses
}

// ================================================================
// STORAGE FLOW MAPPING — table: StorageFlowMappings
// ================================================================
interface StorageFlowMapping {
  id: string;
  storageFlowId: string;
  masterTableFieldId: string;
  sourcePath: string; // varchar(500) — JSONPath expression or Tag reference
  tagId: string | null; // Guid? — if source is a tag
  createdAt: string;
  updatedAt: string | null;
  masterTableField?: MasterTableField;
  tag?: Tag;
}

// ================================================================
// FILE METADATA — table: FileMetadata
// ================================================================
interface FileMetadata {
  id: string;
  fileName: string; // varchar(255) — stored filename (UUID-based)
  originalFileName: string; // varchar(255) — user's original filename
  filePath: string; // varchar(500) — relative path: uploads/...
  fileSize: number; // bigint → number
  contentType: string; // varchar(100) — MIME type
  entityType: string; // varchar(50) — e.g. "Device", "Tag"
  entityId: string | null; // Guid?
  fieldName: string; // varchar(100) — field this file belongs to
  uploadedAt: string; // datetime
  deletedAt: string | null;
  // Computed helper — full URL for display:
  // url = `${VITE_FILE_BASE_URL}/${filePath}`
}

// ================================================================
// AUDIT LOG — table: AuditLogs
// ================================================================
interface AuditLog {
  id: string;
  userId: string | null;
  action: string; // varchar(50) — e.g. "CREATE", "UPDATE", "DELETE", "LOGIN"
  entityType: string; // varchar(50) — e.g. "Device", "Tag", "StorageFlow"
  entityId: string | null;
  oldValues: Record<string, unknown> | null; // json?
  newValues: Record<string, unknown> | null; // json?
  ipAddress: string | null; // varchar(45)?
  userAgent: string | null; // varchar(500)?
  status: AuditStatus; // enum/int
  errorMessage: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "username" | "role">; // included in list responses
}
```

### `enums.d.ts` — All Backend Enums

```typescript
// Maps to backend Protocol enum (Device.Protocol)
// Protocols handled by backend workers — frontend uses for display/filtering only
type ProtocolType = "HTTP" | "MQTT" | "MODBUS_TCP" | "MODBUS_RTU" | "OPC_UA";

// Maps to backend DataType enum (Tag.DataType)
type DataType =
  | "Boolean"
  | "Int16"
  | "Int32"
  | "Int64"
  | "Float"
  | "Double"
  | "String";

// Maps to backend AccessMode enum (Tag.AccessMode)
type AccessMode = "Read" | "Write" | "ReadWrite";

// Maps to backend FieldDataType enum (MasterTableField.DataType)
type FieldDataType = "String" | "Integer" | "Float" | "Boolean" | "DateTime";

// Maps to backend Role enum (User.Role)
type UserRole = "Admin" | "Operator" | "Viewer";

// Maps to backend AuditStatus enum (AuditLog.Status)
type AuditStatus = 0 | 1; // 0 = Success, 1 = Failure

// Frontend-only: SignalR connection state
type ConnectionState =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Reconnecting"
  | "Disconnecting";
```

### `api.d.ts` — API Request & Response Contracts

```typescript
// Standard API response wrapper (match backend ApiResponse<T> shape)
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

// Paginated list response
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── AUTH ──────────────────────────────────────────────────
interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
interface AuthInfoResponse {
  user: User;
}

// ── DEVICE ────────────────────────────────────────────────
interface CreateDeviceRequest {
  name: string;
  description?: string;
  isEnabled: boolean;
  protocol: ProtocolType;
  connectionConfigJson: string; // JSON.stringify(ConnectionConfig)
  pollingInterval: number;
}
interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {}
interface TestHttpConnectionRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

// ── TAG ───────────────────────────────────────────────────
interface CreateTagRequest {
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: AccessMode;
  isScaled: boolean;
  rawMin?: number;
  rawMax?: number;
  euMin?: number;
  euMax?: number;
  unit: string;
  isActive: boolean;
  opcUaNodeId?: string;
}
interface UpdateTagRequest extends Partial<CreateTagRequest> {}

// ── MASTER TABLE ──────────────────────────────────────────
interface CreateMasterTableRequest {
  name: string;
  tableName: string;
  description?: string;
  isActive: boolean;
}
interface CreateMasterTableFieldRequest {
  masterTableId: string;
  name: string;
  dataType: FieldDataType;
  isEnabled: boolean;
}

// ── STORAGE FLOW ──────────────────────────────────────────
interface CreateStorageFlowRequest {
  name: string;
  description?: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  deviceIds: string[];
  mappings: {
    masterTableFieldId: string;
    sourcePath: string;
    tagId?: string;
  }[];
}
interface DiscoverFieldsResponse {
  fields: string[];
}

// ── FILE ──────────────────────────────────────────────────
interface FileUploadResponse {
  file: FileMetadata;
}
interface FileConfigResponse {
  maxFileSizeInBytes: number;
  allowedTypes: string[];
}
```

### `signalr.d.ts` — SignalR Hub Message Types

```typescript
// Payload received from SignalR DeviceHub "ReceiveDeviceData" event
interface DeviceDataPayload {
  deviceId: string;
  tagValues: Record<string, TagLiveValue>; // key = tagId
  timestamp: string; // ISO datetime
}

// Individual tag value in SignalR push
interface TagLiveValue {
  tagId: string;
  rawValue: number | null;
  engValue: number | null;
  quality: TagQuality;
  updatedAt: string;
}

// Payload received from "ReceiveDeviceStatus" event
interface DeviceStatusPayload {
  deviceId: string;
  isConnected: boolean;
  lastSeen: string | null;
  errorMessage: string | null;
}

// Payload received from "ReceiveError" event
interface SignalRErrorPayload {
  message: string;
  code?: string;
}

type TagQuality = "Good" | "Bad" | "Uncertain";
```

---

Only include libraries that are actually used. No gRPC, no raw MQTT (protocol is handled server-side).

### Core

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.5.0",
  "vite": "^6.0.0",
  "@vitejs/plugin-react": "^4.3.0"
}
```

### Routing

```json
{
  "react-router": "^7.0.0"
}
```

### State Management

```json
{
  "zustand": "^5.0.0",
  "@tanstack/react-query": "^5.60.0",
  "@tanstack/react-query-devtools": "^5.60.0"
}
```

### Styling

```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

### UI / Animation

```json
{
  "motion": "^11.0.0",
  "@floating-ui/react": "^0.26.0",
  "sonner": "^1.7.0"
}
```

### Forms & Validation

```json
{
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.0"
}
```

### Data Display

```json
{
  "@tanstack/react-table": "^8.20.0",
  "recharts": "^2.13.0",
  "react-select": "^5.8.0",
  "react-datepicker": "^7.5.0",
  "date-fns": "^4.1.0"
}
```

### Real-time (SignalR only — MQTT/gRPC are OT-side, handled by backend)

```json
{
  "@microsoft/signalr": "^8.0.0"
}
```

### HTTP Client

```json
{
  "axios": "^1.7.0"
}
```

### Icons & Fonts

```json
{
  "lucide-react": "^0.460.0",
  "@fontsource/exo-2": "^5.0.0",
  "@fontsource/dm-sans": "^5.0.0",
  "@fontsource/jetbrains-mono": "^5.0.0"
}
```

### Utilities

```json
{
  "immer": "^10.1.0",
  "lodash-es": "^4.17.0",
  "@types/lodash-es": "^4.17.0"
}
```

### Dev Tools

```json
{
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@biomejs/biome": "^1.9.0"
}
```

> **Note on Biome**: Use `biome.json` instead of separate ESLint + Prettier configs (as shown in the reference project structure). Biome handles both formatting and linting in one fast tool. Configure lint rules equivalent to the previous ESLint spec: no-unused-vars, no-explicit-any, react-hooks rules.

---

## 🦴 SKELETON LOADING SYSTEM SPECIFICATION

This is a **critical requirement**. The skeleton system must be **general-purpose** so developers never need to write per-page skeleton components.

### Philosophy

- One `<Skeleton />` primitive — rendered as animated shimmer block
- Composition-based: combine skeleton primitives to match any layout
- Automatic: `LazyPage.tsx` wraps all lazy routes in `<Suspense fallback={<PageSkeleton />}>`
- `PageSkeleton` renders a generic layout skeleton (sidebar + topbar + content area)

### Skeleton Base Component

```tsx
// src/presentation/design-system/skeleton/Skeleton.tsx
// Generate this component with:
// - shimmer animation via CSS keyframes (NOT Tailwind animate-pulse — custom shimmer)
// - Props: width, height, borderRadius, className, variant ('block'|'text'|'circle')
// - The shimmer must use a linear-gradient sweep animation left-to-right
// - Color: from var(--color-bg-elevated) to var(--color-bg-overlay) to var(--color-bg-elevated)
// - Animation duration: 1.8s infinite
```

### Skeleton Composition Components

Each component below must accept `count?: number` prop to repeat rows:

- `SkeletonText` — renders N lines with randomized widths (100%, 85%, 70% pattern)
- `SkeletonCard` — card shape with a header block + 3 text lines + optional footer
- `SkeletonTable` — thead with 5 column headers + N tbody rows of data cells
- `SkeletonChart` — rectangular area with a subtle grid pattern overlay
- `SkeletonStat` — KPI widget: small label block + large number block + trend indicator
- `SkeletonList` — N rows of [icon-circle + text-block + action-block] pattern
- `SkeletonForm` — label + input pairs, N fields, with a button at bottom

### PageSkeleton

```tsx
// PageSkeleton renders the full AppLayout skeleton:
// - Left sidebar: logo area + N nav item skeletons
// - Topbar: breadcrumb skeleton + right-side action skeletons
// - Content area: renders <SkeletonCard count={2} /> in a responsive grid
// This is the default Suspense fallback for ALL lazy routes
```

### useSkeleton Hook

```tsx
// Provides:
// - isLoading: boolean
// - showSkeleton: boolean (true if isLoading && time > minDisplayMs to prevent flash)
// - minDisplayMs: 300 (prevents skeleton flash for fast responses)
```

---

## ⚡ ANIMATION SPECIFICATION

### Principles

1. **Purposeful**: Animations must communicate state changes, not decorate
2. **Physics-based**: Use spring easings for interactive elements
3. **Performance-first**: All animations GPU-accelerated (transform, opacity only)
4. **Reducible**: Respect `prefers-reduced-motion` — all animations have a reduced variant

### Required Animation Implementations

#### Page Transitions

```
// Route change animation using Motion layout:
// - Outgoing page: opacity 1→0, y: 0→-8px, duration: 150ms ease-sharp
// - Incoming page: opacity 0→1, y: 8px→0, duration: 250ms ease-smooth
// - Stagger children with 40ms delay increments
```

#### Sidebar

```
// Collapse/expand:
// - Width: 240px ↔ 64px, spring animation (stiffness: 300, damping: 30)
// - Nav item labels: opacity + width transition
// - Tooltip appears on collapsed hover (Floating UI, 150ms delay)
```

#### Status Indicators

```
// Online pulse ring:
// - Box-shadow glow + scale 1→1.4→1 ring ripple, duration 2s infinite
// - Color-coded: var(--color-status-online/warning/alarm)
//
// Alarm pulse:
// - Alarm items in sidebar/topbar: subtle background flash, 1s interval
// - Critical alarms: faster flash (0.5s), rose glow
```

#### Cards & Panels

```
// Mount: opacity 0→1, y: 16px→0, scale 0.98→1, spring easing
// Hover: subtle translateY(-2px) + box-shadow enhancement, 200ms
// The card hover must be barely perceptible — refinement not bounce
```

#### Real-time Data Updates

```
// When a tag value changes:
// - Number fades out old value, fades in new value (cross-fade 200ms)
// - If value increased: brief green tint flash on element
// - If value decreased: brief amber tint flash on element
// - If alarm threshold breached: rose tint + subtle scale pulse
```

#### Buttons

```
// Default: color transition 150ms ease
// Active/Click: scale 0.97, 100ms, snap back 200ms spring
// Loading state: spinner replaces content, no layout shift (preserve button width)
// Danger variant: glow pulse animation on hover (rose shadow)
```

#### Toast Notifications

```
// Entry: slide in from top-right + opacity, spring
// Exit: slide out right + opacity, ease-sharp
// Progress bar on timed toasts
// Stack behavior: push older toasts down smoothly
```

#### Number Counters

```
// KPI metrics use animated number counting on mount
// Duration: 800ms, ease-out cubic
// Library: implement with requestAnimationFrame, no external lib needed
```

---

## 🔌 REAL-TIME ARCHITECTURE

The backend exposes **one** real-time endpoint: a SignalR hub at `/signalr/device-hub`. MQTT and gRPC are **OT-side protocols** — they are handled server-side by the backend's background workers. The frontend only communicates with SignalR and REST.

### Backend SignalR Hub: `DeviceHub`

```
Path:    /signalr/device-hub
Library: @microsoft/signalr (version ^8.0.0)
Auth:    Cookie-based (JWT-TOKEN cookie sent automatically via withCredentials)
```

### `SignalRClient.ts`

```typescript
// HubConnectionBuilder configuration:
// - url: import.meta.env.VITE_SIGNALR_HUB_URL
// - transport: HttpTransportType.WebSockets (fallback: LongPolling)
// - withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) ms
// - configureLogging: LogLevel.Warning in production, LogLevel.Information in dev
// - NO manual token factory — cookie is sent automatically (withCredentials = true)
//   IMPORTANT: use .withUrl(url, { withCredentials: true }) in connection builder

// Connection state enum (mirrors backend + @microsoft/signalr HubConnectionState):
// Disconnected | Connecting | Connected | Reconnecting | Error

// Hub client methods (what frontend listens to from backend pushes):
// "ReceiveDeviceData"    → payload: { deviceId, tagValues: TagValueMap, timestamp }
// "ReceiveDeviceStatus"  → payload: { deviceId, status: DeviceStatus, timestamp }
// "ReceiveError"         → payload: { message: string, code?: string }

// Hub server methods (what frontend can invoke on backend):
// connection.invoke("SubscribeDevice", deviceId: string)   → void
// connection.invoke("UnsubscribeDevice", deviceId: string) → void
// connection.invoke("SubscribeAllDevices")                 → void
// connection.invoke("UnsubscribeAllDevices")               → void
```

### `SignalRContext.tsx` + `useSignalR.ts`

```tsx
// SignalRContext:
// - Single HubConnection instance for the entire app lifetime
// - Auto-start connection after successful auth (useAuthStore.isAuthenticated = true)
// - Auto-stop on logout
// - Expose: { connection, connectionState, isConnected, startConnection, stopConnection }
// - Store connectionState in useGatewayStore for Topbar indicator

// useSignalR hook (consumed by feature components):
// - subscribe(method: string, callback: (...args) => void): () => void
//   Returns unsubscribe function (use in useEffect cleanup)
// - invoke(method: string, ...args): Promise<void>
// - connectionState: HubConnectionState
// - isConnected: boolean
```

### Data Flow Architecture (Accurate)

```
OT Devices                  Backend (.NET 10)              Frontend (React)
──────────────              ──────────────────────         ──────────────────────
MODBUS RTU/TCP ─┐
OPC-UA         ─┤──► Background Workers  ──► DeviceHub ──(SignalR WS)──► SignalRContext
MQTT Broker    ─┤    (polling + push)    ──► REST API  ──(HTTP/Axios)──► TanStack Query
HTTP Device    ─┘                        ──► File API  ──(HTTP/Axios)──► Direct fetch
```

### `useGatewayStore.ts` (SignalR Connection State)

```typescript
// Tracks real-time connection health — displayed in Topbar ConnectionStatus widget
// {
//   connectionState: HubConnectionState,
//   isConnected: boolean,
//   reconnectAttempts: number,
//   lastConnectedAt: Date | null,
//   lastDisconnectedAt: Date | null,
//   setConnectionState: (state: HubConnectionState) => void,
//   incrementReconnectAttempts: () => void,
//   resetReconnectAttempts: () => void,
// }
```

---

## 🔐 AUTHENTICATION & RBAC

### Auth Flow — Backend Contract

The backend uses **JWT stored in an HTTP-only cookie** named `JWT-TOKEN`. This is NOT a Bearer token in headers.

```typescript
// CRITICAL: Auth mechanism matches backend exactly:
// - Cookie name: "JWT-TOKEN" (HTTP-only, set by backend on login)
// - Token TTL: 60 minutes (JwtSettings.ExpirationInMinutes: 60)
// - No refresh token endpoint — session ends when JWT expires
// - All Axios requests MUST use: withCredentials: true
//   (credentials: "include" equivalent — sends cookie automatically)
// - On 401 response: clear auth state, redirect to /login
// - No manual token storage in Zustand — token lives in cookie only

// useAuthStore state:
// {
//   user: User | null,           // from GET /api/auth/info response
//   isAuthenticated: boolean,
//   isLoading: boolean,
//   permissions: string[],       // roles/permissions from user info
//   login(credentials: LoginRequest) → Promise<void>,
//   logout() → Promise<void>,
//   fetchUserInfo() → Promise<void>,
// }

// Auth endpoints (exact paths from backend):
// POST /api/auth/register   → register new user
// POST /api/auth/login      → sets JWT-TOKEN cookie, returns user info
// GET  /api/auth/info       → returns current user from cookie
// POST /api/auth/logout     → clears JWT-TOKEN cookie

// LoginRequest type:
// { email: string; password: string }

// Axios instance config:
// baseURL: import.meta.env.VITE_API_BASE_URL
// withCredentials: true   ← REQUIRED for cookie auth
// timeout: import.meta.env.VITE_API_TIMEOUT

// On app load (AppProvider mount):
// 1. Call GET /api/auth/info
// 2. If 200 → populate useAuthStore.user, set isAuthenticated = true
// 3. If 401 → set isAuthenticated = false, stay on /login
// This restores session on page refresh without storing token in localStorage
```

### Rate Limiting Awareness

```typescript
// Backend enforces rate limits — frontend must handle 429 gracefully:
// - Default: 100 requests/minute → show "Too many requests, please wait" toast
// - Login endpoint: 5 requests/15 minutes → show specific "Too many login attempts" error
// Add Axios response interceptor for status 429:
// → Display sonner toast with retry-after info
// → Disable login form submit button for remaining duration
```

### RBAC Permissions

```typescript
// Roles come from GET /api/auth/info response (user.roles or user.permissions array)
// Map backend role strings to frontend Permission constants:
// Permission keys in shared/constants/permissions.ts:
// DEVICE_VIEW, DEVICE_EDIT, DEVICE_DELETE
// TAG_VIEW, TAG_WRITE, TAG_CONFIGURE
// MASTER_TABLE_VIEW, MASTER_TABLE_EDIT
// STORAGE_FLOW_VIEW, STORAGE_FLOW_EDIT
// FILE_UPLOAD
// SETTINGS_VIEW, SETTINGS_ADMIN
// USER_MANAGE

// usePermissions hook:
// - can(permission: Permission): boolean
// - canAny(permissions: Permission[]): boolean
// - canAll(permissions: Permission[]): boolean
```

---

## 🌐 ENVIRONMENT CONFIGURATION

Values derived directly from the actual backend `appsettings.json` and `launchSettings.json`. Do NOT change these defaults — they must match the running backend exactly.

### `.env.example`

```env
# === REST API ===
# Backend: ASP.NET Core running on http://localhost:5009
VITE_API_BASE_URL=http://localhost:5009/api
VITE_API_TIMEOUT=10000

# === SIGNALR ===
# Backend hub path: app.MapHub<DeviceHub>("/signalr/device-hub")
VITE_SIGNALR_HUB_URL=http://localhost:5009/signalr/device-hub

# === FILE ASSETS ===
# Uploaded files served at: {BaseUrl}/uploads/{filename}
# Matches backend FileUploadSettings.BaseUrl
VITE_FILE_BASE_URL=http://localhost:5009

# === APP ===
VITE_APP_NAME=Synapse IIoT
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# === FEATURE FLAGS ===
VITE_FEATURE_ANALYTICS=true
```

### `.env.development` (pre-filled for local dev)

```env
VITE_API_BASE_URL=http://localhost:5009/api
VITE_SIGNALR_HUB_URL=http://localhost:5009/signalr/device-hub
VITE_FILE_BASE_URL=http://localhost:5009
VITE_APP_NAME=Synapse IIoT
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_FEATURE_ANALYTICS=true
```

---

## 🗺️ ROUTING SPECIFICATION

### Route Configuration (`router.tsx`)

```tsx
// Use createBrowserRouter from react-router
// All page components are lazy-loaded via React.lazy()
// All lazy routes wrapped in <LazyPage> component which provides:
//   - <Suspense fallback={<PageSkeleton />}>
//   - <ErrorBoundary fallback={<ServerErrorPage />}>

// Route tree (aligned to actual backend resources):
// /                              → redirect to /dashboard (auth) or /login (no auth)
// /login                         → AuthLayout > LoginPage
// /dashboard                     → AppLayout > DashboardPage
// /devices                       → AppLayout > DevicesPage
// /devices/:id                   → AppLayout > DeviceDetailPage
// /tags                          → AppLayout > TagsPage
// /tags/:id                      → AppLayout > TagDetailPage
// /master-tables                 → AppLayout > MasterTablesPage
// /master-tables/:id             → AppLayout > MasterTableDetailPage
// /storage-flow                  → AppLayout > StorageFlowPage
// /storage-flow/:id              → AppLayout > StorageFlowDetailPage
// /audit-logs                    → AppLayout > AuditLogsPage
// /settings                      → AppLayout > SettingsPage
// *                              → NotFoundPage
```

### API Endpoint Constants (`api/client.ts` — include as ENDPOINTS object)

```typescript
// All endpoints match backend exactly (from README Ringkasan Endpoint):
const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_INFO: "/auth/info",
  AUTH_LOGOUT: "/auth/logout",

  // Device
  DEVICES: "/device",
  DEVICE_BY_ID: (id: string) => `/device/${id}`,
  DEVICE_HTTP_TEST: "/device/http-test",
  DEVICE_TEST_CONN: "/device/test-http-connection",

  // Tags
  TAGS: "/tags",
  TAG_BY_ID: (id: string) => `/tags/${id}`,
  TAGS_BY_DEVICE: (deviceId: string) => `/tags/device/${deviceId}`,

  // Master Tables
  MASTER_TABLES: "/master-tables",
  MASTER_TABLE_BY_ID: (id: string) => `/master-tables/${id}`,
  MASTER_TABLE_FIELDS: (masterTableId: string) =>
    `/master-tables/${masterTableId}/fields`,

  // Storage Flow
  STORAGE_FLOWS: "/storage-flow",
  STORAGE_FLOW_BY_ID: (id: string) => `/storage-flow/${id}`,
  STORAGE_FLOW_DISCOVER: "/storage-flow/discover-fields",

  // File
  FILE_UPLOAD: "/file/upload",
  FILE_UPLOAD_MULTI: "/file/upload-multiple",
  FILE_UPLOAD_FIELD: "/file/upload-field",
  FILE_DELETE: "/file/delete",
  FILE_CONFIG: "/file/config",
} as const;
```

---

## 🎛️ COMPONENT SPECIFICATIONS (Critical Components)

### Button Component

```
Variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
Sizes: 'xs' | 'sm' | 'md' | 'lg'
Props: loading, disabled, leftIcon, rightIcon, fullWidth
Behaviors:
  - primary: solid cyan bg + text-inverse, glow shadow on hover
  - secondary: bg-elevated + border, bg-subtle on hover
  - ghost: transparent, bg-subtle on hover
  - danger: rose-tinted, glow-rose on hover
  - All: scale-down on active, spinner replaces content on loading
  - Icon-only variant when no children (square aspect ratio)
```

### Badge Component

```
Variants: 'online' | 'offline' | 'warning' | 'alarm' | 'idle' | 'unknown' | 'info'
Sizes: 'sm' | 'md'
Props: pulse (boolean — adds ring animation for online/alarm states)
  - online: emerald dot + text, pulse ring animation
  - alarm: rose dot + text, faster pulse
  - Each variant uses its status color CSS var
```

### Card Component

```
Variants: 'default' | 'elevated' | 'interactive' | 'alarm'
Props: header, footer, noPadding, loading (shows SkeletonCard when true)
  - default: bg-elevated, border-default
  - elevated: bg-overlay, shadow-md
  - interactive: hover translateY + shadow enhancement
  - alarm: rose border-left accent (4px left border)
```

### StatusIndicator Component

```
// IIoT domain-specific
Props: status (DeviceStatus), size ('sm'|'md'|'lg'), showLabel, label
Renders: colored circle (LED) with optional pulse ring for online/alarm
Uses: var(--color-status-*) for colors
```

### TagValueDisplay Component

```
// Shows a live sensor reading
Props: tagId, value, unit, quality, label, size, trend
Renders:
  - Label in DM Sans, small, muted
  - Value in JetBrains Mono, large, primary text
  - Unit in DM Sans, small, secondary
  - Quality indicator dot (Good=emerald, Bad=rose, Uncertain=amber)
  - Trend arrow (↑ green / ↓ amber / → neutral)
  - Animate value change with cross-fade
```

### GaugeWidget Component

```
// SVG-based circular gauge
Props: value, min, max, unit, label, thresholds[], size
Renders:
  - SVG arc gauge (180° or 270°)
  - Color-coded by thresholds (emerald → amber → rose)
  - Center value in Exo 2 font
  - Smooth needle animation on value change
  - Scale tick marks at min/max/midpoint
```

---

## 📐 TAILWIND CONFIGURATION (`tailwind.config.ts`)

```typescript
// Tailwind v4 configuration:
// - darkMode: 'class'  ← class-based theme switching
// - Extend theme with ALL design tokens from CSS vars using var() references
// - Add custom animations: shimmer, pulse-ring, glow-pulse, data-flash
// - Add custom color utilities that wrap CSS vars:
//   bg-canvas, bg-surface, bg-elevated, bg-overlay, bg-subtle
//   text-primary, text-secondary, text-muted, text-brand
//   border-default, border-muted, border-strong
//   status-online, status-warning, status-alarm, status-offline
// - Add custom font families: font-display, font-body, font-mono
// - Content paths: all src/**/*.{tsx,ts}
// - Safelist: all dynamic status color classes
//
// NOTE: Because ALL colors are CSS vars, dark: variants are rarely needed.
// Components achieve theming through var(--color-*) — no dark: prefix overrides.
// Only use dark: for structural/layout differences, never for color overrides.
```

---

## 🏁 INITIAL PAGE IMPLEMENTATIONS

For each page, generate a **realistic boilerplate implementation** (not blank). All data fetched via TanStack Query. All forms use react-hook-form + Zod validators.

### LoginPage

```
- Full-viewport layout using AuthLayout
- Left panel: Synapse IIoT branding + animated data-flow SVG background
  - Dark mode: dark canvas, glowing cyan circuit lines
  - Light mode: light surface, muted steel-blue circuit lines
- Right panel: Login form
  - Fields: email (text) + password (password) + remember me (checkbox)
  - Validation: auth.schema.ts (email format, password min 8 chars)
  - Error: 401 → "Invalid credentials" inline alert
  - Error: 429 → "Too many attempts. Try again in X minutes."
  - Submit: POST /api/auth/login → on success redirect to /dashboard
- ThemeToggle (icon-button) fixed top-right, visible pre-auth
```

### DashboardPage

```
- 4 KPI stat cards (TanStack Query, skeleton on load):
  * Total Devices (GET /api/device → count)
  * Enabled Devices (filter isEnabled=true)
  * Active Tags (GET /api/tags → filter isActive=true count)
  * Active Storage Flows (GET /api/storage-flow → filter isActive=true count)
- 2-col middle section:
  * Left: Device list (DeviceCard widgets, protocol badge, status from SignalR)
  * Right: TrendChart — live tag values from useDeviceData hook (SignalR)
- Bottom: AuditLogs table (last 10 entries from GET /api/audit-logs? if available)
- SignalR ConnectionStatus indicator in topbar
```

### DevicesPage

```
- Toolbar: search by name + filter by protocol (ProtocolType enum) + filter by isEnabled
- Responsive grid of DeviceCard widgets
- Each DeviceCard shows: name, protocol badge, enabled toggle indicator,
  polling interval, tag count (from tags endpoint), last seen (SignalR)
- Click card → navigate to /devices/:id
- Empty state with empty-devices.svg illustration
- Data: GET /api/device
```

### DeviceDetailPage

```
- PageHeader: device name + protocol badge + enable/disable toggle button
- Tabs: Overview | Tags | Connection Config | History
- Overview tab: connection config fields displayed (parsed from connectionConfigJson)
  with Test Connection button → POST /api/device/test-http-connection (for HTTP devices)
- Tags tab: table of tags for this device (GET /api/tags/device/:deviceId)
  with live CurrentEngValue column updated via SignalR
- Connection Config tab: JSON viewer of connectionConfigJson
```

### TagsPage

```
- Toolbar: search by name/address + filter by deviceId (device Select) + filter by dataType
- TanStack Table (GET /api/tags) with columns:
  Name | Address | DataType | AccessMode | Unit | IsScaled | CurrentEngValue (live) | IsActive
- CurrentEngValue column: TagValueDisplay component, updates via tagStore (SignalR)
- Inline badge for AccessMode (Read=sky, Write=amber, ReadWrite=emerald)
- Click row → /tags/:id
```

### MasterTablesPage

```
- Table of master tables (GET /api/master-tables)
- Columns: Name | TableName | Description | IsActive | Field Count | Created
- Click row → /master-tables/:id (detail with fields sub-table)
- Create button → Modal with CreateMasterTableRequest form
```

### StorageFlowPage

```
- Table of storage flows (GET /api/storage-flow)
- Columns: Name | MasterTable | StorageInterval | IsActive | Devices count | Mappings count
- Each row: DataFlowIndicator widget showing active/inactive animation state
- Click row → /storage-flow/:id
- Discover Fields button (for selected flow) → POST /api/storage-flow/discover-fields
```

### AuditLogsPage

```
- Filterable table: filter by action, entityType, userId, date range
- Columns: Timestamp | User | Action | EntityType | EntityId | Status | IP
- OldValues/NewValues shown in expandable row or side drawer (JSON diff view)
- Status: Success (emerald badge) | Failure (rose badge)
- Data: GET /api/audit-logs (if endpoint exists — wrap in optional check)
```

### SettingsPage

```
- Tabs: Appearance | Profile | System
- Appearance tab: ThemeToggle (segmented variant, all 3 modes)
- Profile tab: current user info (from useAuth), change password form
- System tab: file upload config (GET /api/file/config) displayed as read-only info
```

---

## ⚙️ CODE QUALITY REQUIREMENTS

### TypeScript

- `strict: true` in tsconfig
- No `any` types — use `unknown` + type guards where needed
- All API responses typed against `@types/api.d.ts` contracts
- All Zustand stores fully typed with interface definitions
- Path aliases configured in `vite.config.ts` and `tsconfig.json`:
  ```
  @/* → src/*
  @types/* → src/@types/*
  @api/* → src/api/*
  @components/* → src/components/*
  @hooks/* → src/hooks/*
  @pages/* → src/pages/*
  @stores/* → src/stores/*
  @providers/* → src/providers/*
  @utils/* → src/utils/*
  @validators/* → src/validators/*
  @themes/* → src/themes/*
  @styles/* → src/styles/*
  ```

### Biome Configuration (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "useImportType": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  }
}
```

### Code Conventions

- All components: named exports (no default exports except route pages)
- All component files: PascalCase, co-located with `.types.ts` if needed
- All hooks: camelCase prefixed with `use`
- All stores: camelCase suffixed with `Store` (e.g. `authStore`, `deviceStore`)
- Barrel exports: every folder has `index.ts`
- No barrel exports in `pages/` (React.lazy requires direct path imports)
- CSS: Tailwind classes only, no inline styles except for dynamic CSS var values
- Comments: JSDoc on all exported interfaces, hooks, and utility functions

---

## 🚀 VITE CONFIGURATION (`vite.config.ts`)

```typescript
// Required config:
// - @tailwindcss/vite plugin
// - @vitejs/plugin-react plugin
// - Path aliases (all @/* → src/* aliases listed above)
// - Build optimization: manual chunks for vendor, recharts, signalr
// - Dev server proxy:
//   '/api' → VITE_API_BASE_URL (http://localhost:5009/api)
//   '/signalr' → http://localhost:5009/signalr  (WebSocket upgrade supported)
//   '/uploads' → http://localhost:5009/uploads  (file assets)
// - Source maps: true in development
// - Server: port 3000
```

---

## 📝 EXECUTION INSTRUCTIONS FOR CODEX

When executing this prompt, follow this order:

1. **Setup Phase**: Generate `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `biome.json`, `.env.example`, `.env.development`
2. **Types Phase**: Generate all files in `src/@types/` — `entities.d.ts`, `enums.d.ts`, `api.d.ts`, `signalr.d.ts`, `index.d.ts`
3. **Styles Phase**: Generate `globals.css` (full dark + light CSS var blocks), `animations.css`, `typography.css`
4. **Theme System**: Generate `stores/themeStore.ts`, `providers/ThemeProvider.tsx`, `hooks/useTheme.ts`, `hooks/useChartTheme.ts`, `components/ui/ThemeToggle/`
5. **API Layer**: Generate `api/client.ts` (Axios + interceptors + ENDPOINTS), all `api/*.api.ts` files
6. **Stores**: Generate all Zustand stores in `src/stores/`
7. **Providers + Hooks**: Generate `providers/` (AppProvider, AuthProvider, SignalRProvider), then all `hooks/`
8. **Design System**: Generate `components/skeleton/` first, then `components/ui/` (all components), then `components/widgets/`
9. **Layouts + Templates**: Generate `components/layout/`, then `templates/`
10. **Routes**: Generate `routes/` (router, guards, LazyPage, paths)
11. **Pages**: Generate all pages in `pages/` with realistic implementations
12. **Final**: Generate `themes/`, `utils/`, `validators/`, and `README.md`

### Per-File Requirements

- Every file must be complete and runnable — no `// TODO: implement` stubs
- Every import must use path aliases (`@api/`, `@components/`, `@hooks/`, etc.)
- Every component must handle loading (skeleton), error (Alert/ErrorBoundary), and empty (EmptyState) states
- All API calls use TanStack Query (`useQuery` / `useMutation`)
- All form submissions use `react-hook-form` + Zod schema from `validators/`
- All entity types reference `@types/entities.d.ts` — never redefine inline

---

## 🔖 BRAND ASSETS NOTES

### Logo (generate as SVG)

- **Synapse IIoT** wordmark + icon
- Icon concept: neural node (circle) with industrial connection lines radiating outward, suggesting both synaptic connections and industrial data pathways
- Colors: `#00D4FF` primary with `#0D1117` background
- Variations: full horizontal lockup + icon-only mark
- Must render cleanly at 32px height (sidebar collapsed icon) and 120px width (full)

---

_End of Prompt — Synapse IIoT Boilerplate v1.2 (+ DB Schema Alignment + Image-based Folder Structure)_
_Generated for GPT-5.2 Codex execution_
