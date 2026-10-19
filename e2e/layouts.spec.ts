import { test, expect } from '@playwright/test'
test('hidden key overrides persist across layouts and EN/RU changes', async ({ page }) => {
  await page.goto('/'); await page.getByLabel('Layout', { exact: true }).selectOption('full')
  await expect(page.locator('.key')).toHaveCount(104)
  await page.locator('[data-code=F1]').click(); await page.getByLabel('Decorative legend', { exact: true }).fill('Sun')
  await page.getByLabel('Decorative legend', { exact: true }).press('Tab')
  await page.getByLabel('Layout', { exact: true }).selectOption('60')
  await expect(page.locator('.key')).toHaveCount(61); await expect(page.locator('[data-code=F1]')).toHaveCount(0)
  await page.getByLabel('Language', { exact: true }).selectOption('ru')
  await expect(page.locator('[data-code=KeyQ]')).toHaveText('й')
  await page.getByLabel('Layout', { exact: true }).selectOption('75'); await expect(page.locator('.key')).toHaveCount(83)
  await page.getByLabel('Layout', { exact: true }).selectOption('full'); await expect(page.locator('[data-code=F1]')).toContainText('Sun')
  await expect(page.getByRole('status')).toHaveText('Saved'); await page.reload(); await expect(page.locator('[data-code=F1]')).toContainText('Sun')
})
