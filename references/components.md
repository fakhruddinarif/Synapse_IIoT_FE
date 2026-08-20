# Synapse IIoT — Spesifikasi Komponen

Semua komponen ada di `src/components/ui` (kit generik) dan
`src/components/layout` (chrome aplikasi). Tanpa Radix, tanpa shadcn — kit ini
ditulis sendiri supaya bundelnya kecil dan perilakunya bisa dijelaskan seluruhnya.

Impor lewat barrel: `import { Button, Input, Table } from '@/components/ui'`.

---

## 1. FORM

### Button — `variant` × `size`

| Variant | Tampilan | Kapan |
|---|---|---|
| `primary` | `bg-brand-500` + teks putih | Satu aksi utama per layar/modal |
| `secondary` | Border + permukaan putih | Batal, muat ulang, aksi netral |
| `subtle` | `bg-brand-100` + teks `brand-700` | Aksi sekunder yang masih bagian alur utama (Tambah Mapping, Tambah Kolom) |
| `ghost` | Transparan | Aksi ikon di baris tabel/kartu |
| `danger` | `bg-error-600` | Hapus, dan hanya itu |

Size: `sm` (32px) · `md` (40px, default) · `lg` (48px) · `icon` (36×36).

Props: `isLoading` (menampilkan spinner dan menonaktifkan), `leftIcon`,
`rightIcon`. `type` default `button` — sengaja, supaya tombol di dalam form tidak
menjadi submit tak terduga.

**Tombol submit di footer modal** memakai `type="submit" form="<id-form>"`.
Footer berada di luar `<form>`, dan tanpa atribut `form` ia harus memanggil
`handleSubmit` sendiri — yang membuat Enter di dalam form melakukan submit dua kali.

### Input / Textarea / Select

Semua menerima `label`, `hint`, `error`, `required`, `isFullWidth`.
`Input`/`Textarea` juga menerima `mono` untuk teks teknis (URL, JSONPath, topik,
nama kolom) — lebar tetap membuat kesalahan satu karakter terlihat.

- Label wajib memakai `RequiredMark` lewat prop `required`, bukan mengetik `*`.
- `error` mengganti `hint`; keduanya tidak pernah tampil bersamaan.
- `Select` memakai `<select>` native. Di layar sentuh dan keyboard, kontrol
  native memberi pencarian-ketik dan penempatan popup yang benar secara gratis.
- `Select.options[].disabled` untuk pilihan yang masih terlihat tapi tak boleh
  dipilih (mis. tabel nonaktif pada storage flow baru).

### Checkbox vs Switch

| | Kapan |
|---|---|
| `Checkbox` | Memilih dari himpunan (perangkat sumber, field chart), atau flag di dalam baris |
| `Switch` | Sakelar berdampak: mengaktifkan perangkat (worker mulai polling), mengaktifkan flow (data mulai ditulis), mengaktifkan tabel |

`Switch` menerima `label` + `description`; deskripsinya menjelaskan **akibat**
menyalakannya, bukan mengulangi labelnya.

---

## 2. DATA

### Table — berbasis definisi kolom

```tsx
const columns: TableColumn<Device>[] = [
  { key: 'name', header: t('common.name'), render: (row) => … },
  { key: 'createdAt', header: …, hideBelow: 'xl', render: … },
  { key: 'actions', header: …, align: 'right', width: '110px', render: … },
]
<Table columns={columns} data={rows} keyExtractor={(r) => r.id} isLoading={loading} emptyState={<EmptyState … />} />
```

Kolom adalah satu sumber untuk header, skeleton, dan sel. Menulis `<thead>`
skeleton terpisah dari `<thead>` data adalah cara termudah membuat keduanya
menyimpang, dan itu pernah terjadi di kode lama.

- `hideBelow: 'sm' | 'md' | 'lg' | 'xl'` untuk kolom sekunder.
- `isLoading` merender skeleton dengan jumlah kolom yang sama.
- Kolom aksi selalu terakhir, `align: 'right'`, ikon `Button variant="ghost" size="icon"`
  dibungkus `Tooltip`.

### Pagination

Menerima objek `Paging` backend (`{ page, size, totalPage, totalItem }`) dan
`onPageChange`. Menampilkan jendela tiga nomor yang bergeser di dekat akhir, plus
lompatan ke halaman terakhir. Mengembalikan `null` saat `totalItem === 0` —
paginasi di atas daftar kosong hanya derau.

### Badge

`variant`: `success` `warning` `error` `info` `neutral` `brand` `accent`.
`dot` menambah titik status; `pulse` menambah denyut **hanya** untuk keadaan yang
sungguh hidup. `mono` untuk nilai teknis pendek.

### EmptyState / Skeleton

`EmptyState` selalu punya `title`; `description` menjelaskan langkah berikutnya,
dan `actionLabel` hanya diisi kalau pengguna memang berhak melakukannya.

`SkeletonStats`, `SkeletonCards`, `SkeletonText` — bentuk keadaan memuat harus
sama dengan bentuk hasilnya, kalau tidak layout melompat saat data tiba.

---

## 3. OVERLAY

### Modal

`size`: `sm` (konfirmasi) · `md` · `lg` (form) · `xl` (form storage flow, detail
perangkat + chart).

Struktur: kepala (judul + deskripsi + tombol tutup) — isi yang menggulir — footer
aksi. `max-h-[92vh]` dengan kolom flex: kepala dan footer tetap terlihat, hanya
isinya yang menggulir. Tombol Simpan tidak boleh pernah terdorong ke bawah lipatan.

`dismissable={false}` untuk alur yang tak boleh ditinggalkan setengah jalan.

### ConfirmDialog

Wajib untuk setiap aksi destruktif. Deskripsinya menyebut **nama objek** dan
**akibatnya** ("flow berhenti menulis, data yang sudah tersimpan tetap ada"),
bukan sekadar "Anda yakin?". `danger` untuk hapus.

### Offcanvas / Popover / Tooltip / Dropdown

- `Offcanvas` — drawer sidebar di bawah `md`; `bare` agar anaknya punya
  permukaannya sendiri. Panel tetap ter-mount di luar layar dengan `inert`
  supaya bisa meluncur tanpa masuk urutan tab saat tertutup.
- `Popover` — flyout hover untuk rail sidebar. Panelnya `fixed` dan dijepit ke
  viewport; panel absolut akan terpotong oleh `overflow` sidebar.
- `Tooltip` — label ikon. Delay 400ms; jangan dipakai untuk informasi yang
  dibutuhkan untuk mengambil keputusan.
- `Dropdown` — menu user di header. Menutup sendiri saat item dipilih.

---

## 4. CHROME

### Sidebar

Tiga mode: penuh 256px, rail ikon 72px, drawer (mobile). Latar
`bg-chrome-sidebar`, batas `border-chrome`.

- Baris aktif: `bg-brand-500` + teks putih + shadow rose tipis.
- Grup dengan anak membuka/menutup inline, dan **membuka sendiri** saat rute
  aktif berada di dalamnya — membuka URL dalam langsung tidak boleh menampilkan
  sidebar dengan semua grup tertutup.
- Di mode rail, hover ikon memunculkan flyout berisi nama grup + sub-itemnya.
- Ikon: varian `Line` saat pasif, `Fill` saat aktif (`menu.ts`).

### Header

Kiri: hamburger (rail di desktop, drawer di mobile) + `Breadcrumb`.
Kanan: **status hub** → bahasa → tema → layar penuh → menu user.

Status hub berada di chrome, bukan di halaman, karena artinya sama di setiap
halaman: kalau terputus, semua angka yang terlihat adalah data terakhir yang
diketahui, bukan keadaan sekarang.

### Breadcrumb

Dibangun dari `config/menu.ts`, bukan dari segmen path mentah — dengan segmen
mentah, crumb menampilkan `storage-flows` dan tidak pernah ikut berganti bahasa.

### PageHeader

Judul + deskripsi + **satu** aksi utama. Kalau sebuah halaman terasa butuh tiga
tombol di sini, yang dibutuhkan adalah menu, bukan header yang lebih lebar.

### AuroraBackdrop

Wajib `relative` pada induk dan `relative z-10` pada semua anak chrome. Elemen
berposisi selalu tergambar di atas yang tidak; tanpa penanda itu sidebar akan
tertimbun lapisan hias.

---

## 5. WIDGET DASHBOARD

| Komponen | Aturan |
|---|---|
| `StatCard` | Label uppercase 12px, nilai 30px `tnum`, hint 12px, ikon dalam kotak `tone`. `tone`: `brand` (OT), `success` (hidup), `accent` (IT), `warning` (flow) |
| `PipelinePanel` | Tiga simpul: perangkat (rose) → gateway (logo) → tabel (biru). Garis putus-putus hanya beranimasi saat benar-benar ada aliran |
| `DeviceStatusPanel` | Status diturunkan dari stream, bukan dari kolom database: `paused` (tidak `isEnabled`), `streaming` (ada pembacaan), `idle` (aktif tapi diam) |
| `ProtocolSpreadPanel` | Batang berbanding, bukan pie — mata membandingkan panjang jauh lebih akurat daripada sudut |

### Chart (recharts)

- Deret maksimal 4; warna dari `SERIES_COLORS` dengan urutan tetap supaya field
  yang sama tidak berganti warna setiap dialog dibuka.
- `isAnimationActive={false}` untuk data realtime — transisi garis membuat setiap
  titik baru tampak melompat alih-alih bertambah.
- Warna aksis/grid mengikuti tema aktif dari `useThemeStore`.
- Hanya field numerik yang boleh dipilih; string numerik (`"23.4"` dari MQTT)
  ikut lolos lewat `asChartNumber`.
