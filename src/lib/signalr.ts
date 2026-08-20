import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
} from '@microsoft/signalr'
import { HUB_URL } from '@/config/env'
import { useRealtimeStore } from '@/store/realtime.store'
import type { DeviceReading } from '@/types/device'

/**
 * Satu koneksi hub untuk seluruh aplikasi.
 *
 * Sebelumnya setiap komponen yang butuh data realtime membangun koneksinya
 * sendiri lewat hook, sehingga membuka dua dialog berarti dua WebSocket ke hub
 * yang sama — dan menutup salah satunya memutus stream yang masih dipakai yang
 * lain. Di sini koneksinya tunggal dan berumur selama tab hidup; yang
 * per-komponen hanyalah langganan grup per-perangkat.
 *
 * `withCredentials` wajib: hub berada di origin backend yang sama dengan API
 * dan diautentikasi cookie `JWT-TOKEN` yang sama.
 */
let connection: HubConnection | null = null
let starting: Promise<HubConnection> | null = null

/** Berapa banyak pelanggan aktif per deviceId. Grup di hub baru ditinggalkan
 *  setelah pelanggan terakhirnya pergi — kalau tidak, satu dialog yang ditutup
 *  akan membungkam kartu dashboard yang masih menampilkan perangkat itu. */
const subscribers = new Map<string, number>()

function build(): HubConnection {
  const conn = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      withCredentials: true,
      transport:
        HttpTransportType.WebSockets |
        HttpTransportType.ServerSentEvents |
        HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error)
    .build()

  const store = useRealtimeStore.getState()

  conn.on('ReceiveDeviceData', (reading: DeviceReading) => {
    useRealtimeStore.getState().pushReading(reading)
  })

  conn.onreconnecting(() => store.setConnected(false))
  conn.onreconnected(() => {
    store.setConnected(true)
    // Grup hilang saat koneksi terputus — daftarkan ulang semua langganan yang
    // masih dipegang komponen, kalau tidak stream-nya diam-diam tidak kembali.
    for (const deviceId of subscribers.keys()) {
      void conn.invoke('SubscribeToDevice', deviceId).catch(() => {})
    }
  })
  conn.onclose(() => store.setConnected(false))

  return conn
}

export async function connectHub(): Promise<HubConnection> {
  if (connection?.state === HubConnectionState.Connected) return connection
  if (starting) return starting

  connection ??= build()
  const conn = connection

  starting = conn
    .start()
    .then(() => {
      useRealtimeStore.getState().setConnected(true)
      return conn
    })
    .catch((error) => {
      useRealtimeStore.getState().setConnected(false)
      throw error
    })
    .finally(() => {
      starting = null
    })

  return starting
}

export async function subscribeDevice(deviceId: string): Promise<void> {
  subscribers.set(deviceId, (subscribers.get(deviceId) ?? 0) + 1)
  if (subscribers.get(deviceId) !== 1) return

  try {
    const conn = await connectHub()
    await conn.invoke('SubscribeToDevice', deviceId)
  } catch {
    // Gateway belum menyala. `onreconnected` akan mendaftarkan ulang saat
    // koneksinya berhasil, jadi kegagalan di sini tidak perlu melempar ke UI.
  }
}

export async function unsubscribeDevice(deviceId: string): Promise<void> {
  const next = (subscribers.get(deviceId) ?? 1) - 1
  if (next > 0) {
    subscribers.set(deviceId, next)
    return
  }

  subscribers.delete(deviceId)
  if (connection?.state !== HubConnectionState.Connected) return
  try {
    await connection.invoke('UnsubscribeFromDevice', deviceId)
  } catch {
    // Koneksi sudah tutup — grupnya ikut hilang dengan sendirinya.
  }
}

export async function disconnectHub(): Promise<void> {
  subscribers.clear()
  if (!connection) return
  try {
    await connection.stop()
  } finally {
    useRealtimeStore.getState().setConnected(false)
    connection = null
  }
}
