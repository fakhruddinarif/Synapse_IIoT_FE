---
name: synapse-design
description: "Design system + arsitektur frontend Synapse IIoT — Industrial IoT Gateway & Mini-SCADA. Gunakan skill ini untuk SEMUA pekerjaan UI dan penataan kode di Synapse_IIoT_FE (React 19 + Vite + Tailwind v4 + react-router-dom)."
version: 2.0.0
allowed-tools: [Read, Write, Edit, Glob, Grep]
---

# Synapse IIoT — Design System & Arsitektur

Anda membangun panel untuk **gateway IIoT + mini-SCADA**: jembatan realtime antara
perangkat lapangan (lapisan OT) dan sistem pengelolaan data (lapisan IT). Setiap
keputusan UI mengikuti bahasa di dokumen ini.

**Sebelum mulai:** baca `references/tokens.md` untuk token warna/tipografi/motion,
`references/components.md` untuk spesifikasi komponen, dan
`references/architecture.md` untuk aturan lapisan kode. Font sepenuhnya sistem —
tidak ada pemuatan font eksternal, karena gateway dilayani dari jaringan lokal
yang bisa saja tanpa akses internet.

---

## 1. FILOSOFI

Synapse dipakai di ruang kontrol dan lantai produksi: dibaca cepat, sering dari
jarak satu meter, kadang sambil berdiri. Antarmukanya **teknis, tenang, dan
presisi** — bukan dekoratif.

Dua lapisan yang dijembatani sistem ini adalah pembagian utama seluruh UI:

| Lapisan | Isi | Warna penanda |
|---|---|---|
| **OT** (Operational Technology) | Perangkat, tag, protokol, polling | rose brand (`brand-*`) |
| **IT** (Information Technology) | Tabel dinamis, kolom, penyimpanan | biru aksen (`accent-*`) |
| **Gateway** | Storage flow yang menyambungkan keduanya | rose penuh (`brand-500`) |

Rose `#FFD6E0` adalah **permukaan**, bukan aksi. Luminansinya ~0.75, jadi teks
putih di atasnya hanya 1.3:1 — gagal total. Ia dipakai sebagai jangkar tint
(`brand-200`) untuk kanvas, badge, dan gradasi chrome. Warna **aksi** adalah
`brand-500` = `#C43B65`, satu hue yang sama, dengan 5.05:1 terhadap teks putih.
Satu hue, dua peran.

Kanvas boleh bergradasi dan beranimasi; **kontrol tidak pernah**. Itulah yang
membuat tombol, kartu, dan input terbaca sebagai lapisan di atas latar, bukan
bagian dari latar.

Garis keturunan: panel HMI industrial + dashboard admin modern (Linear, Vercel),
dengan latar aurora yang dipinjam dari perangkat lunak instrumentasi modern.

---

## 2. ATURAN KERAJINAN

**Satu typeface, dari sistem.** Inter kalau tersedia, lalu jatuh ke `system-ui`.
Hierarki datang dari ukuran dan bobot, bukan dari ganti font.

| Lapis | Ukuran | Bobot |
|---|---|---|
| Judul halaman | 20px | 600 |
| Judul kartu / section | 14px | 600 |
| Body / nilai tabel | 14px | 400 |
| Caption / meta | 12px | 400 |
| Angka besar (stat) | 30px | 600 + `tnum` |

**Angka telemetri wajib `tabular-nums`.** Nilai berubah beberapa kali per detik;
dengan angka proporsional lebarnya bergeser tiap pembaruan dan seluruh baris
bergoyang. Kelas `.tnum` ada untuk itu.

**Anggaran warna: satu rose, satu biru, tiga status.** Rose = aksi + lapisan OT.
Biru aksen = lapisan IT (khusus diagram, badge tabel, dan chart). Hijau/amber/
merah HANYA sebagai status sungguhan (mengirim / menunggu / gagal). Tanpa ungu,
tanpa emas, tanpa cyan.

**Gradasi hanya untuk chrome.** `bg-chrome-sidebar`, `bg-chrome-header`,
`bg-chrome-content`, dan `AuroraBackdrop`. Kartu, tombol, input, badge: rata.

**Gerakan harus punya sebab.** Aurora bergerak (34s/46s/58s, `transform` +
`opacity` saja). Denyut status hanya menyala ketika sesuatu benar-benar hidup —
perangkat mengirim data, flow aktif menulis. Garis aliran di diagram pipeline
hanya bergerak saat ada flow aktif. Animasi yang berjalan saat tidak ada apa-apa
yang terjadi adalah kebohongan visual. Semua tunduk pada
`prefers-reduced-motion`.

**Spasi grid 4px, gutter 16px.** Padding halaman 24px desktop, 16px mobile.

**Sudut industrial, bukan bulat lucu.** Kartu 10px, tombol/input 8px, modal 14px,
pill 999px.

**Uji juling.** Julingkan mata di layar mana pun: yang harus tersisa adalah satu
angka penting, satu status, dan satu tombol rose. Kalau yang terlihat adalah
festival warna, susun ulang.

---

## 3. ANTI-POLA

- **Tanpa typeface kedua.** Tanpa Google Fonts, tanpa ikon-font eksternal —
  ikon memakai `@remixicon/react` (SVG, tree-shakeable).
- **Tanpa gradasi pada kontrol.** Lihat §2.
- **Tanpa rose untuk elemen pasif.** Rose = aksi + nav aktif + lapisan OT.
- **Tanpa shadow berat.** `shadow-card` untuk kartu, `shadow-modal` maksimal.
- **Tanpa lebih dari dua warna kromatis per region.** Netral + rose + satu status.
- **Tanpa `window.confirm()` / `alert()`.** Keduanya memblokir thread UI, jadi
  grafik realtime membeku tepat saat operator mengambil keputusan. Pakai
  `ConfirmDialog`.
- **Tanpa banjir toast.** Sukses aksi = satu toast. Kegagalan yang perlu dibaca
  sambil memperbaiki input = banner inline, bukan toast yang hilang 4 detik.
- **Tanpa teks hitam murni.** Skala `gray-900/700/500`.
- **Tanpa GUID mentah di UI.** Selalu petakan ke nama; kalau nama tak tersedia,
  itu bug adapter, bukan alasan menampilkan UUID.
- **Tanpa animasi latar di area data.** Aurora hanya di chrome dan halaman auth.
- **Tanpa polling manual di komponen.** Data realtime datang dari SignalR lewat
  `useDeviceStream`; `setInterval` yang menembak API bukan realtime, itu beban.

---

## 4. BREAKPOINT

| Nama | Lebar | Perilaku |
|---|---|---|
| Mobile | 0–639 | Satu kolom, sidebar jadi drawer |
| Tablet | 640–1023 | Dua kolom, sidebar masih drawer |
| Desktop | 1024+ | Sidebar penuh atau rail, grid 3–4 kolom |

- Sidebar: penuh (256px) → rail ikon (72px) via tombol di header; di bawah `md`
  menjadi drawer melayang.
- Kartu statistik: 2 kolom mobile, 4 kolom desktop.
- Tabel: kolom sekunder disembunyikan lewat `hideBelow`, bukan dibiarkan
  memaksa scroll horizontal.
- Mode kios (`useFullscreen`): chrome hilang seluruhnya, hanya `FullscreenExit`
  yang tersisa.

---

## 5. ALUR KERJA

1. **Token dulu** — `references/tokens.md`. Jangan pernah menulis hex di komponen.
2. **Pakai komponen yang ada** — `src/components/ui`. Kalau butuh varian, tambah
   varian di komponennya, jangan menyalin kelasnya ke halaman.
3. **Patuhi lapisan** — `references/architecture.md`. Komponen tidak pernah
   memanggil `axios`; service tidak pernah menyentuh React.
4. **Cek hierarki** — uji juling (§2).
5. **Uji dua tema** — sakelar di header; keduanya harus terasa disengaja.
6. **Uji keadaan ekstrem** — kosong, memuat, gagal jaringan, gateway mati,
   nama perangkat 80 karakter, 1000 baris tabel.
7. **Uji `prefers-reduced-motion`** — semua animasi harus berhenti.

---

## 6. BERKAS REFERENSI

| Berkas | Isi |
|---|---|
| `references/tokens.md` | Warna (rose `#FFD6E0` → `#C43B65`, aksen, status), tipografi, spasi, radius, shadow, motion, gradasi chrome |
| `references/components.md` | Spesifikasi Button, Input, Select, Switch, Badge, Card, Table, Modal, Pagination, Sidebar, Header, StatCard, panel dashboard |
| `references/architecture.md` | Lapisan kode (config/lib/types/services/store/hooks/pages), kontrak API backend, aturan realtime, pola form |
