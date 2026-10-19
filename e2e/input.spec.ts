import { test, expect } from '@playwright/test'
test('edit selection, chosen-language typing, source cancellation and temporary scratchpad', async ({
  page,
}) => {
  await page.goto('./')
  const a = page.locator('[data-code=KeyA]')
  await a.click()
  await expect(a).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).toHaveValue(
    '',
  )
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  const scratch = page.getByRole('textbox', { name: 'Scratchpad' })
  await scratch.focus()
  await page.keyboard.type('abc')
  await expect(scratch).toHaveValue('abc')
  await scratch.selectText()
  await page.locator('[data-code=KeyQ]').click()
  await expect(scratch).toHaveValue('q')
  await page.getByLabel('Language', { exact: true }).selectOption('ru')
  await scratch.focus()
  await page.keyboard.press('KeyQ')
  await expect(scratch).toHaveValue('qй')
  await page.keyboard.down('KeyA')
  await expect(a).toHaveClass(/pressed/)
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  await expect(a).not.toHaveClass(/pressed/)
  await page.keyboard.up('KeyA')
  await page.getByRole('button', { name: 'Exit Play' }).click()
  await page.reload()
  await expect(scratch).toHaveValue('')
})
test('toolbar activation does not type; Tab exits and text undo remains native', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Play keyboard' }).focus()
  await page.keyboard.press('Enter')
  const scratch = page.getByRole('textbox', { name: 'Scratchpad' })
  await expect(scratch).toHaveValue('')
  await scratch.focus()
  await page.keyboard.type('abc')
  await page.keyboard.press('ControlOrMeta+z')
  await expect(scratch).toHaveValue('')
  await page.keyboard.press('Tab')
  await expect(scratch).not.toBeFocused()
})
test('synthetic composition boundary and virtual hold repeat preserve one input lifecycle', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  const scratch = page.getByRole('textbox', { name: 'Scratchpad' })
  await scratch.fill('paste ✓')
  await scratch.selectText()
  await scratch.dispatchEvent('compositionstart')
  await scratch.dispatchEvent('keydown', {
    code: 'KeyQ',
    key: 'Process',
    isComposing: true,
  })
  await expect(scratch).toHaveValue('paste ✓')
  await scratch.dispatchEvent('compositionend', { data: '日本語' })
  await page.locator('[data-code=KeyA]').hover()
  await page.mouse.down()
  await page.waitForTimeout(620)
  await page.mouse.up()
  await expect(scratch).toHaveValue(/^a{3,}$/)
  await page.getByRole('button', { name: 'Exit Play' }).click()
  await expect(page.locator('.key.pressed')).toHaveCount(0)
})

test('virtual Tab advances focus without inserting text', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  const scratch = page.getByRole('textbox', { name: 'Scratchpad' })
  await scratch.focus()
  await page.locator('[data-code=Tab]').click()
  await expect(scratch).not.toBeFocused()
  await expect(scratch).toHaveValue('')
})
