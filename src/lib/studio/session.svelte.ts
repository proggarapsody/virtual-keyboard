import { preset } from '../design/presets'
import { layoutRows } from '../design/layouts'
import type { Design, KeyStyle } from '../design/model'
import { PressLifecycle } from '../input/keyboard-input'
import { History } from './history'
export class Studio {
  design = $state.raw<Design>(preset())
  mode = $state<'edit' | 'play'>('edit')
  selection = $state<string[]>([])
  pressed = $state<string[]>([])
  caps = $state(false)
  scratch = $state('')
  showScratch = $state(true)
  error = $state('')
  saveStatus = $state('Loading')
  historyVersion = $state(0)
  readonly history = new History<Design>()
  readonly input = new PressLifecycle()
  onEdit: () => void = () => {}
  onSound: (code: string, phase: 'press' | 'release') => void = () => {}
  get activeKeys() { return layoutRows(this.design.layout).flat() }
  get shift() { return this.pressed.some(c => c.startsWith('Shift')) }
  change(fn: (d: Design) => void, group?: string) {
    this.history.record(this.design, group)
    const next = structuredClone(this.design)
    fn(next); next.revision = this.design.revision + 1
    this.design = next; this.historyVersion++; this.onEdit()
  }
  undo(redo = false) {
    const next = redo ? this.history.redo(this.design) : this.history.undo(this.design)
    if (next) { this.design = { ...next, revision: this.design.revision + 1 }; this.historyVersion++; this.onEdit() }
  }
  select(code: string, multi: boolean) {
    this.selection = multi ? this.selection.includes(code) ? this.selection.filter(c => c !== code) : [...this.selection, code] : [code]
  }
  override(patch: Partial<KeyStyle>) { this.change(d => { for (const code of this.selection) d.keys[code] = { ...d.keys[code], ...patch } }) }
  reset() { this.change(d => { for (const code of this.selection) delete d.keys[code] }) }
  down(source: string, code: string) {
    if (!this.activeKeys.some(k => k.code === code)) return
    if (this.input.down(source, code)) { if (code === 'CapsLock') this.caps = !this.caps; this.onSound(code, 'press') }
    this.pressed = [...this.input.pressed]
  }
  up(source: string) { const code = this.input.up(source); if (code) this.onSound(code, 'release'); this.pressed = [...this.input.pressed] }
  cancel() { this.input.clear(); this.pressed = [] }
  setMode() { this.cancel(); this.mode = this.mode === 'edit' ? 'play' : 'edit' }
  open(d: Design) { this.cancel(); this.design = d; this.selection = []; this.history.clear(); this.historyVersion++; this.caps = false }
}
