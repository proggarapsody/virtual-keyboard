import { Unzip, UnzipInflate, strFromU8 } from 'fflate'
import { manifestSchema, mediaHash } from './package-schema'
import { assetIds, type Asset } from '../design/model'
import { checkTotal, limits, validateImage } from '../design/media-policy'
import { decodeSample } from '../audio/import-sample'
export function readArchive(bytes: Uint8Array) {
  if (!bytes.length || bytes.length > limits.archiveBytes) throw new Error('Design files must be at most 32 MiB.')
  // Require a complete ordinary ZIP end record; disallow trailing payloads/ZIP64.
  let complete = false
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50 && i + 22 + view.getUint16(i + 20, true) === bytes.length) { complete = true; break }
  }
  if (!complete) throw new Error('Damaged or incomplete design archive.')
  const files = new Map<string, Uint8Array>(), seen = new Set<string>(), pending = new Set<string>()
  let total = 0, failure: Error | undefined
  const unzip = new Unzip(file => {
    if (failure) return
    if (seen.has(file.name) || seen.size >= limits.entries || !/^(manifest\.json|NOTICES\.txt|media\/[a-zA-Z0-9-]{1,80})$/.test(file.name) || ![0, 8].includes(file.compression)) { failure = new Error('Invalid, duplicate, unsupported or unsafe archive entry.'); return }
    seen.add(file.name); pending.add(file.name)
    const chunks: Uint8Array[] = []; let length = 0
    file.ondata = (error, chunk, final) => {
      if (failure) return
      if (error) { failure = error; return }
      total += chunk.length; length += chunk.length
      if (total > limits.archiveBytes || file.name === 'manifest.json' && length > limits.manifestBytes) { failure = new Error('Expanded archive exceeds its safe size limit.'); file.terminate(); return }
      chunks.push(chunk)
      if (final) {
        const result = new Uint8Array(length); let offset = 0
        for (const c of chunks) { result.set(c, offset); offset += c.length }
        files.set(file.name, result); pending.delete(file.name)
      }
    }
    file.start()
  })
  unzip.register(UnzipInflate)
  for (let offset = 0; offset < bytes.length && !failure; offset += 65536) unzip.push(bytes.subarray(offset, offset + 65536), offset + 65536 >= bytes.length)
  if (failure) throw failure
  if (pending.size || !files.has('manifest.json')) throw new Error('Incomplete archive or missing manifest.')
  return files
}
export async function importDesign(file: Blob) {
  if (file.size > limits.archiveBytes) throw new Error('Design files must be at most 32 MiB.')
  const files = readArchive(new Uint8Array(await file.arrayBuffer()))
  let raw: unknown
  try { raw = JSON.parse(strFromU8(files.get('manifest.json')!)) } catch { throw new Error('The design manifest is damaged.') }
  const parsed = manifestSchema.safeParse(raw)
  if (!parsed.success) throw new Error('Invalid or unsupported design version/settings.')
  const manifest = parsed.data, ids = new Set(manifest.assets.map(a => a.id))
  if (ids.size !== manifest.assets.length || assetIds(manifest.design).some(id => !ids.has(id)) || manifest.assets.some(a => !assetIds(manifest.design).includes(a.id)) || [...files.keys()].some(path => path.startsWith('media/') && !ids.has(path.slice(6)))) throw new Error('Archive media references do not match the design.')
  checkTotal(manifest.assets.map(a => files.get(`media/${a.id}`)?.byteLength ?? 0))
  const assets: Asset[] = []
  // Re-identify every asset: imported IDs can never overwrite bytes used by existing designs/history.
  const replacements = new Map<string, string>()
  for (const meta of manifest.assets) {
    const bytes = files.get(`media/${meta.id}`)
    if (!bytes) throw new Error(`Missing media: ${meta.name}`)
    if (await mediaHash(bytes.buffer as ArrayBuffer) !== meta.sha256) throw new Error('Media checksum failed. The design file is damaged.')
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: meta.type })
    let duration: number | undefined, detected: string
    if (meta.type.startsWith('image/')) detected = await validateImage(blob)
    else { const result = await decodeSample(blob); detected = result.type; duration = result.buffer.duration }
    if (detected !== meta.type) throw new Error('Media content does not match its declared format.')
    const id = crypto.randomUUID(); replacements.set(meta.id, id)
    assets.push({ ...meta, id, blob, ...(duration ? { duration } : {}) })
  }
  const design = manifest.design
  for (const assignment of [design.sound.press, design.sound.release, ...Object.values(design.keys).flatMap(k => [k.press, k.release])]) {
    for (const clip of assignment?.pool ?? []) {
      const asset = assets.find(a => a.id === replacements.get(clip.asset))!
      if (!asset.type.startsWith('audio/') || !asset.duration || clip.end > asset.duration + .001) throw new Error('Invalid audio trim or assignment media type.')
      clip.asset = asset.id
    }
  }
  if (design.background) {
    const id = replacements.get(design.background.asset)!
    if (!assets.find(a => a.id === id)!.type.startsWith('image/')) throw new Error('Background requires image media.')
    design.background.asset = id
  }
  design.id = crypto.randomUUID(); design.revision = 0
  return { design, assets }
}
