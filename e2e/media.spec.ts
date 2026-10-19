import { test, expect } from '@playwright/test'
import { resolve } from 'node:path'
const root = resolve('.')
test('uploads, trims, saves and exports self-contained media into a new context', async ({
  page,
  browser,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByText('Background image', { exact: true }).click()
  await page
    .getByLabel('Upload or replace image')
    .setInputFiles(`${root}/e2e/fixtures/background.png`)
  await expect(
    page.getByRole('button', { name: 'Remove background', exact: true }),
  ).toBeVisible()
  await page.getByText('Sound assignments', { exact: true }).click()
  await page
    .getByLabel('Upload audio sample')
    .setInputFiles(`${root}/public/sounds/tone.wav`)
  await expect(
    page.getByLabel('Trim end tone.wav', { exact: true }),
  ).toBeVisible()
  await page.getByLabel('Trim start tone.wav', { exact: true }).fill('0.01')
  await page.getByLabel('Trim start tone.wav', { exact: true }).press('Tab')
  await page.getByLabel('Trim end tone.wav', { exact: true }).fill('0.08')
  await page.getByLabel('Trim end tone.wav', { exact: true }).press('Tab')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.reload()
  await expect(page.locator('.canvas-background')).toHaveCSS(
    'background-image',
    /blob:/,
  )
  const download = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Export design', exact: true })
    .first()
    .click()
  const file = await download
  const path = await file.path()
  expect(path).toBeTruthy()
  const fresh = await browser.newContext()
  const other = await fresh.newPage()
  await other.goto('./')
  await expect(other.getByRole('status')).toHaveText('Saved')
  await other
    .getByLabel('Import design', { exact: true })
    .first()
    .setInputFiles(path!)
  await expect(other.locator('.canvas-background')).toBeVisible()
  await expect(other.locator('.library .design-item')).toHaveCount(2)
  await other.getByText('Sound assignments', { exact: true }).click()
  await expect(
    other.getByLabel('Trim start tone.wav', { exact: true }),
  ).toHaveValue('0.01')
  await expect(
    other.getByLabel('Trim end tone.wav', { exact: true }),
  ).toHaveValue('0.08')
  await other.reload()
  await expect(other.locator('.canvas-background')).toBeVisible()
  await fresh.close()
})
test('invalid image/audio/import keeps current work and exports remain available', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByText('Sound assignments', { exact: true }).click()
  await page.getByLabel('Upload audio sample').setInputFiles({
    name: 'bad.wav',
    mimeType: 'audio/wav',
    buffer: Buffer.from('no audio'),
  })
  await expect(page.getByRole('alert')).toContainText('valid WAV')
  await page
    .getByLabel('Import design', { exact: true })
    .first()
    .setInputFiles({
      name: 'bad.keyboard-artist',
      mimeType: 'application/zip',
      buffer: Buffer.from('bad'),
    })
  await expect(page.getByRole('alert')).toContainText(
    'Existing designs are unchanged',
  )
  await expect(page.locator('h1')).toHaveText('Tactile mechanical')
  await expect(page.locator('.library .design-item')).toHaveCount(1)
})
test('real Web Audio creates one press/release for repeats and concurrent sources', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = AudioBufferSourceNode.prototype.start
    const recorded: { count: number; rates: number[] } = { count: 0, rates: [] }
    Object.assign(window, { audioEvidence: recorded })
    AudioBufferSourceNode.prototype.start = function (
      ...args: Parameters<typeof original>
    ) {
      recorded.count++
      recorded.rates.push(this.playbackRate.value)
      return original.apply(this, args)
    }
  })
  await page.goto('./')
  await page.getByText('Sound assignments', { exact: true }).click()
  await page.getByLabel('Pitch (semitones)', { exact: true }).fill('12')
  await page.getByLabel('Pitch (semitones)', { exact: true }).press('Tab')
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Sound enabled', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  await page.getByRole('textbox', { name: 'Scratchpad' }).focus()
  await page.keyboard.down('KeyA')
  await page.keyboard.down('KeyA')
  await page.keyboard.down('KeyB')
  await page.keyboard.up('KeyA')
  await page.keyboard.up('KeyB')
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioEvidence: { count: number } })
            .audioEvidence.count,
      ),
    )
    .toBe(4)
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioEvidence: { rates: number[] } })
          .audioEvidence.rates,
    ),
  ).toEqual([2, 2, 1, 1])
  await page.getByRole('button', { name: 'Mute', exact: true }).click()
  await page.getByRole('textbox', { name: 'Scratchpad' }).focus()
  await page.keyboard.press('KeyC')
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioEvidence: { count: number } })
          .audioEvidence.count,
    ),
  ).toBe(4)
})
test('editing and export work with networking disabled after load', async ({
  page,
  context,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await context.setOffline(true)
  await page.getByLabel('Design name', { exact: true }).fill('Offline design')
  await page.getByLabel('Design name', { exact: true }).press('Tab')
  await expect(page.getByRole('status')).toHaveText('Saved')
  const download = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Export design', exact: true })
    .first()
    .click()
  expect((await download).suggestedFilename()).toBe(
    'Offline design.keyboard-artist',
  )
})

test('media boundary rejections preserve the active image and sound', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByText('Background image', { exact: true }).click()
  await page
    .getByLabel('Upload or replace image')
    .setInputFiles(`${root}/e2e/fixtures/background.png`)
  await expect(page.locator('.canvas-background')).toBeVisible()
  const oldImage = await page
    .locator('.canvas-background')
    .getAttribute('style')
  await page.getByLabel('Upload or replace image').setInputFiles({
    name: 'bad.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg/>'),
  })
  await expect(page.getByRole('alert')).toContainText(
    'valid static PNG or JPEG',
  )
  await expect(page.locator('.canvas-background')).toHaveAttribute(
    'style',
    oldImage!,
  )
  await page.getByText('Sound assignments', { exact: true }).click()
  await page.getByLabel('Upload audio sample').setInputFiles({
    name: 'large.wav',
    mimeType: 'audio/wav',
    buffer: Buffer.alloc(4 * 1024 ** 2 + 1),
  })
  await expect(page.getByRole('alert')).toContainText('at most 4 MiB')
  // A real 10.1-second PCM source is rejected from metadata before full PCM decode.
  const rate = 44100,
    samples = Math.ceil(rate * 10.1),
    bytes = Buffer.alloc(44 + samples * 2)
  bytes.write('RIFF')
  bytes.writeUInt32LE(36 + samples * 2, 4)
  bytes.write('WAVEfmt ', 8)
  bytes.writeUInt32LE(16, 16)
  bytes.writeUInt16LE(1, 20)
  bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(rate, 24)
  bytes.writeUInt32LE(rate * 2, 28)
  bytes.writeUInt16LE(2, 32)
  bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36)
  bytes.writeUInt32LE(samples * 2, 40)
  await page
    .getByLabel('Upload audio sample')
    .setInputFiles({ name: 'long.wav', mimeType: 'audio/wav', buffer: bytes })
  await expect(page.getByRole('alert')).toContainText('at most 10 seconds')
  await expect(
    page.getByLabel('Trim end Mechanical', { exact: true }),
  ).toHaveValue('0.12')
})

test('background positioning and media undo restore the prior design', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByText('Background image', { exact: true }).click()
  await page
    .getByLabel('Upload or replace image')
    .setInputFiles(`${root}/e2e/fixtures/background.png`)
  await expect(page.locator('.canvas-background')).toBeVisible()
  await page.getByLabel('Image fit').selectOption('contain')
  await expect(page.locator('.canvas-background')).toHaveCSS(
    'background-size',
    'contain',
  )
  await page.getByLabel('Horizontal position').press('Home')
  await expect(page.locator('.canvas-background')).toHaveCSS(
    'background-position',
    '0% 50%',
  )
  await page
    .getByRole('button', { name: 'Remove background', exact: true })
    .click()
  await expect(page.locator('.canvas-background')).toHaveCount(0)
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(page.locator('.canvas-background')).toHaveCSS(
    'background-position',
    '0% 50%',
  )
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.reload()
  await expect(page.locator('.canvas-background')).toBeVisible()
})

test('supported compressed sources decode before assignment', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByText('Sound assignments', { exact: true }).click()
  for (const format of ['mp3', 'ogg']) {
    await page
      .getByLabel('Upload audio sample')
      .setInputFiles(`${root}/experiments/sample.${format}`)
    await expect(
      page.getByLabel(`Trim end sample.${format}`, { exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('status')).toHaveText('Saved')
  }
})

test('inherited sample pools avoid immediate repeats across different keys', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0
    const original = AudioBufferSourceNode.prototype.start
    const samples: string[] = []
    Object.assign(window, { sampledBuffers: samples })
    AudioBufferSourceNode.prototype.start = function (
      ...args: Parameters<typeof original>
    ) {
      samples.push(
        Array.from(this.buffer!.getChannelData(0).slice(0, 8)).join(','),
      )
      return original.apply(this, args)
    }
  })
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.getByRole('button', { name: 'Color study', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Color study')
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Sound enabled', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  await page.getByRole('textbox', { name: 'Scratchpad' }).focus()
  await page.keyboard.down('KeyA')
  await page.keyboard.down('KeyB')
  const buffers = await page.evaluate(
    () => (window as unknown as { sampledBuffers: string[] }).sampledBuffers,
  )
  expect(buffers).toHaveLength(2)
  expect(buffers[0]).not.toBe(buffers[1])
  await page.keyboard.up('KeyA')
  await page.keyboard.up('KeyB')
})
