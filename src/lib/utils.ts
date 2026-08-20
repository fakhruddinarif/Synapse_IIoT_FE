import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'
import { id as localeId, enUS } from 'date-fns/locale'
import i18n from '@/i18n'

function activeLocale() {
  return i18n.language?.startsWith('en') ? enUS : localeId
}

export function formatDateTime(value: string | undefined | null, fmt = 'dd/MM/yyyy HH:mm:ss'): string {
  if (!value) return '-'
  try {
    return format(parseISO(value), fmt, { locale: activeLocale() })
  } catch {
    return value
  }
}

/** "3 menit lalu" — dipakai kolom "terakhir terlihat" pada daftar perangkat. */
export function formatRelative(value: string | undefined | null): string {
  if (!value) return '-'
  try {
    return formatDistanceToNowStrict(parseISO(value), {
      addSuffix: true,
      locale: activeLocale(),
    })
  } catch {
    return value
  }
}

export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Interval polling/simpan selalu dalam milidetik di API. Manusia membacanya
 *  dalam detik, jadi tampilkan keduanya secara konsisten. */
export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1)} s`
}

/** Nilai yang bisa digambar pada grafik garis. String angka ikut lolos karena
 *  perangkat MQTT sering mengirim `"23.4"`, bukan `23.4`. */
export function asChartNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
