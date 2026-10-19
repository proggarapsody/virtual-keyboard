import { limits } from '../design/media-policy'
export function audioType(bytes: Uint8Array) {
  const head = String.fromCharCode(...bytes.slice(0, 12))
  if (head.startsWith('RIFF') && head.slice(8) === 'WAVE') return 'audio/wav'
  if (head.startsWith('OggS')) return 'audio/ogg'
  if (
    head.startsWith('ID3') ||
    (bytes[0] === 255 && (bytes[1]! & 0xe0) === 0xe0)
  )
    return 'audio/mpeg'
  throw new Error('Choose a valid WAV, MP3 or Ogg sample.')
}
export async function decodeSample(blob: Blob) {
  if (!blob.size || blob.size > limits.audioBytes)
    throw new Error('Audio sources must be at most 4 MiB.')
  const bytes = await blob.arrayBuffer(),
    type = audioType(new Uint8Array(bytes))
  // Read media metadata before allocating full PCM for compressed sources.
  const url = URL.createObjectURL(new Blob([bytes], { type }))
  const media = document.createElement('audio')
  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(new Error('Audio metadata could not load. Try a WAV source.')),
        5000,
      )
      media.onloadedmetadata = () => {
        clearTimeout(timer)
        resolve(media.duration)
      }
      media.onerror = () => {
        clearTimeout(timer)
        reject(new Error('Audio format cannot be decoded by this browser.'))
      }
      media.preload = 'metadata'
      media.src = url
    })
    if (!Number.isFinite(duration) || duration > limits.duration + 0.001)
      throw new Error('Audio sources must be at most 10 seconds.')
  } finally {
    media.removeAttribute('src')
    media.load()
    URL.revokeObjectURL(url)
  }
  const context = new OfflineAudioContext(2, 1, 48000)
  const buffer = await context.decodeAudioData(bytes)
  if (
    buffer.duration > limits.duration ||
    buffer.numberOfChannels > 2 ||
    buffer.length * buffer.numberOfChannels * 4 > limits.decodedSample
  )
    throw new Error(
      'Sample exceeds 10 seconds, stereo, or 8 MiB decoded audio.',
    )
  return { buffer, type }
}
