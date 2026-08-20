# Synapse IIoT — Frontend

Panel untuk **Synapse IIoT**: gateway Industrial IoT dan mini-SCADA yang
menjembatani perangkat lapangan (lapisan OT) dengan sistem pengelolaan data
(lapisan IT) secara realtime, aman, dan fleksibel.

SPA React yang dilayani sebagai berkas statis dari perangkat gateway — tanpa SSR,
tanpa aset eksternal, jadi tetap berfungsi penuh di jaringan pabrik yang
terisolasi dari internet.

---

## Stack

| Bagian | Pilihan |
|---|---|
| UI | React 19 + TypeScript, Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme`), kit komponen sendiri |
| Routing | react-router-dom v7 (`createBrowserRouter` + `lazy`) |
| State | Zustand (auth, tema, bahasa, UI, buffer realtime) |
| Data | Axios + service per endpoint |
| Form | react-hook-form + zod |
| Realtime | `@microsoft/signalr` (satu koneksi hub per tab) |
| i18n | i18next (Indonesia + Inggris) |
| Chart | recharts |
| Ikon | `@remixicon/react` |

---

## Menjalankan

```bash
cp .env.example .env      # arahkan VITE_API_URL ke backend
npm install
npm run dev               # http://localhost:5173
```

Backend (`Synapse_IIoT_BE`) harus berjalan dan **mendaftarkan origin frontend**
di policy CORS `AllowFrontend` (`Api/Program.cs`) — sesi memakai cookie
HTTP-only, dan `AllowCredentials` tidak bisa dipadukan dengan wildcard origin.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + build ke `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint — aturan `react-hooks` menangkap dependency array efek langganan yang salah |
| `npm run preview` | Menyajikan hasil build |

### Docker

```bash
docker build --build-arg VITE_API_URL=http://gateway.local:5009 -t synapse-fe .
docker run -p 8080:80 synapse-fe
```

Image-nya nginx statis dengan fallback SPA. Nilai `VITE_*` tertanam saat build,
bukan dibaca saat runtime — jadi ia harus diberikan sebagai build arg.

---

## Struktur

```
src/
  config/      env, app, menu (kunci i18n + ikon + role)
  types/       Bentuk data + helper murni
  lib/         axios, signalr, apiError, utils
  services/    Satu fungsi per endpoint + adapters (pembuka envelope)
  store/       Zustand: auth, theme, language, ui, realtime
  hooks/       useDevices, useTags, useMasterTables, useStorageFlows,
               useDeviceStream, useSessionCheck, useFullscreen, …
  components/
    ui/        Kit generik (Button, Input, Table, Modal, …)
    layout/    AppLayout, Sidebar, Header, Breadcrumb, AuroraBackdrop, Logo
  pages/       dashboard · devices · tags · tables · storage-flows ·
               login · register · not-found
  router/      Rute + ProtectedRoute/RoleGuard
  i18n/        locales/{id,en}.json
```

Aturan lapisan, kontrak backend, dan pola form/error dijelaskan di
[`references/architecture.md`](references/architecture.md).

---

## Menu

| Rute | Halaman | Isi |
|---|---|---|
| `/` | Dasbor | Statistik, diagram alur OT→IT, status perangkat dari stream, sebaran protokol |
| `/connectivity/devices` | Perangkat | CRUD perangkat per protokol (HTTP, MQTT), uji koneksi, detail + grafik realtime |
| `/connectivity/tags` | Tag Manager | Titik ukur per perangkat beserta penskalaan raw → satuan teknis |
| `/data-engine/tables` | Tabel Dinamis | Skema tabel tujuan + pengelolaan kolom |
| `/data-engine/storage-flows` | Storage Flow | Pemetaan path data perangkat ke kolom tabel, berjalan berkala |

Seluruh rute berada di balik satu `ProtectedRoute`. Aksi tulis butuh role
ADMIN/ENGINEER, aksi hapus hanya ADMIN.

---

## Desain

Warna primary adalah rose `#FFD6E0` sebagai **permukaan**, dengan `#C43B65`
sebagai warna **aksi** dari hue yang sama — pastelnya tetap terasa tanpa
mengorbankan kontras teks. Latar chrome memakai gradasi aurora beranimasi
(`AuroraBackdrop`) yang berhenti otomatis pada `prefers-reduced-motion`;
kontrol selalu rata.

Rinciannya: [`SKILL.md`](SKILL.md) · [`references/tokens.md`](references/tokens.md) ·
[`references/components.md`](references/components.md)
