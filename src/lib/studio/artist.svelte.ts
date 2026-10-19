import { exportDesign } from '../transfer/export-design'
import { importDesign } from '../transfer/import-design'
import { Studio } from './session.svelte'
import { Repository } from '../library/repository'
import { SaveCoordinator } from './save-coordinator'
import { preset } from '../design/presets'
import {
  assetIds,
  designSchema,
  resolveSound,
  soundIdentity,
  type Design,
  type Asset,
  type Assignment,
} from '../design/model'
import { checkTotal, validateImage } from '../design/media-policy'
import { decodeSample } from '../audio/import-sample'
import { AudioEngine } from '../audio/engine'
export class Artist extends Studio {
  designs = $state.raw<Design[]>([])
  assetList = $state.raw<Asset[]>([])
  ready = $state(false)
  mediaBusy = $state(false)
  audioState = $state('disabled')
  volume = $state(0.6)
  muted = $state(false)
  readonly repository = new Repository()
  readonly saver = new SaveCoordinator(this.repository)
  readonly audio = new AudioEngine()
  private assets = new Map<string, Asset>()
  private urls = new Map<string, string>()
  private saving = 0
  private unsaved = new Map<string, string>()
  private disposed = false
  private preparation: Promise<void> = Promise.resolve()
  constructor() {
    super()
    this.onEdit = () => {
      void this.save()
      void this.prepare()
    }
    this.onSound = (code, phase) =>
      this.audio.play(
        resolveSound(this.design, code, phase),
        soundIdentity(this.design, code, phase),
      )
    this.audio.onState = (state) => {
      this.audioState = state
    }
  }
  asset(id: string) {
    return this.assets.get(id)
  }
  assetUrl(id: string) {
    if (!this.urls.has(id) && this.assets.has(id))
      this.urls.set(id, URL.createObjectURL(this.assets.get(id)!.blob))
    return this.urls.get(id) ?? ''
  }
  addAssets(values: Asset[]) {
    for (const a of values) this.assets.set(a.id, a)
    this.assetList = [...this.assets.values()]
  }
  required(d = this.design) {
    return assetIds(d).map((id) => {
      const a = this.assets.get(id)
      if (!a) throw new Error(`Missing media: ${id}`)
      return a
    })
  }
  async initialize() {
    try {
      const bundled = await Promise.all(
        ['mechanical', 'release', 'soft', 'tone'].map(async (id) => {
          const response = await fetch(
            `${import.meta.env.BASE_URL}sounds/${id}.wav`,
          )
          if (!response.ok)
            throw new Error('Included samples could not load. Reload to retry.')
          return {
            id,
            name: id[0]!.toUpperCase() + id.slice(1),
            type: 'audio/wav',
            blob: await response.blob(),
            duration: 0.12,
            decodedBytes: Math.ceil(0.12 * 48000) * 4,
          }
        }),
      )
      if (this.disposed) return
      this.addAssets(bundled)
      try {
        const [stored, media, active] = await Promise.all([
          this.repository.list(),
          this.repository.assets(),
          this.repository.active(),
        ])
        if (this.disposed) return
        this.designs = stored.map((d) => designSchema.parse(d))
        this.saver.seed(this.designs)
        this.addAssets(media)
        const selected =
          this.designs.find((d) => d.id === active) ?? this.designs[0]
        if (selected) this.open(selected)
        this.ready = true
        if (selected) this.saveStatus = 'Saved'
        else await this.save()
      } catch {
        this.ready = true
        this.saveStatus = 'Unsaved'
        this.error =
          'Local storage is unavailable. Your work remains in memory; export a backup.'
      }
      try {
        const prefs = JSON.parse(
          localStorage.getItem('keyboard-artist-listening') ?? '{}',
        )
        this.listen(
          typeof prefs.volume === 'number'
            ? Math.max(0, Math.min(1, prefs.volume))
            : 0.6,
          prefs.muted === true,
        )
      } catch {
        /* Preferences are optional. */
      }
    } catch (e) {
      this.error = this.message(e)
      this.saveStatus = 'Unsaved'
    }
  }
  message(e: unknown) {
    return e instanceof Error
      ? e.message
      : 'Operation failed. Your current work is preserved.'
  }
  async save() {
    if (!this.ready) return
    const snapshot = this.design,
      ticket = ++this.saving
    this.designs = [
      ...this.designs.filter((d) => d.id !== snapshot.id),
      snapshot,
    ]
    this.saveStatus = 'Saving…'
    try {
      const media = this.required(snapshot)
      checkTotal(
        media.map((a) => a.blob.size),
        media.map((a) => a.decodedBytes ?? (a.duration ?? 0) * 48000 * 8),
      )
      await this.saver.save(snapshot, media)
      if (this.design.id === snapshot.id && this.saving === ticket) {
        this.saveStatus = 'Saved'
        this.unsaved.delete(snapshot.id)
      }
    } catch (e) {
      if (this.design.id === snapshot.id) {
        this.saveStatus = 'Unsaved'
        this.error = `${this.message(e)} Your work remains open. Export a backup.`
        this.unsaved.set(snapshot.id, this.error)
      }
    }
  }
  async openDesign(d: Design) {
    await this.saver.flush()
    this.audio.stop()
    this.open(this.designs.find((item) => item.id === d.id) ?? d)
    this.saveStatus = this.unsaved.has(d.id) ? 'Unsaved' : 'Saved'
    this.error = this.unsaved.get(d.id) ?? ''
    void this.prepare()
    void this.repository.activate(d.id).catch(() => {})
  }
  async create(index: number) {
    await this.saver.flush()
    this.audio.stop()
    this.open(preset(index))
    await this.save()
    void this.prepare()
    void this.repository.activate(this.design.id).catch(() => {})
  }
  async duplicate() {
    const d = structuredClone(this.design)
    d.id = crypto.randomUUID()
    d.name = `${d.name.slice(0, 70)} copy`
    d.revision = 0
    await this.saver.flush()
    this.audio.stop()
    this.open(d)
    await this.save()
    void this.repository.activate(d.id).catch(() => {})
  }
  async removeDesign() {
    const id = this.design.id
    await this.saver.flush()
    await this.repository.delete(id)
    this.designs = this.designs.filter((d) => d.id !== id)
    if (this.designs.length) await this.openDesign(this.designs[0]!)
    else await this.create(0)
  }
  async upload(file: File, kind: 'image' | 'audio') {
    if (this.mediaBusy) return
    this.mediaBusy = true
    this.error = ''
    const designId = this.design.id
    try {
      const id = crypto.randomUUID()
      let asset: Asset
      if (kind === 'image')
        asset = {
          id,
          name: file.name.slice(0, 80),
          type: await validateImage(file),
          blob: file,
        }
      else {
        const decoded = await decodeSample(file)
        asset = {
          id,
          name: file.name.slice(0, 80),
          type: decoded.type,
          blob: file,
          duration: decoded.buffer.duration,
          decodedBytes:
            decoded.buffer.length * decoded.buffer.numberOfChannels * 4,
        }
      }
      if (this.design.id !== designId)
        throw new Error(
          'The active design changed during upload. Please choose the file again.',
        )
      checkTotal(
        [...this.required(), asset].map((a) => a.blob.size),
        [...this.required(), asset].map(
          (a) => a.decodedBytes ?? (a.duration ?? 0) * 48000 * 8,
        ),
      )
      this.addAssets([asset])
      if (kind === 'image')
        this.change(
          (d) =>
            (d.background = {
              asset: id,
              fit: 'cover',
              x: 50,
              y: 50,
              dim: 0.25,
            }),
        )
      else
        this.change(
          (d) =>
            (d.sound.press = {
              ...d.sound.press,
              pool: [{ asset: id, start: 0, end: asset.duration! }],
            }),
        )
      await this.prepare()
    } catch (e) {
      this.error = this.message(e)
    } finally {
      this.mediaBusy = false
    }
  }
  async enableSound() {
    if (!this.ready) {
      this.error =
        'Wait for the included samples to load, then choose Enable sound again.'
      return
    }
    this.audioState = 'Loading sounds…'
    try {
      await this.audio.enable()
      this.audioState = 'Loading sounds…'
      await this.prepare()
      this.audioState = 'running'
    } catch (e) {
      this.audioState = 'suspended'
      this.error = this.message(e)
    }
  }
  prepare() {
    if (!this.ready) return Promise.resolve()
    const assets = this.required().filter((a) => a.type.startsWith('audio/'))
    const operation = this.preparation.then(() => this.audio.prepare(assets))
    this.preparation = operation.catch((e) => {
      this.error = this.message(e)
    })
    return this.preparation
  }
  listen(volume: number, muted: boolean) {
    this.volume = volume
    this.muted = muted
    this.audio.setListening(volume, muted)
    try {
      localStorage.setItem(
        'keyboard-artist-listening',
        JSON.stringify({ volume, muted }),
      )
    } catch {
      /* Optional listening preferences never block local editing. */
    }
  }
  async audition(a: Assignment) {
    if (this.audioState !== 'running') {
      this.error = 'Choose Enable sound before auditioning a sample.'
      return
    }
    await this.prepare()
    this.audio.play(a, 'audition')
  }
  async exportFile() {
    try {
      const blob = await exportDesign(this.design, this.required())
      const url = URL.createObjectURL(blob),
        anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${this.design.name.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'design'}.keyboard-artist`
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 30000)
    } catch (e) {
      this.error = this.message(e)
    }
  }
  async importFile(file: File, replace: boolean) {
    if (this.mediaBusy) return
    this.mediaBusy = true
    this.error = ''
    const target = structuredClone(this.design)
    try {
      const incoming = await importDesign(file)
      if (
        this.design.id !== target.id ||
        this.design.revision !== target.revision
      )
        throw new Error(
          'The active design changed during import. Please try again.',
        )
      if (replace) {
        incoming.design.id = target.id
        incoming.design.revision = target.revision + 1
      }
      await this.saver.flush()
      await this.saver.save(incoming.design, incoming.assets)
      this.addAssets(incoming.assets)
      this.open(incoming.design)
      this.audio.stop()
      this.designs = [
        ...this.designs.filter((d) => d.id !== incoming.design.id),
        incoming.design,
      ]
      this.saveStatus = 'Saved'
      void this.repository.activate(incoming.design.id).catch(() => {})
      await this.prepare()
    } catch (e) {
      this.error = `${this.message(e)} Existing designs are unchanged.`
    } finally {
      this.mediaBusy = false
    }
  }
  dispose() {
    this.disposed = true
    this.cancel()
    void this.audio.close()
    for (const url of this.urls.values()) URL.revokeObjectURL(url)
  }
}
