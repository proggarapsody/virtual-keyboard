import { test, expect } from '@playwright/test'
test('per-key inheritance, decorative text, undo, and reload', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  const a = page.locator('[data-code=KeyA]'),
    b = page.locator('[data-code=KeyB]')
  await a.click()
  await page.getByLabel('Decorative legend', { exact: true }).fill('<sun>')
  await page.getByLabel('Decorative legend', { exact: true }).press('Tab')
  await expect(a).toHaveText(/<sun>/)
  await page.getByLabel('Selected key color', { exact: true }).fill('#123456')
  await page.getByLabel('Key color', { exact: true }).fill('#abcdef')
  await expect(a).toHaveCSS('background-color', 'rgb(18, 52, 86)')
  await expect(b).toHaveCSS('background-color', 'rgb(171, 205, 239)')
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(b).not.toHaveCSS('background-color', 'rgb(171, 205, 239)')
  await page.getByRole('button', { name: 'Redo', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.reload()
  await expect(a).toHaveText('<sun>')
  await a.click()
  await page.getByRole('button', { name: 'Reset selected to global' }).click()
  await expect(a).toHaveCSS('background-color', 'rgb(171, 205, 239)')
})
test('fresh presets preserve previous work; library deletion is confirmed', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page
    .getByRole('button', { name: 'Quiet minimalist', exact: true })
    .click()
  await expect(page.locator('h1')).toHaveText('Quiet minimalist')
  await page
    .locator('.library .design-item')
    .filter({ hasText: 'Tactile mechanical' })
    .click()
  await expect(page.locator('h1')).toHaveText('Tactile mechanical')
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page.getByRole('button', { name: 'Keep design' }).click()
  await expect(page.locator('dialog')).not.toBeVisible()
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Tactile mechanical copy')
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled()
})
test('mixed selection, selected sound inheritance and undo remain isolated across designs', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByLabel('Apply sound to')).toHaveValue('global')
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.locator('[data-code=KeyA]').click()
  await page.getByLabel('Selected key color', { exact: true }).fill('#123456')
  await page.locator('[data-code=KeyB]').click({ modifiers: ['Shift'] })
  await expect(page.locator('.inspector')).toContainText('Key color · Mixed')
  await page.getByText('Sound assignments', { exact: true }).click()
  await page.getByLabel('Apply sound to').selectOption('selected')
  await page.getByRole('button', { name: 'Silence', exact: true }).click()
  await expect(page.locator('.inspector')).toContainText(
    'Selected-key override',
  )
  await page
    .getByRole('button', { name: 'Inherit press sound', exact: true })
    .click()
  await expect(page.locator('.inspector')).toContainText(
    'Inherited from global',
  )
  await page
    .getByRole('button', { name: 'Quiet minimalist', exact: true })
    .click()
  await expect(page.getByLabel('Apply sound to')).toHaveValue('global')
  await expect(
    page.getByRole('button', { name: 'Undo', exact: true }),
  ).toBeDisabled()
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.reload()
  await expect(page.locator('h1')).toHaveText('Quiet minimalist')
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await page.getByRole('button', { name: 'Delete design', exact: true }).click()
  await expect(page.locator('.library .design-item')).toHaveCount(1)
})

test('each included preset remains editable and restores after reload', async ({
  page,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  for (const name of [
    'Tactile mechanical',
    'Quiet minimalist',
    'Color study',
  ]) {
    await page.locator('.preset-item').filter({ hasText: name }).click()
    await expect(page.getByRole('status')).toHaveText('Saved')
    await page.reload()
    await expect(page.locator('h1')).toHaveText(name)
    await page.getByRole('button', { name: 'Letters', exact: true }).click()
    await expect(page.locator('.key.selected')).toHaveCount(26)
  }
})

test('long design names and literal legends stay within their surfaces', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByLabel('Design name', { exact: true }).fill('A'.repeat(80))
  await page.getByLabel('Design name', { exact: true }).press('Tab')
  await page.locator('[data-code=KeyA]').click()
  await page
    .getByLabel('Decorative legend', { exact: true })
    .fill('<script>literal</script>')
  await page.getByLabel('Decorative legend', { exact: true }).press('Tab')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await expect(page.locator('[data-code=KeyA] > span').first()).toHaveCSS(
    'text-overflow',
    'ellipsis',
  )
  await expect(page.locator('[data-code=KeyA]')).toContainText(
    '<script>literal</script>',
  )
})
