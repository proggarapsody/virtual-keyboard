import { describe, expect, it } from 'vitest'
import { zipSync, strToU8 } from 'fflate'
import { readArchive } from './import-design'
import { exportDesign } from './export-design'
import { preset } from '../design/presets'
describe('bounded portable files', () => {
  it('rejects damaged, traversal, future version and expanded overflow', () => {
    expect(() => readArchive(new Uint8Array([1, 2]))).toThrow()
    expect(() =>
      readArchive(zipSync({ '../manifest.json': strToU8('{}') })),
    ).toThrow(/unsafe/)
    const compressed = zipSync({
      'media/overflow': new Uint8Array(33 * 1024 ** 2),
    })
    expect(() => readArchive(compressed)).toThrow(/size limit/)
    const valid = zipSync({ 'manifest.json': strToU8('{}') })
    expect(() => readArchive(valid.subarray(0, valid.length - 10))).toThrow(
      /incomplete/,
    )
  })
  it('exports only required self-contained assets and rejects missing assets', async () => {
    const d = preset()
    await expect(exportDesign(d, [])).rejects.toThrow(/Missing media/)
    const assets = ['mechanical', 'release'].map((id) => ({
      id,
      name: id,
      type: 'audio/wav',
      blob: new Blob(['bytes']),
      duration: 0.12,
    }))
    const file = await exportDesign(d, assets)
    const files = readArchive(new Uint8Array(await file.arrayBuffer()))
    expect([...files.keys()].sort()).toEqual([
      'NOTICES.txt',
      'manifest.json',
      'media/mechanical',
      'media/release',
    ])
    expect(new TextDecoder().decode(files.get('manifest.json'))).not.toMatch(
      /scratch|mute|history/,
    )
  })
})
it('rejects future manifests before media decoding and detects duplicate local entries', async () => {
  const { importDesign } = await import('./import-design')
  await expect(
    importDesign(
      new Blob([
        zipSync({
          'manifest.json': strToU8(
            JSON.stringify({ format: 'keyboard-artist', version: 99 }),
          ),
        }).buffer as ArrayBuffer,
      ]),
    ),
  ).rejects.toThrow(/unsupported/)
  // Make two same-length local names collide without relying on an object map that deduplicates them.
  const archive = zipSync(
    {
      'manifest.json': strToU8('{}'),
      'NOTICES.txt': strToU8('notice'),
      'media/abc': strToU8('one'),
      'media/def': strToU8('two'),
    },
    { level: 0 },
  )
  const text = new TextDecoder('latin1').decode(archive)
  const offset = text.indexOf('media/def')
  archive.set(strToU8('media/abc'), offset)
  expect(() => readArchive(archive)).toThrow(/duplicate/)
})
