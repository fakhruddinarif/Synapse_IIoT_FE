# Synapse IIoT — Arsitektur Frontend

Stack: **React 19 + Vite + TypeScript + Tailwind v4 + react-router-dom v7 +
Zustand + Axios + react-hook-form/zod + i18next + SignalR**.

SPA murni, tanpa SSR. Panel ini dilayani sebagai berkas statis dari perangkat
gateway di jaringan pabrik; tidak ada mesin rendernya, dan seluruh data realtime
memang hanya bisa dikerjakan di sisi klien.

---

## 1. LAPISAN

```
src/
  config/      Konstanta lingkungan & aplikasi (env, app, menu)
  types/       Bentuk data + helper murni (tanpa React, tanpa I/O)
  lib/         Adaptor infrastruktur (axios, signalr, apiError, utils)
  services/    Satu fungsi per endpoint; membuka envelope backend
  store/       State global Zustand (auth, theme, language, ui, realtime)
  hooks/       Perekat state ↔ service untuk komponen
  components/
    ui/        Kit generik, tak tahu domain
    layout/    Chrome aplikasi (AppLayout, Sidebar, Header, Aurora, …)
  pages/
    <fitur>/<Fitur>Page.tsx
    <fitur>/components/…   Komponen milik fitur itu saja
  router/      Definisi rute + guard
  i18n/        Inisialisasi i18next + locales/{id,en}.json
```

**Aturan arah ketergantungan** — hanya boleh mengalir ke bawah:

```
pages → hooks → services → lib → (axios/signalr)
  ↘ components/ui        ↘ types
  ↘ store
```

Yang dilarang, beserta alasannya:

| Larangan | Alasan |
|---|---|
| Komponen mengimpor `lib/axios` | Menyebar bentuk envelope backend ke seluruh UI; satu perubahan API jadi puluhan perubahan komponen |
| Service mengimpor React / store | Service harus bisa dipanggil dari mana pun, termasuk dari service lain |
| `components/ui` mengimpor `types/device` dkk. | Kit generik harus tetap bisa dipakai untuk domain apa pun |
| Halaman mengimpor komponen dari halaman lain | Kalau dibutuhkan dua halaman, tempatnya `components/`, bukan disalin |
| Hex warna di komponen | Token ada di `index.css`; lihat `tokens.md` |

---

## 2. KONTRAK BACKEND (Synapse_IIoT_BE)

### Envelope

Setiap respons dibungkus `Core/DTOs/ApiResponse.cs`:

```json
{ "status": 200, "message": "…", "data": …, "paging": { … }, "error": null }
```

`paging` bernama **`paging`** (bukan `pagingInfo`) dan berisi
`{ size, page, totalPage, totalItem }` — **`totalPage`/`totalItem` tunggal**,
bukan `totalPages`/`totalRecords`. Kesalahan nama inilah yang membuat paginasi
di FE lama diam-diam selalu berhenti di satu halaman.

Envelope dibuka di `services/adapters.ts` (`unwrapList`, `unwrapOne`). Komponen
tidak boleh melihat `ApiResponse` sama sekali.

### Enum = string

`Api/Program.cs` memasang `JsonStringEnumConverter`, jadi `Protocol.HTTP` sampai
sebagai `"HTTP"`. Semua enum di `types/` adalah union string. Kode lama
membandingkannya dengan angka (`protocol === 4`) sehingga tidak ada cabang
protokol yang pernah cocok.

### Endpoint mana yang dipaginasi server

| Endpoint | Filter server | Paging server |
|---|---|---|
| `GET /api/device` | ✓ (`DeviceFilterDto`) | ✓ |
| `GET /api/tags` | ✓ (`TagFilterDto`, param `searchTerm`) | ✓ |
| `GET /api/master-tables` | ✗ | ✗ — seluruh daftar |
| `GET /api/storage-flow` | ✗ | ✗ — seluruh daftar |

Dua yang terakhir dipaginasi **di klien** (`useMasterTables`, `useStorageFlows`)
karena controllernya memang tidak menerima query params. Itu pilihan sadar:
jumlah tabel/flow pada satu gateway ada di orde puluhan. Kalau kelak tumbuh,
yang perlu berubah hanya hook-nya — halaman sudah bicara dalam istilah `Paging`
yang sama.

### Autentikasi — cookie HTTP-only

Login memasang cookie `JWT-TOKEN` (HttpOnly, umur 1 jam). Konsekuensi yang
mengikat seluruh FE:

1. `withCredentials: true` di setiap request (`lib/axios.ts`), kalau tidak semua
   endpoint `[Authorize]` menjawab 401.
2. **Tidak ada** header `Authorization` dan tidak ada token di localStorage —
   tidak ada token yang bisa dibaca JavaScript, dan itu justru tujuannya.
3. Store hanya menyimpan **profil** untuk tampilan. Kebenaran sesi selalu
   ditanyakan ke `GET /api/auth/info` (`useSessionCheck`), yang dijalankan
   `ProtectedRoute` setiap kali halaman terproteksi dibuka.
4. Hanya **401** yang berarti sesi tidak valid. Gateway restart atau jaringan
   berkedip tidak boleh memaksa logout.
5. Backend harus mendaftarkan origin FE secara eksplisit di policy
   `AllowFrontend` — `AllowCredentials` tidak bisa dipadukan dengan wildcard.
6. `POST /api/auth/register` **tidak** memasang cookie. Setelah registrasi,
   arahkan ke halaman login, jangan taruh profil ke store.

### Realtime (SignalR)

Hub: `{VITE_API_URL}/signalr/device-hub`, event `ReceiveDeviceData`, metode
`SubscribeToDevice` / `UnsubscribeFromDevice`.

`lib/signalr.ts` memegang **satu** koneksi untuk seluruh tab, dengan pencacah
pelanggan per `deviceId`. Sebelumnya setiap komponen membangun koneksinya
sendiri, sehingga membuka dua dialog berarti dua WebSocket, dan menutup salah
satunya memutus stream yang masih dipakai yang lain.

- Grup hub hilang saat koneksi terputus; `onreconnected` mendaftarkan ulang
  semua langganan yang masih dipegang komponen.
- `useDeviceStream(deviceId, enabled)` untuk langganan per-komponen;
  `useHubConnection()` sekali di `AppLayout` untuk indikator di header.
- **Tanpa ref guard "sudah subscribe"** — guard seperti itu bertabrakan dengan
  StrictMode dan membuat stream mati permanen setelah efek dijalankan dua kali.
- Buffer realtime tinggal di `store/realtime.store.ts`, terpisah dari data
  domain: pembacaan masuk beberapa kali per detik, dan menyatukannya berarti
  setiap pembacaan me-render ulang seluruh tabel perangkat.

---

## 3. POLA

### Service

Satu fungsi per endpoint, bukan objek berisi metode. Named export membuat
tree-shaking bekerja dan impornya jelas di tempat pemakaian:

```ts
import * as deviceService from '@/services/device.service'
```

Parameter kosong **dibuang**, bukan dikirim sebagai string kosong — `?search=`
membuat backend memfilter dengan pola kosong alih-alih mengabaikan filternya.

### Hook data

Mengembalikan bentuk yang seragam: `{ items, paging, loading, error, goToPage,
refetch }`. Berganti filter selalu mengembalikan halaman ke 1 — total sudah
spesifik ke filter itu, dan operator di halaman 4 akan mendarat di halaman kosong.

### Form

`react-hook-form` + `zodResolver`. Skema dibangun di dalam `useMemo([t])` supaya
pesan validasinya ikut berpindah bahasa; skema modul-level akan mengunci pesannya
ke bahasa saat modul pertama dievaluasi.

Untuk input numerik: `z.number()` + `register('x', { valueAsNumber: true })`.
`z.coerce.number()` membuat tipe input skema menjadi `unknown` dan generic
react-hook-form tidak lagi cocok.

Form direset **saat modal dibuka**, bukan saat ditutup — modal tetap ter-mount di
antara pembukaan, dan tanpa itu mengklik "Ubah" pada baris lain menampilkan nilai
baris sebelumnya sekejap.

### Error

`lib/apiError.ts` menormalkan `{ message, error }` (string atau array) menjadi
satu pesan. `isNetworkError` dibedakan dari kegagalan validasi: "gateway tidak
terhubung" dan "input salah" menuntut tindakan yang berbeda dari operator.

- Kegagalan aksi sekali jalan (hapus, simpan) → `toast.error`.
- Kegagalan yang perlu dibaca sambil memperbaiki input → banner inline.
- Kegagalan memuat daftar → banner di dalam kartu + tombol "Coba Lagi".

### i18n

Semua teks lewat `t()`. Kunci menganut `<area>.<hal>`
(`devices.deleteBody`, `flows.mappingDuplicate`). `id.json` adalah acuan;
`en.json` wajib punya kunci yang sama. Label menu di `config/menu.ts` menyimpan
**kunci**, bukan teks.

### Otorisasi UI

`useCanWrite()` (ADMIN/ENGINEER) dan `useCanDelete()` (ADMIN) menentukan
munculnya tombol aksi. UI tidak menawarkan tombol yang pasti ditolak backend.
`RoleGuard` menolak di tempat dengan pesan, bukan mengalihkan diam-diam — tautan
yang dibagikan rekan berhak lebih tidak boleh terlihat seperti tautan rusak.

---

## 4. LINGKUNGAN

```
VITE_API_URL=http://localhost:5009   # tanpa /api — hub berada di luar prefix itu
```

`config/env.ts` menurunkan `API_URL` (`{base}/api`) dan `HUB_URL`
(`{base}/signalr/device-hub`) dari satu variabel, supaya keduanya tidak bisa
menunjuk host yang berbeda.

Nilai `VITE_*` tertanam saat build, bukan dibaca saat runtime — image Docker
menerimanya lewat `ARG VITE_API_URL`.

---

## 5. PERINTAH

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | `tsc` + build produksi ke `dist/` |
| `npm run typecheck` | Hanya `tsc --noEmit` |
| `npm run preview` | Menyajikan `dist/` |
| `docker build --build-arg VITE_API_URL=… .` | Image nginx statis |
