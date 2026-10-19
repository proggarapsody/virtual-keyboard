import { test, expect } from '@playwright/test'
test('application loads a usable surface', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('button').first()).toBeVisible()
})
