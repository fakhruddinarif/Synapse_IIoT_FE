/**
 * Penanda field wajib. Dipisah jadi komponen supaya bentuk dan warnanya sama
 * di label bawaan `Input`/`Select` maupun di label yang ditulis manual untuk
 * grup kontrol (mis. rentang penskalaan tag yang punya empat input).
 *
 * `aria-hidden` karena kewajiban field sudah disampaikan atribut `required` ke
 * pembaca layar — tanpa ini bintangnya ikut dibacakan sebagai "asterisk".
 */
export function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-error-500">
      *
    </span>
  )
}
