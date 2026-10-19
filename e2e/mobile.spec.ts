import { test, expect } from '@playwright/test'
test('simulated simultaneous touches hold Shift and type, with cancellation cleanup', async ({
  browser,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'CDP touch simulation is Chromium-specific, not physical touch evidence.',
  )
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto('./')
  await expect(page.getByRole('button', { name: 'Exit Play' })).toBeVisible()
  const shift = page.locator('[data-code=ShiftLeft]'),
    a = page.locator('[data-code=KeyA]')
  await shift.scrollIntoViewIfNeeded()
  const s = (await shift.boundingBox())!,
    k = (await a.boundingBox())!
  const points = [
    { x: s.x + s.width / 2, y: s.y + s.height / 2, id: 1 },
    { x: k.x + k.width / 2, y: k.y + k.height / 2, id: 2 },
  ]
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [points[0]],
  })
  await expect(shift).toHaveClass(/pressed/)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: points,
  })
  await expect(a).toHaveClass(/pressed/)
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).toHaveValue(
    'A',
  )
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchCancel',
    touchPoints: [],
  })
  await expect(shift).not.toHaveClass(/pressed/)
  await expect(a).not.toHaveClass(/pressed/)
  await page.locator('[data-code=CapsLock]').tap()
  await page.locator('[data-code=KeyA]').tap()
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).toHaveValue(
    'AA',
  )
  await context.close()
})
