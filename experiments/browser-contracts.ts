function wav(seconds: number, channels = 2) {
  const rate = 44100,
    n = rate * seconds * channels
  const bytes = new ArrayBuffer(44 + n * 2),
    v = new DataView(bytes)
  const str = (offset: number, value: string) =>
    [...value].forEach((c, i) => v.setUint8(offset + i, c.charCodeAt(0)))
  str(0, 'RIFF')
  v.setUint32(4, 36 + n * 2, true)
  str(8, 'WAVE')
  str(12, 'fmt ')
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true)
  v.setUint16(22, channels, true)
  v.setUint32(24, rate, true)
  v.setUint32(28, rate * channels * 2, true)
  v.setUint16(32, channels * 2, true)
  v.setUint16(34, 16, true)
  str(36, 'data')
  v.setUint32(40, n * 2, true)
  return bytes
}
document.querySelector('button')!.onclick = async () => {
  const context = new AudioContext()
  document.querySelector('pre')!.textContent = JSON.stringify({
    stage: 'audio-resume',
    state: context.state,
  })
  await context.resume().catch((error) => {
    document.querySelector('pre')!.textContent = JSON.stringify({
      stage: 'audio-resume-failed',
      error: String(error),
    })
    throw error
  })
  const measurements = []
  for (const seconds of [1, 10, 30]) {
    const bytes = wav(seconds),
      start = performance.now()
    const buffer = await context.decodeAudioData(bytes.slice(0))
    measurements.push({
      seconds,
      encoded: bytes.byteLength,
      decoded: buffer.length * buffer.numberOfChannels * 4,
      decodeMs: performance.now() - start,
    })
  }
  const formats: Record<string, boolean> = {}
  for (const format of ['mp3', 'ogg']) {
    try {
      await context.decodeAudioData(
        await (await fetch(`./sample.${format}`)).arrayBuffer(),
      )
      formats[format] = true
    } catch {
      formats[format] = false
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 4096
  const imageBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/png'),
  )
  const imageStart = performance.now()
  const bitmap = await createImageBitmap(imageBlob)
  const image = {
    width: bitmap.width,
    height: bitmap.height,
    encoded: imageBlob.size,
    decoded: bitmap.width * bitmap.height * 4,
    decodeMs: performance.now() - imageStart,
  }
  bitmap.close()
  const buffer = await context.decodeAudioData(wav(1))
  const chord = performance.now()
  for (let i = 0; i < 32; i++) {
    const s = context.createBufferSource()
    s.buffer = buffer
    s.connect(context.destination)
    s.start()
  }
  const chordMs = performance.now() - chord
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open('keyboard-artist-experiment', 1)
    r.onupgradeneeded = () => r.result.createObjectStore('assets')
    r.onsuccess = () => resolve(r.result)
    r.onerror = () => reject(r.error)
  })
  const storageStart = performance.now()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('assets', 'readwrite')
    tx.objectStore('assets').put(
      new Blob([new Uint8Array(32 * 1024 * 1024)]),
      'fixture',
    )
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  const storageMs = performance.now() - storageStart
  const aborted = await new Promise<boolean>((resolve) => {
    const tx = db.transaction('assets', 'readwrite')
    tx.objectStore('assets').put('replacement', 'fixture')
    tx.onabort = () => resolve(true)
    tx.abort()
  })
  const retained = await new Promise<boolean>((resolve) => {
    const r = db.transaction('assets').objectStore('assets').get('fixture')
    r.onsuccess = () =>
      resolve(r.result instanceof Blob && r.result.size === 32 * 1024 * 1024)
  })
  let malformedRejected = false
  try {
    await context.decodeAudioData(new Uint8Array([1, 2, 3]).buffer)
  } catch {
    malformedRejected = true
  }
  document.querySelector('pre')!.textContent = JSON.stringify({
    browser: navigator.userAgent,
    measurements,
    formats,
    image,
    chordMs,
    storageMs,
    aborted,
    retained,
    malformedRejected,
    audioState: context.state,
  })
  await context.close()
  db.close()
}
export {}
