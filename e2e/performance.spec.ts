import { test, expect } from '@playwright/test'
import { gzipSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
test('records cold navigations and warm chord timing as lab evidence', async ({
  browser,
}) => {
  const cold = []
  for (let i = 0; i < 3; i++) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    })
    const page = await context.newPage()
    await page.goto('./')
    await expect(page.getByRole('status')).toHaveText('Saved')
    await page.waitForFunction(() =>
      performance
        .getEntriesByType('paint')
        .some((entry) => entry.name === 'first-contentful-paint'),
    )
    cold.push(
      await page.evaluate(() => ({
        navigation: performance.getEntriesByType('navigation')[0]?.toJSON(),
        paints: performance.getEntriesByType('paint').map((p) => p.toJSON()),
        userAgent: navigator.userAgent,
      })),
    )
    await context.close()
  }
  const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    page = await context.newPage()
  await page.goto('./')
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Sound enabled', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Play keyboard' }).click()
  await page.getByRole('textbox', { name: 'Scratchpad' }).focus()
  const cdp = await context.newCDPSession(page)
  const traceComplete = new Promise<{ stream: string }>((resolve) =>
    cdp.once('Tracing.tracingComplete', resolve),
  )
  await cdp.send('Tracing.start', {
    categories: 'devtools.timeline,blink.user_timing',
    transferMode: 'ReturnAsStream',
  })
  const timing = await page.evaluate(async () => {
    const scheduled: number[] = [],
      visual: number[] = []
    let pressedAt = 0
    const original = AudioBufferSourceNode.prototype.start
    AudioBufferSourceNode.prototype.start = function (
      ...args: Parameters<typeof original>
    ) {
      if (pressedAt) scheduled.push(performance.now() - pressedAt)
      return original.apply(this, args)
    }
    const observer = new MutationObserver(() => {
      const button = document.querySelector('[data-code=KeyA]')!
      if (button.classList.contains('pressed'))
        requestAnimationFrame(() => visual.push(performance.now() - pressedAt))
    })
    observer.observe(document.querySelector('[data-code=KeyA]')!, {
      attributes: true,
      attributeFilter: ['class'],
    })
    for (let i = 0; i < 40; i++) {
      pressedAt = performance.now()
      for (const code of ['KeyA', 'KeyS', 'KeyD', 'KeyF'])
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            code,
            key: code.slice(-1).toLowerCase(),
            bubbles: true,
          }),
        )
      await new Promise((r) => setTimeout(r, 30))
      pressedAt = 0
      for (const code of ['KeyA', 'KeyS', 'KeyD', 'KeyF'])
        window.dispatchEvent(
          new KeyboardEvent('keyup', { code, bubbles: true }),
        )
      await new Promise((r) => setTimeout(r, 20))
    }
    observer.disconnect()
    AudioBufferSourceNode.prototype.start = original
    const p95 = (values: number[]) =>
      [...values].sort((a, b) => a - b)[Math.floor(values.length * 0.95)]
    return {
      scheduledCount: scheduled.length,
      visualCount: visual.length,
      scheduleP95: p95(scheduled),
      nextFrameP95: p95(visual),
    }
  })
  await cdp.send('Tracing.end')
  const { stream } = await traceComplete
  const traceChunks: Buffer[] = []
  while (true) {
    const chunk = await cdp.send('IO.read', { handle: stream })
    traceChunks.push(
      Buffer.from(chunk.data, chunk.base64Encoded ? 'base64' : 'utf8'),
    )
    if (chunk.eof) break
  }
  await cdp.send('IO.close', { handle: stream })
  writeFileSync(
    'docs/evidence/chord-trace.json.gz',
    gzipSync(Buffer.concat(traceChunks)),
  )
  writeFileSync(
    'docs/evidence/performance.json',
    JSON.stringify(
      {
        url: process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173',
        browserVersion: browser.version(),
        conditions:
          'Server as recorded URL, Chromium automation, 1440x900, no CPU/network throttling, three fresh contexts; warm synthetic 4-key chords, not physical/acoustic latency or field data',
        cold,
        timing,
      },
      null,
      2,
    ),
  )
  expect(timing.scheduledCount).toBe(160)
  expect(timing.visualCount).toBe(40)
  expect(timing.scheduleP95).toBeLessThan(10)
  expect(timing.nextFrameP95).toBeLessThan(50)
  await context.close()
})
