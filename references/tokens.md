# Synapse IIoT — Design Tokens

Satu-satunya sumber kebenaran untuk primitif visual. Semuanya didefinisikan di
`src/index.css` sebagai `@theme` Tailwind v4 — **jangan menulis hex di komponen.**

---

## 0. BRAND: ROSE (hue 345°)

Diturunkan dari `#FFD6E0` yang diminta sebagai warna primary. Karena warna itu
adalah permukaan yang sangat terang, ia menempati `brand-200`, dan aksi memakai
`brand-500`.

| Step | Hex | Peran | Kontras vs putih |
|---|---|---|---|
| 50 | `#FFF5F8` | Latar paling lembut, baris tabel terpilih | — |
| 100 | `#FFE9EE` | Badge brand, hover nav, tombol `subtle` | — |
| 200 | **`#FFD6E0`** | **Jangkar permukaan (warna primary yang diminta)** — gradasi chrome, ring, tekstur | 1.3:1 ✗ jangan untuk teks putih |
| 300 | `#F3A3BC` | Ikon dekoratif, empty-state, garis chart sekunder | — |
| 400 | `#E06889` | Bar chart, aksen hover | — |
| 500 | **`#C43B65`** | **AKSI** — tombol utama, nav aktif, ring fokus | **5.05:1 ✓** |
| 600 | `#A82F55` | Hover tombol utama, tautan | 6.6:1 ✓ |
| 700 | `#8A2645` | Teks di atas `brand-100` | 8.6:1 ✓ |
| 800 | `#6B1D35` | Teks di atas `brand-200` | — |
| 900 | `#4C1526` | Teks paling gelap, shadow tint | — |
| 950 | `#2E0C17` | Backdrop modal (`brand-950/40`) | — |

**Aturan:** teks putih hanya boleh di atas `brand-500` ke atas. Di atas
`brand-100`/`200`, teks memakai `brand-700`/`800`.

### Aksen — biru (lapisan IT)

| Step | Hex | Peran |
|---|---|---|
| 50 | `#EEF6FF` | Badge tabel/kolom |
| 100 | `#D9EAFF` | Ring simpul IT di diagram |
| 300 | `#8CC2F7` | Garis chart |
| 500 | `#2F7ED8` | Ikon tabel, deret chart kedua |
| 600 | `#1F63B0` | Teks aksen |

Aksen **bukan** warna aksi. Tidak ada tombol biru di aplikasi ini.

### Netral

`gray-50 #FAFAFA` · `100 #F5F5F5` · `200 #E5E5E5` · `300 #D4D4D4` ·
`400 #A3A3A3` · `500 #737373` · `600 #525252` · `700 #404040` ·
`800 #262626` · `900 #171717` · `950 #0A0A0A`

Latar body: `#FFFFFF` (terang) / `#0A0A0A` (gelap). Teks: `gray-900` / `gray-100`.

### Status

| Warna | 50 | 400 | 500 | 600 | Arti di Synapse |
|---|---|---|---|---|---|
| Hijau | `#F0FDF4` | `#4ADE80` | `#16A34A` | `#15803D` | Mengirim data, flow aktif, tabel aktif |
| Amber | `#FFFBEB` | `#FBBF24` | `#D97706` | `#B45309` | Aktif tapi belum ada data, peringatan konfigurasi |
| Merah | `#FEF2F2` | `#F87171` | `#DC2626` | `#B91C1C` | Gagal baca, gateway terputus, aksi hapus |
| Biru info | `#EFF6FF` | `#60A5FA` | `#3B82F6` | `#2563EB` | Informasi netral |

---

## 1. GRADASI CHROME

Variabel per tema, dipakai lewat utility `bg-chrome-*`:

```
--chrome-sidebar   terang: #FFF0F4 → #FFF8FA → #FFFFFF (180deg)
                   gelap : #2A0F1A → #1A0910 → #0A0A0A (180deg)
--chrome-header    terang: #FFF2F6 → #FFF9FB → #FFFFFF (90deg)
                   gelap : #2A0F1A → #1A0910 → #0A0A0A (90deg)
--chrome-content   terang: #FFFFFF → #FFF8FA → #FFEEF3 (158deg)
                   gelap : #0A0A0A → #150810 → #290F1A (158deg)
--chrome-line      terang: #F6DBE3   gelap: #3D1826
--chrome-line-soft terang: #FBEAEF   gelap: #2A1019
```

Ujung terang selalu putih dan ujung gelap selalu near-black: itulah yang menjaga
kontras teks aman berapa pun dalamnya tint rose di ujung lain.

Garis chrome dipakai lewat `border-chrome` / `border-chrome-soft` — bukan
`border-gray-200`, supaya batas antar area chrome menyatu dengan gradasinya.

---

## 2. AURORA MESH (latar beranimasi)

Komponen: `src/components/layout/AuroraBackdrop.tsx`. Empat simpul gradien radial
ber-`blur-3xl` + satu sapuan cahaya + tekstur grid.

| Simpul | Variabel | Terang | Gelap | Animasi |
|---|---|---|---|---|
| 1 (kiri atas) | `--aurora-1` | `#FFD6E0` 85% | `#C43B65` 30% | `aurora-a` 34s |
| 2 (bawah tengah) | `--aurora-2` | `#FFE9EE` 90% | `#6B1D35` 42% | `aurora-c` 58s |
| 3 (kanan atas) | `--aurora-3` | `#F3A3BC` 42% | `#E06889` 16% | `aurora-b` 46s |
| 4 (kanan bawah, IT) | `--aurora-4` | `#D9EAFF` 50% | `#2F7ED8` 16% | `aurora-b` 46s |
| Sapuan | `--aurora-sweep` | putih 50% | `#FFD6E0` 6% | `aurora-sweep` 26s linear |
| Grid | `--grid-line` | rose 4.5% | rose 5% | statis, di-mask memudar |

Periode sengaja tidak berkelipatan (34/46/58) supaya pertemuan warnanya tidak
pernah berulang persis. Yang dianimasikan **hanya `transform` dan `opacity`** —
keduanya ditangani compositor tanpa reflow, jadi grafik realtime tetap mulus.

Varian: `variant="page"` (grid 36px, opacity 90%) untuk kanvas aplikasi;
`variant="auth"` (grid 48px, opacity 100%) untuk login/registrasi/404.

---

## 3. TIPOGRAFI

```
font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
```

| Token | Ukuran | Bobot | Pemakaian |
|---|---|---|---|
| Page title | 20px | 600 | `PageHeader` |
| Section | 14px | 600 | `CardHeader`, judul panel |
| Body | 14px | 400 | Isi tabel, label |
| Caption | 12px | 400 | Hint, meta, footer |
| Stat | 30px | 600 + `tnum` | `StatCard` |
| Mono | 13px | 400 | URL, topik MQTT, JSONPath, nama kolom, alamat tag |

Kelas `.tnum` (`font-variant-numeric: tabular-nums`) wajib untuk setiap angka
yang berubah karena data masuk.

---

## 4. SPASI, RADIUS, SHADOW

Spasi: kelipatan 4px. Gutter grid 16px. Padding halaman 16px (mobile) / 24px.

| Radius | Nilai |
|---|---|
| `--radius-card` | 10px |
| `--radius-button` | 8px |
| `--radius-input` | 8px |
| `--radius-modal` | 14px |
| `--radius-pill` | 999px |

| Shadow | Nilai | Pemakaian |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgb(76 21 38 / .06)` | Kartu |
| `--shadow-dropdown` | `0 4px 14px rgb(76 21 38 / .10)` | Dropdown, popover, hover kartu |
| `--shadow-modal` | `0 14px 40px rgb(76 21 38 / .16)` | Modal, drawer |

Shadow bernuansa rose (bukan hitam netral) supaya menyatu dengan kanvas bergradasi.

---

## 5. MOTION

| Animasi | Durasi | Kapan |
|---|---|---|
`aurora-a/b/c` | 34s / 46s / 58s | Latar chrome, selalu |
`aurora-sweep` | 26s linear | Latar chrome, selalu |
`status-pulse` | 2s | HANYA saat perangkat mengirim / flow aktif / hub terhubung |
`flow-dash` | 1.2s linear | HANYA saat ada flow aktif di diagram pipeline |
Transisi warna | 150–200ms | Hover, fokus, nav aktif |
Transisi lebar sidebar | 200ms | Ciut/perluas |

Semua animasi di atas dimatikan blok `@media (prefers-reduced-motion: reduce)`.

---

## 6. KONTRAS YANG SUDAH DIVERIFIKASI

| Kombinasi | Rasio | Status |
|---|---|---|
| Putih di atas `brand-500` | 5.05:1 | ✓ AA teks normal |
| Putih di atas `brand-600` | 6.6:1 | ✓ AA |
| `brand-700` di atas `brand-100` | 7.4:1 | ✓ AAA |
| `gray-900` di atas `#FFD6E0` | 12.9:1 | ✓ AAA |
| Putih di atas `#FFD6E0` | 1.3:1 | ✗ **dilarang** |
| `gray-500` di atas putih | 4.6:1 | ✓ AA (caption) |
