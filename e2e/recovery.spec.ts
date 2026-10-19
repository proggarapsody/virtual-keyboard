import { test, expect } from '@playwright/test'
import { unzipSync, strFromU8 } from 'fflate'
import { readFileSync } from 'node:fs'
test('a stale tab preserves both versions and keeps unsaved export usable', async ({ page, context }) => {
  await page.goto('/'); await expect(page.getByRole('status')).toHaveText('Saved')
  const other = await context.newPage(); await other.goto('/'); await expect(other.getByRole('status')).toHaveText('Saved')
  await page.getByLabel('Design name', { exact: true }).fill('First tab')
  await page.getByLabel('Design name', { exact: true }).press('Tab'); await expect(page.getByRole('status')).toHaveText('Saved')
  await other.getByLabel('Design name', { exact: true }).fill('Stale tab')
  await other.getByLabel('Design name', { exact: true }).press('Tab'); await expect(other.getByRole('status')).toHaveText('Unsaved')
  await expect(other.getByRole('alert')).toContainText('another tab')
  const download = other.waitForEvent('download'); await other.getByRole('button', { name: 'Export backup', exact: true }).click()
  const file = await download; const files = unzipSync(readFileSync((await file.path())!))
  expect(JSON.parse(strFromU8(files['manifest.json']!)).design.name).toBe('Stale tab')
  await page.reload(); await expect(page.locator('h1')).toHaveText('First tab')
  await other.getByRole('button', { name: 'Duplicate', exact: true }).click()
  await expect(other.getByRole('status')).toHaveText('Saved')
  await page.reload(); await expect(page.locator('.library .design-item')).toHaveCount(2)
})
test('quota failure retains edited appearance and exportable media', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('status')).toHaveText('Saved')
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction
    IDBDatabase.prototype.transaction = function(...args: Parameters<typeof original>) {
      if (args[1] === 'readwrite') throw new DOMException('Injected quota exhausted', 'QuotaExceededError')
      return original.apply(this, args)
    }
  })
  await page.getByLabel('Design name', { exact: true }).fill('Memory survives')
  await page.getByLabel('Design name', { exact: true }).press('Tab')
  await expect(page.getByRole('status')).toHaveText('Unsaved')
  await expect(page.locator('h1')).toHaveText('Memory survives')
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export backup', exact: true }).click()
  const file = await download; const files = unzipSync(readFileSync((await file.path())!))
  expect(JSON.parse(strFromU8(files['manifest.json']!)).design.name).toBe('Memory survives')
  expect(files['media/mechanical']!.byteLength).toBeGreaterThan(1000)
})
test('unsupported versions and failed replacement preserve existing documents', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('status')).toHaveText('Saved')
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export design', exact: true }).first().click()
  const file = await pending; const originalPath = (await file.path())!
  await page.getByLabel('Replace current design on import').first().check()
  await page.getByLabel('Import design', { exact: true }).first().setInputFiles({ name: 'broken.keyboard-artist', mimeType: 'application/zip', buffer: Buffer.from('broken') })
  await expect(page.locator('.library .design-item')).toHaveCount(1)
  await page.getByLabel('Import design', { exact: true }).first().setInputFiles(originalPath)
  await expect(page.getByRole('status')).toHaveText('Saved'); await expect(page.locator('.library .design-item')).toHaveCount(1)
  await page.reload(); await expect(page.locator('h1')).toHaveText('Tactile mechanical')
})
