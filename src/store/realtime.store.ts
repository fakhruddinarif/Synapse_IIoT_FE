import { create } from 'zustand'
import { REALTIME_WINDOW } from '@/config/app'
import type { DeviceReading } from '@/types/device'

interface RealtimeState {
  connected: boolean
  /** Riwayat pembacaan per deviceId, FIFO sepanjang `REALTIME_WINDOW`. */
  readings: Record<string, DeviceReading[]>
  setConnected: (connected: boolean) => void
  pushReading: (reading: DeviceReading) => void
  clearDevice: (deviceId: string) => void
  clearAll: () => void
}

/**
 * Buffer realtime dipisahkan dari store domain (device/tag) dengan sengaja:
 * data ini berubah beberapa kali per detik, sementara daftar perangkat hampir
 * tidak pernah berubah. Menyatukannya berarti setiap pembacaan yang masuk
 * membatalkan selector daftar perangkat, dan seluruh tabel dirender ulang tiap
 * kali satu sensor mengirim angka baru.
 */
export const useRealtimeStore = create<RealtimeState>()((set) => ({
  connected: false,
  readings: {},

  setConnected: (connected) => set({ connected }),

  pushReading: (reading) =>
    set((state) => {
      const history = state.readings[reading.deviceId] ?? []
      return {
        readings: {
          ...state.readings,
          [reading.deviceId]: [...history, reading].slice(-REALTIME_WINDOW),
        },
      }
    }),

  clearDevice: (deviceId) =>
    set((state) => {
      const { [deviceId]: _dropped, ...rest } = state.readings
      return { readings: rest }
    }),

  clearAll: () => set({ readings: {} }),
}))

/** Pembacaan terakhir sebuah perangkat, atau `undefined` kalau belum ada. */
export function useLatestReading(deviceId: string | undefined): DeviceReading | undefined {
  return useRealtimeStore((s) => (deviceId ? s.readings[deviceId]?.at(-1) : undefined))
}

export function useDeviceHistory(deviceId: string | undefined): DeviceReading[] {
  return useRealtimeStore((s) => (deviceId ? (s.readings[deviceId] ?? EMPTY) : EMPTY))
}

/** Referensi stabil — mengembalikan `[]` literal dari selector akan membuat
 *  zustand menganggap nilainya selalu berubah dan merender tanpa henti. */
const EMPTY: DeviceReading[] = []
