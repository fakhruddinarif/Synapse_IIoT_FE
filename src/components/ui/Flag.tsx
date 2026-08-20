import { useId } from 'react'

interface FlagProps {
  className?: string
}

/** Bendera Indonesia — merah di atas putih, rasio asli 2:3. */
export function FlagID({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 3 2"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="3" height="1" fill="#CE1126" />
      <rect y="1" width="3" height="1" fill="#FFFFFF" />
    </svg>
  )
}

/**
 * Union Jack. Digambar pada rasio aslinya 1:2 lalu dipotong `slice` alih-alih
 * ditarik, supaya sudut saltire-nya tetap benar di dalam chip yang lebih
 * persegi. Diagonal merahnya butuh clip path, dan id-nya harus unik per
 * instance — dua bendera di satu halaman akan saling merujuk clip yang salah.
 */
export function FlagGB({ className }: FlagProps) {
  const clipId = `uk-saltire-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clipId})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}
