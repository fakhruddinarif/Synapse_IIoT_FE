# Synapse IIoT Core

## Description

Menjadi platform Industrial IoT Gateway dan Mini-SCADA modern yang menjembatani kesenjangan antara perangkat keras pabrik (OT Layer) dengan sistem manajemen data (IT Layer) secara real-time, aman, dan fleksibel.

## User Personas

- **System Integrator / OT Engineer**: Bertanggung jawab melakukan konfigurasi mesin, mapping alamat memori (Tag), mengatur rentang konversi nilai (Scaling), dan membuat Storage Flows.
- **Plant Operator**: Memantau dashboard produksi secara real-time, melihat status online/offline mesin, dan menganalisis grafik Historian.
- **IT/Security Manager**: Bertanggung jawab atas keamanan jaringan dan memonitor Audit Trails.

## System Architecture & Tech Stack

Sistem menggunakan arsitektur Decoupled Hybrid yang memisahkan beban baca (Fast Loop) dan beban tulis (Slow Loop).

- **Frontend (UI/UX)**: React.js (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Zustand (State Management)
- **Backend (Core Engine)**: ASP.NET Core 8 Web API
- **Real-time Engine**: ASP.NET Core SignalR (WebSockets) dengan topologi Pub/Sub Groups
- **Database (Config & User Tables)**: MySQL 8.0
- **Database (Historian)**: InfluxDB

## Detailed Functional Requirements

### Modul 1: Security & Authentication Layer

Fondasi keamanan untuk mencegah akses tidak sah ke kontrol infrastruktur kritis.

| Fitur          | Deskripsi Teknis                                                                     |
| -------------- | ------------------------------------------------------------------------------------ |
| Login          | Mendukung Login Lokal (Bcrypt Hashing)                                               |
| Register       | Mendukung register pengguna hanya untuk SUPERADMIN                                   |
| Secure Session | Menggunakan JWT Token yang disimpan eksklusif di HTTP-Only Cookie (Anti-XSS)         |
| Anti-CSRF      | Endpoint mutasi data (POST/PUT/DEL) dilindungi oleh validasi X-CSRF-TOKEN header     |
| Rate Limiting  | Proteksi Brute-Force bawaan .NET (Maksimal 5 request per menit untuk endpoint Login) |

### Modul 2: OT Connectivity / Device Manager

Mesin komunikasi dengan perangkat keras fisik di lapangan.

| Fitur                 | Deskripsi Teknis                                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multi-Protocol Driver | Mendukung Modbus TCP, Modbus RTU, MQTT Client, OPC UA, dan HTTP REST Poller                                                                                                                          |
| Dynamic JSON Config   | Parameter koneksi (IP, Port, Topic, Baud Rate) disimpan fleksibel dalam kolom `ConnectionConfigJson` di MySQL                                                                                        |
| In-Memory Registry    | Singleton Service di RAM untuk mendaftarkan device aktif, memungkinkan penambahan mesin baru tanpa restart aplikasi                                                                                  |
| Dual Watchdog Status  | Logika penentuan status Online/Offline: 1. **Modbus**: Berdasarkan sukses/gagal ping TCP/Serial (Active). 2. **MQTT**: Berdasarkan kedaluwarsa interval penerimaan pesan terakhir (Passive Watchdog) |

### Modul 3: Tag Engine & Data Normalization

Penerjemah data mentah mesin menjadi parameter operasional.

| Fitur                      | Deskripsi Teknis                                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tag Addressing             | Manajemen mapping memori mesin (misal: 40001 untuk Modbus, topic/sensor1 untuk MQTT)                                                                                 |
| Linear Scaling             | Konversi otomatis dari nilai perangkat keras (Raw: 0-4095) ke satuan ukur manusia (Engineering Unit: 0-100 °C)                                                       |
| The Fast Loop (RAM Buffer) | Worker Service menyimpan nilai real-time terakhir dari seluruh Tag ke dalam RAM (ConcurrentDictionary) untuk menghilangkan latensi saat diakses oleh UI atau Storage |

### Modul 4: Data Engine & Storage

Pengelola alur penyimpanan data ke database untuk keperluan historis dan reporting.

| Fitur                         | Deskripsi Teknis                                                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic Tables                | Fitur bagi pengguna untuk membuat tabel fisik MySQL secara dinamis via UI (tanpa coding) untuk laporan spesifik (misal: "Log Oven B")                |
| Storage Flows (The Slow Loop) | Aturan ETL internal. Mengambil nilai dari RAM Buffer setiap Interval tertentu (misal: 60 detik) dan melakukan INSERT ke Dynamic Tables atau InfluxDB |
| Historian Charting            | Visualisasi data masa lalu menggunakan grafik garis time-series yang interaktif (Zoom, Pan, Filter tanggal)                                          |

### Modul 5: Real-Time Dashboard

Antarmuka visual responsif bagi operator.

| Fitur            | Deskripsi Teknis                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| SignalR Pub/Sub  | UI hanya akan men-subscribe (masuk ke Group SignalR) data mesin yang sedang ditampilkan di layar untuk menghemat bandwidth |
| Widget Library   | Komponen UI SCADA: Gauge, Value Card, Sparkline Chart, Status Lamp                                                         |
| Live Device Grid | Tabel paginasi manajemen Device yang menampilkan indikator status (Hijau/Merah) dan pesan error secara real-time           |

## Non-Functional Requirements (NFR)

- Performance (Latency): Dashboard harus mampu merender update untuk 50 Widget sekaligus dengan latensi dari PLC ke layar di bawah 200ms.

- Scalability: Backend Worker (The Fast Loop) harus sanggup melakukan siklus baca untuk minimum 5.000 Tags setiap 1 detik tanpa memory leak.

- Reliability (Auto-Recovery): Driver komunikasi (Modbus/MQTT) wajib memiliki fitur Auto-Reconnect dengan exponential backoff jika jaringan pabrik terputus sementara.

- Decoupling: Kerusakan atau antrean panjang pada database (Slow Loop) tidak boleh menyebabkan pembacaan sensor (Fast Loop) dan tampilan Dashboard menjadi lag atau macet.
