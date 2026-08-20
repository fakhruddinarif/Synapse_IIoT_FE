import { useEffect } from 'react'
import { connectHub, subscribeDevice, unsubscribeDevice } from '@/lib/signalr'
import { useDeviceHistory, useRealtimeStore } from '@/store/realtime.store'
import type { DeviceReading } from '@/types/device'

/**
 * Berlangganan stream realtime satu perangkat selama komponen hidup.
 *
 * Tidak memakai ref guard "sudah pernah subscribe": guard seperti itu
 * bertabrakan dengan StrictMode — efek jalan, cleanup melepas langganan, efek
 * jalan lagi lalu langsung return karena guard sudah menyala, dan streamnya
 * berakhir mati permanen. Yang menjaga agar hub tidak kebanjiran perintah
 * adalah pencacah pelanggan di `lib/signalr`, bukan guard di sini.
 */
export function useDeviceStream(deviceId: string | undefined, enabled = true): {
  connected: boolean
  history: DeviceReading[]
  latest: DeviceReading | undefined
} {
  const connected = useRealtimeStore((s) => s.connected)
  const history = useDeviceHistory(enabled ? deviceId : undefined)

  useEffect(() => {
    if (!enabled || !deviceId) return

    void subscribeDevice(deviceId)
    return () => {
      void unsubscribeDevice(deviceId)
    }
  }, [deviceId, enabled])

  return { connected, history, latest: history.at(-1) }
}

/** Menyalakan koneksi hub sekali di akar aplikasi. Dipisahkan dari langganan
 *  per-perangkat supaya indikator "gateway terhubung" di header tetap benar
 *  walau tidak ada satu pun kartu perangkat yang terbuka. */
export function useHubConnection() {
  useEffect(() => {
    void connectHub().catch(() => {
      // Backend belum menyala. `withAutomaticReconnect` tidak berlaku untuk
      // percobaan pertama yang gagal, jadi biarkan indikator menunjukkan
      // terputus — pemuatan halaman berikutnya akan mencoba lagi.
    })
  }, [])

  return useRealtimeStore((s) => s.connected)
}
