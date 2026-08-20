import { classNames } from '@/lib/utils'

interface AuroraBackdropProps {
  /** `page` untuk kanvas aplikasi, `auth` untuk halaman login/registrasi yang
   *  polanya boleh lebih tegas karena tidak ada data di atasnya. */
  variant?: 'page' | 'auth'
  className?: string
}

/**
 * Lapisan gradasi beranimasi di belakang chrome aplikasi.
 *
 * Kenapa elemen DOM sungguhan dan bukan pseudo-element pada kanvas:
 *
 *  - tiap simpul mesh punya periode animasi sendiri (34s/46s/58s) supaya
 *    pertemuan warnanya tidak pernah berulang persis. Satu pseudo-element hanya
 *    bisa menjalankan satu set keyframe untuk seluruh latarnya;
 *  - `pointer-events-none` + `aria-hidden` di satu tempat, jadi tidak ada
 *    kemungkinan lapisan hiasan mencuri klik atau ikut terbaca pembaca layar;
 *  - `blur-3xl` bekerja pada elemen, bukan pada background-image, dan itulah
 *    yang membuat tepi simpulnya lembut alih-alih terlihat sebagai lingkaran.
 *
 * Yang dianimasikan hanya `transform`/`opacity`, keduanya ditangani compositor.
 * Grafik realtime di atasnya tidak ikut terbebani, dan seluruh gerakan berhenti
 * di `prefers-reduced-motion` (lihat index.css).
 */
export function AuroraBackdrop({ variant = 'page', className }: AuroraBackdropProps) {
  const intensity = variant === 'auth' ? 'opacity-100' : 'opacity-90'

  return (
    <div
      aria-hidden
      className={classNames(
        'pointer-events-none absolute inset-0 overflow-hidden',
        intensity,
        className,
      )}
    >
      {/* Simpul mesh. Ukurannya melebihi viewport supaya driftnya tidak pernah
          menyingkap tepi lingkaran di sudut layar. */}
      <div
        className="animate-aurora-a absolute -left-[15%] -top-[20%] h-[70vh] w-[70vw] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--aurora-1) 0%, transparent 70%)' }}
      />
      <div
        className="animate-aurora-b absolute -right-[10%] -top-[10%] h-[60vh] w-[55vw] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--aurora-3) 0%, transparent 70%)' }}
      />
      <div
        className="animate-aurora-c absolute -bottom-[25%] left-[20%] h-[75vh] w-[75vw] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--aurora-2) 0%, transparent 68%)' }}
      />
      {/* Simpul biru — satu-satunya tempat aksen "lapisan IT" muncul sebagai
          warna latar, memberi arah dingin di sudut berlawanan dari rose. */}
      <div
        className="animate-aurora-b absolute -bottom-[15%] -right-[15%] h-[55vh] w-[50vw] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--aurora-4) 0%, transparent 70%)' }}
      />

      {/* Sapuan cahaya yang melintas pelan — memberi arah pada pola supaya tidak
          terbaca sebagai kumpulan noda statis. */}
      <div
        className="animate-aurora-sweep absolute inset-y-0 -left-1/3 w-1/3"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--aurora-sweep) 50%, transparent 100%)',
        }}
      />

      {/* Tekstur grid instrumentasi. Di-mask agar memudar ke tepi, kalau tidak
          garisnya bertabrakan dengan border kartu dan terlihat seperti cacat
          render. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: variant === 'auth' ? '48px 48px' : '36px 36px',
          maskImage: 'radial-gradient(120% 100% at 50% 0%, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, black 35%, transparent 85%)',
        }}
      />
    </div>
  )
}
