export function chooseSample(
  length: number,
  previous: number | undefined,
  random = Math.random,
) {
  if (!length) return -1
  if (length === 1) return 0
  const available = Array.from({ length }, (_, i) => i).filter(
    (i) => i !== previous,
  )
  return available[
    Math.min(available.length - 1, Math.floor(random() * available.length))
  ]!
}
