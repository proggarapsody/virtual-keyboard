import { test } from '@playwright/test'
import { writeFileSync } from 'node:fs'
test('records browser storage environment without claiming feature acceptance', async ({
  page,
  browserName,
}) => {
  await page.goto('./')
  await page.waitForTimeout(800)
  const result = await page.evaluate(async () => {
    const errors: string[] = []
    const request = indexedDB.open('environment-probe', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files')
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const outcomes: Record<string, string> = {}
    for (const [name, value] of [
      ['blob', new Blob(['hello'])],
      ['arrayBuffer', new Uint8Array([1, 2, 3]).buffer],
    ] as const) {
      try {
        const tx = db.transaction('files', 'readwrite')
        tx.objectStore('files').put(value, name)
        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve()
          tx.onabort = () => reject(tx.error)
          tx.onerror = () => reject(tx.error)
        })
        outcomes[name] = 'saved'
      } catch (e) {
        outcomes[name] = String(e)
        errors.push(String(e))
      }
    }
    db.close()
    return {
      userAgent: navigator.userAgent,
      styles: [...document.querySelectorAll('label')].slice(0, 8).map((el) => ({
        text: el.textContent,
        color: getComputedStyle(el).color,
        background: getComputedStyle(el).backgroundColor,
      })),
      status: document.querySelector('[role=status]')?.textContent,
      alert: document.querySelector('[role=alert]')?.textContent,
      outcomes,
      errors,
    }
  })
  writeFileSync(
    `docs/evidence/environment-${browserName}.json`,
    JSON.stringify(result, null, 2),
  )
})
