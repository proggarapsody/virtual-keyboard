import { test, expect } from '@playwright/test'
test('application loads a usable surface', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await expect(page.locator('button').first()).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Saved')
  expect(errors).toEqual([])
})
