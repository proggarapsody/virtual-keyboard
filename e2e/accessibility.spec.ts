import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
test('preset editor and mobile player have no automated accessibility violations', async ({
  page,
  browserName,
}) => {
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  const reports = []
  for (const name of [
    'Tactile mechanical',
    'Quiet minimalist',
    'Color study',
  ]) {
    if (name !== 'Tactile mechanical')
      await page.locator('.preset-item').filter({ hasText: name }).click()
    reports.push({
      name,
      violations: (await new AxeBuilder({ page }).analyze()).violations,
    })
  }
  await page.setViewportSize({ width: 320, height: 760 })
  await page.reload()
  await expect(page.getByRole('button', { name: 'Exit Play' })).toBeVisible()
  reports.push({
    name: 'Mobile',
    violations: (await new AxeBuilder({ page }).analyze()).violations,
  })
  mkdirSync('docs/evidence', { recursive: true })
  writeFileSync(
    `docs/evidence/axe-${browserName}.json`,
    JSON.stringify(reports, null, 2),
  )
  expect(
    reports.flatMap((r) =>
      r.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`,
      ),
    ),
  ).toEqual([])
})
test('rendered desktop/mobile/zoom/reduced-motion evidence', async ({
  page,
  browserName,
}) => {
  const captureDir =
    browserName === 'chromium'
      ? '.impeccable/review'
      : `.impeccable/review/${browserName}`
  mkdirSync(captureDir, { recursive: true })
  await page.goto('./')
  await expect(page.getByRole('status')).toHaveText('Saved')
  for (const width of [1440, 1024, 768, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.reload()
    await expect(page.locator('.key').first()).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Mute', exact: true }),
    ).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: `${captureDir}/${width === 1440 ? 'desktop' : width === 320 ? 'mobile' : `width-${width}`}.png`,
      fullPage: true,
    })
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.reload()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  await page.getByRole('textbox', { name: 'Scratchpad' }).focus()
  await page.keyboard.down('KeyA')
  await expect(page.locator('[data-code=KeyA]')).toHaveCSS('transform', 'none')
  await page.keyboard.up('KeyA')
  await page.screenshot({ path: `${captureDir}/play.png`, fullPage: true })
  await page.getByRole('button', { name: 'Exit Play' }).click()
  await page.getByLabel('Layout', { exact: true }).selectOption('full')
  await page.screenshot({ path: `${captureDir}/full-size.png`, fullPage: true })
  // A 720px CSS viewport exercises the same layout reflow as 200% zoom at 1440.
  await page.setViewportSize({ width: 720, height: 450 })
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Mute', exact: true }),
  ).toBeVisible()
})

test('design system uses live components and reflows without accessibility violations', async ({
  page,
  browserName,
}) => {
  await page.goto('./design-system.html')
  await expect(
    page.getByRole('heading', { name: 'Soft light. Solid controls.' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Sound on', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Muted', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    const captureDir =
      browserName === 'chromium'
        ? '.impeccable/review'
        : `.impeccable/review/${browserName}`
    await page.screenshot({
      path: `${captureDir}/system-${width}.png`,
      fullPage: true,
    })
  }
})
