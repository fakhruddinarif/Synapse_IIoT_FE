import { useEffect, useState } from 'react'

/** Menunda pembaruan nilai sampai `delay` ms tanpa perubahan lagi — supaya
 *  input pencarian tidak memicu satu request per ketikan. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
