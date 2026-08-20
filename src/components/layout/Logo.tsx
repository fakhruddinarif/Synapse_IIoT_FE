interface LogoProps {
  className?: string
}

/**
 * Mark Synapse: tiga simpul OT di kiri yang bertemu di satu simpul gateway,
 * lalu satu jalur keluar ke lapisan IT — bentuk platformnya sendiri.
 *
 * Digambar sebagai SVG inline, bukan berkas gambar, karena tiga alasan yang
 * semuanya penting untuk aplikasi yang berjalan di jaringan lokal terisolasi:
 * tidak ada request tambahan, warnanya mengikuti token brand (jadi ikut berubah
 * bila palet berubah), dan tetap tajam di layar 4K ruang kontrol maupun di
 * favicon 16px.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Synapse"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" className="fill-brand-500" />
      {/* Jalur OT → gateway */}
      <path
        d="M11 12.5 L20.5 20 M11 20 L20.5 20 M11 27.5 L20.5 20"
        className="stroke-brand-200"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Jalur gateway → IT */}
      <path
        d="M20.5 20 L29.5 20"
        className="stroke-white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="11" cy="12.5" r="2.4" className="fill-brand-200" />
      <circle cx="11" cy="20" r="2.4" className="fill-brand-200" />
      <circle cx="11" cy="27.5" r="2.4" className="fill-brand-200" />
      <circle cx="20.5" cy="20" r="3.6" className="fill-white" />
      <circle cx="29.5" cy="20" r="2.8" className="fill-brand-100" />
    </svg>
  )
}
