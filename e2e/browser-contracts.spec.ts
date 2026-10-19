import { test, expect } from '@playwright/test'
import { writeFileSync } from 'node:fs'
test('user activated audio and transactional blob recovery', async ({ page, browserName }) => {
  await page.goto('/experiments/browser-contracts.html')
  await page.getByRole('button').click()
  await expect(page.locator('pre')).toContainText('malformedRejected', { timeout: 30000 })
  const result = JSON.parse(await page.locator('pre').innerText())
  expect(result.retained).toBe(true)
  expect(result.aborted).toBe(true)
  expect(result.malformedRejected).toBe(true)
  expect(result.audioState).toBe('running')
  writeFileSync(`docs/evidence/experiment-${browserName}.json`, JSON.stringify(result, null, 2) + '\n')
  const input = page.getByRole('textbox')
  await input.fill('abc'); await input.selectText(); await page.keyboard.type('Ж')
  await expect(input).toHaveValue('Ж')
  await page.keyboard.press('ControlOrMeta+z')
})
