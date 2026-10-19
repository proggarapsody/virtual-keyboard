export const limits = {
  audioBytes: 4 * 1024 ** 2,
  imageBytes: 8 * 1024 ** 2,
  duration: 10,
  decodedSample: 8 * 1024 ** 2,
  designBytes: 24 * 1024 ** 2,
  assets: 64,
  archiveBytes: 32 * 1024 ** 2,
  entries: 96,
  manifestBytes: 512 * 1024,
  imageDimension: 4096,
  imagePixels: 16 * 1024 ** 2,
  voices: 32,
  decodedCache: 64 * 1024 ** 2,
}
export const mediaHelp =
  'Audio: WAV, MP3 or Ogg, up to 4 MiB / 10 seconds / stereo. Images: static PNG or JPEG, up to 8 MiB / 4096 px. Design: 24 MiB source / 64 MiB decoded sound / 64 assets.'
export function checkTotal(sizes: number[], decoded: number[] = []) {
  if (
    sizes.length > limits.assets ||
    sizes.reduce((a, b) => a + b, 0) > limits.designBytes
  )
    throw new Error(
      'Design media exceeds 24 MiB or 64 assets. Remove an assignment/background, or start another design.',
    )
  if (decoded.reduce((a, b) => a + b, 0) > limits.decodedCache)
    throw new Error(
      'Design sound exceeds 64 MiB decoded audio. Use shorter samples or fewer sources.',
    )
}
export function imageHeader(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (
    bytes.length >= 24 &&
    bytes[0] === 137 &&
    String.fromCharCode(...bytes.slice(1, 4)) === 'PNG'
  ) {
    let offset = 8
    while (offset + 12 <= bytes.length) {
      const size = view.getUint32(offset),
        type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8))
      if (type === 'acTL')
        throw new Error('Animated backgrounds are not supported.')
      offset += size + 12
    }
    return {
      width: view.getUint32(16),
      height: view.getUint32(20),
      type: 'image/png',
    }
  }
  if (bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 255) break
      const marker = bytes[offset + 1]!
      if (marker === 0xd9 || marker === 0xda) break
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2
        continue
      }
      const size = view.getUint16(offset + 2)
      if ([0xc0, 0xc1, 0xc2].includes(marker))
        return {
          width: view.getUint16(offset + 7),
          height: view.getUint16(offset + 5),
          type: 'image/jpeg',
        }
      if (size < 2) break
      offset += 2 + size
    }
  }
  throw new Error('Choose a valid static PNG or JPEG image.')
}
export async function validateImage(blob: Blob) {
  if (!blob.size || blob.size > limits.imageBytes)
    throw new Error('Images must be at most 8 MiB.')
  const header = imageHeader(new Uint8Array(await blob.arrayBuffer()))
  if (
    !header.width ||
    !header.height ||
    header.width > limits.imageDimension ||
    header.height > limits.imageDimension ||
    header.width * header.height > limits.imagePixels
  )
    throw new Error(
      'Images must be at most 4096 px per side and 16 megapixels.',
    )
  const bitmap = await createImageBitmap(blob)
  const valid = bitmap.width === header.width && bitmap.height === header.height
  bitmap.close()
  if (!valid) throw new Error('Image dimensions do not match the file header.')
  return header.type
}
