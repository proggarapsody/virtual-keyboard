import { describe, expect, it } from 'vitest'
import { zipSync, strToU8 } from 'fflate'
import { readArchive } from './import-design'
import { exportDesign } from './export-design'
import { preset } from '../design/presets'
describe('bounded portable files', () => {
  it('rejects damaged, traversal, future version and expanded overflow', () => {
    expect(() => readArchive(new Uint8Array([1, 2]))).toThrow()
    expect(() => readArchive(zipSync({ '../manifest.json': strToU8('{}') }))).toThrow(/unsafe/)
    const compressed = zipSync({ 'media/overflow': new Uint8Array(33 * 1024 ** 2) })
    expect(() => readArchive(compressed)).toThrow(/size limit/)
    const valid = zipSync({ 'manifest.json': strToU8('{}') })
    expect(() => readArchive(valid.subarray(0, valid.length - 10))).toThrow(/incomplete/)
  })
  it('exports only required self-contained assets and rejects missing assets', async () => {
    const d = preset()
    await expect(exportDesign(d, [])).rejects.toThrow(/Missing media/)
    const assets = ['mechanical', 'release'].map(id => ({ id, name: id, type: 'audio/wav', blob: new Blob(['bytes']), duration: .12 }))
    const file = await exportDesign(d, assets)
    const files = readArchive(new Uint8Array(await file.arrayBuffer()))
    expect([...files.keys()].sort()).toEqual(['NOTICES.txt', 'manifest.json', 'media/mechanical', 'media/release'])
    expect(new TextDecoder().decode(files.get('manifest.json'))).not.toMatch(/scratch|mute|history/)
  })
})
