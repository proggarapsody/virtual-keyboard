import { zipSync, strToU8 } from 'fflate'
import { assetIds, designSchema, type Design, type Asset } from '../design/model'
import { checkTotal, limits } from '../design/media-policy'
import { manifestSchema, notices, mediaHash } from './package-schema'
export async function exportDesign(design: Design, assets: Asset[]) {
  designSchema.parse(design)
  const needed = assetIds(design).map(id => { const asset = assets.find(a => a.id === id); if (!asset) throw new Error(`Missing media: ${id}. Export stopped without changing the design.`); return asset })
  checkTotal(needed.map(a => a.blob.size))
  const metadata = await Promise.all(needed.map(async ({ id, name, type, duration, blob }) => ({ id, name, type, sha256: await mediaHash(await blob.arrayBuffer()), ...(duration ? { duration } : {}) })))
  const manifest = manifestSchema.parse({ format: 'keyboard-artist', version: 1, design, assets: metadata })
  const files: Record<string, Uint8Array> = { 'manifest.json': strToU8(JSON.stringify(manifest)), 'NOTICES.txt': strToU8(notices) }
  for (const asset of needed) files[`media/${asset.id}`] = new Uint8Array(await asset.blob.arrayBuffer())
  if (Object.values(files).reduce((sum, b) => sum + b.length, 0) > limits.archiveBytes) throw new Error('Expanded export exceeds 32 MiB.')
  const bytes = zipSync(files, { level: 0 })
  if (bytes.byteLength > limits.archiveBytes) throw new Error('Export exceeds 32 MiB.')
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/zip' })
}
