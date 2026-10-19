import { describe, it, expect } from 'vitest'
import { preset } from './presets'
import { designSchema, resolveStyle } from './model'
import { layoutRows } from './layouts'
import { output } from './languages'
import { editText } from '../input/text-editing'
import { PressLifecycle } from '../input/keyboard-input'
import { History } from '../studio/history'
describe('design and input rules', () => {
  it('validates ordinary presets and rejects invalid external values', () => {
    for (let i = 0; i < 3; i++)
      expect(designSchema.safeParse(preset(i)).success).toBe(true)
    const d = preset()
    d.appearance.radius = -1
    expect(designSchema.safeParse(d).success).toBe(false)
    d.appearance.radius = 2
    d.keys['NotAKey'] = {}
    expect(designSchema.safeParse(d).success).toBe(false)
  })
  it('inherits each property independently and retains hidden keys', () => {
    const d = preset()
    d.keys.KeyA = { cap: '#ffffff' }
    d.appearance.ink = '#abcdef'
    expect(resolveStyle(d, 'KeyA')).toMatchObject({
      cap: '#ffffff',
      ink: '#abcdef',
    })
    d.keys.F1 = { legend: 'Sun' }
    d.layout = '60'
    expect(d.keys.F1.legend).toBe('Sun')
  })
  it('has unique physical inventories and language independent output', () => {
    for (const size of ['60', '75', 'full'] as const) {
      const keys = layoutRows(size).flat()
      expect(new Set(keys.map((k) => k.code)).size).toBe(keys.length)
      expect(keys.filter((k) => k.code.startsWith('Key'))).toHaveLength(26)
    }
    expect(layoutRows('60').flat()).toHaveLength(61)
    expect(output('KeyQ', 'ru', false, false)).toBe('й')
    expect(output('KeyQ', 'ru', true, true)).toBe('й')
    expect(output('Digit2', 'ru', true, false)).toBe('"')
  })
  it('replaces selections and deletes a full Unicode point', () => {
    expect(editText('hello', 1, 4, 'i')).toEqual({ value: 'hio', caret: 2 })
    expect(editText('a🌞', 3, 3, '', true)).toEqual({ value: 'a', caret: 1 })
  })
  it('releases only when every input source releases', () => {
    const input = new PressLifecycle()
    expect(input.down('physical', 'KeyA')).toBe(true)
    expect(input.down('physical', 'KeyA')).toBe(false)
    expect(input.down('pointer', 'KeyA')).toBe(false)
    expect(input.up('physical')).toBeUndefined()
    expect(input.up('pointer')).toBe('KeyA')
    input.down('p', 'KeyB')
    input.clear()
    expect(input.pressed.size).toBe(0)
  })
  it('coalesces gestures and invalidates redo on a new edit', () => {
    const history = new History<number>()
    history.record(1, 'drag')
    history.record(2, 'drag')
    expect(history.undo(3)).toBe(1)
    expect(history.redo(1)).toBe(3)
    history.record(3)
    expect(history.canRedo).toBe(false)
    history.clear()
    expect(history.canUndo).toBe(false)
  })
})

it('bounds source and aggregate decoded media, rejecting invalid trims/pools', async () => {
  const { checkTotal, limits } = await import('./media-policy')
  expect(() => checkTotal([limits.designBytes + 1])).toThrow(/24 MiB/)
  expect(() => checkTotal([10], [limits.decodedCache + 1])).toThrow(/64 MiB/)
  const d = preset()
  d.sound.press.pool[0]!.start = d.sound.press.pool[0]!.end
  expect(designSchema.safeParse(d).success).toBe(false)
  const other = preset()
  other.sound.press.pool.push({ ...other.sound.press.pool[0]! })
  expect(designSchema.safeParse(other).success).toBe(false)
})

it('shares variation history for inherited assignments and separates overrides/phases', async () => {
  const { soundIdentity } = await import('./model')
  const d = preset(2)
  expect(soundIdentity(d, 'KeyA', 'press')).toBe(
    soundIdentity(d, 'KeyB', 'press'),
  )
  d.keys.KeyA = { press: structuredClone(d.sound.press) }
  expect(soundIdentity(d, 'KeyA', 'press')).not.toBe(
    soundIdentity(d, 'KeyB', 'press'),
  )
  expect(soundIdentity(d, 'KeyB', 'press')).not.toBe(
    soundIdentity(d, 'KeyB', 'release'),
  )
})
