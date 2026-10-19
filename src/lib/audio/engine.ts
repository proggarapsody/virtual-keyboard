import type { Assignment, Asset } from '../design/model'
import { limits } from '../design/media-policy'
import { chooseSample } from './sample-selection'
export class AudioEngine {
  private context?: AudioContext
  private master?: GainNode
  private buffers = new Map<string, AudioBuffer>()
  private voices: AudioBufferSourceNode[] = []
  private previous = new Map<string, number>()
  private volume = .6
  private muted = false
  onState: (state: string) => void = () => {}
  async enable() {
    if (!this.context) {
      this.context = new AudioContext({ latencyHint: 'interactive' })
      this.master = this.context.createGain(); this.master.connect(this.context.destination)
      this.context.onstatechange = () => this.onState(this.context!.state)
    }
    await Promise.race([this.context.resume(), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Audio could not start. Check your output device, then choose Resume sound.')), 2500))]); this.setListening(this.volume, this.muted)
    this.onState(this.context.state)
  }
  setListening(volume: number, muted: boolean) {
    this.volume = volume; this.muted = muted
    if (this.master && this.context) this.master.gain.setValueAtTime(muted ? 0 : volume, this.context.currentTime)
  }
  async prepare(assets: Asset[]) {
    if (!this.context) return
    for (const asset of assets) {
      if (!asset.type.startsWith('audio/') || this.buffers.has(asset.id)) continue
      const buffer = await this.context.decodeAudioData(await asset.blob.arrayBuffer())
      const size = () => [...this.buffers.values()].reduce((n, b) => n + b.length * b.numberOfChannels * 4, 0)
      while (this.buffers.size && size() + buffer.length * buffer.numberOfChannels * 4 > limits.decodedCache) this.buffers.delete(this.buffers.keys().next().value!)
      this.buffers.set(asset.id, buffer)
    }
  }
  play(assignment: Assignment, identity: string) {
    if (!this.context || this.context.state !== 'running' || !this.master || this.muted) return
    const index = chooseSample(assignment.pool.length, this.previous.get(identity))
    const clip = assignment.pool[index]
    if (!clip) return
    const buffer = this.buffers.get(clip.asset)
    if (!buffer) return
    this.previous.set(identity, index)
    while (this.voices.length >= limits.voices) this.voices.shift()!.stop()
    const source = this.context.createBufferSource(), gain = this.context.createGain()
    source.buffer = buffer; source.playbackRate.value = 2 ** (assignment.pitch / 12); gain.gain.value = assignment.volume
    source.connect(gain); gain.connect(this.master); this.voices.push(source)
    source.onended = () => { source.disconnect(); gain.disconnect(); this.voices = this.voices.filter(v => v !== source) }
    source.start(0, clip.start, Math.max(.001, Math.min(clip.end, buffer.duration) - clip.start))
  }
  stop() { for (const voice of this.voices) { try { voice.stop() } catch { /* already ended */ } }; this.voices = [] }
  async close() { this.stop(); await this.context?.close(); this.buffers.clear() }
}
