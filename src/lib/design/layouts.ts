export type Key = {
  code: string
  label: string
  width: number
  group: 'letters' | 'modifiers' | 'function' | 'other'
}
const key = (code: string, label = code, width = 1): Key => ({
  code,
  label,
  width,
  group: /^Key/.test(code)
    ? 'letters'
    : /Shift|Control|Alt|Meta|CapsLock/.test(code)
      ? 'modifiers'
      : /^F\d+$/.test(code)
        ? 'function'
        : 'other',
})
const row = (codes: string[]) => codes.map((c) => key(c))
const letters = (text: string) => [...text].map((c) => key(`Key${c}`, c))
const digits = [...'1234567890'].map((c) => key(`Digit${c}`, c))
export const baseRows: Key[][] = [
  [
    key('Backquote', '`'),
    ...digits,
    key('Minus', '-'),
    key('Equal', '='),
    key('Backspace', 'Backspace', 2),
  ],
  [
    key('Tab', 'Tab', 1.5),
    ...letters('QWERTYUIOP'),
    key('BracketLeft', '['),
    key('BracketRight', ']'),
    key('Backslash', '\\', 1.5),
  ],
  [
    key('CapsLock', 'Caps', 1.75),
    ...letters('ASDFGHJKL'),
    key('Semicolon', ';'),
    key('Quote', "'"),
    key('Enter', 'Enter', 2.25),
  ],
  [
    key('ShiftLeft', 'Shift', 2.25),
    ...letters('ZXCVBNM'),
    key('Comma', ','),
    key('Period', '.'),
    key('Slash', '/'),
    key('ShiftRight', 'Shift', 2.75),
  ],
  [
    key('ControlLeft', 'Ctrl', 1.25),
    key('MetaLeft', 'Win', 1.25),
    key('AltLeft', 'Alt', 1.25),
    key('Space', 'Space', 6.25),
    key('AltRight', 'Alt', 1.25),
    key('MetaRight', 'Win', 1.25),
    key('ContextMenu', 'Menu', 1.25),
    key('ControlRight', 'Ctrl', 1.25),
  ],
]
const functionRow = [
  key('Escape', 'Esc'),
  ...Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`)),
  key('Delete', 'Del'),
  key('End', 'End'),
]
export function layoutRows(layout: '60' | '75' | 'full'): Key[][] {
  if (layout === '60') return baseRows
  const rows = baseRows.map((r) => r.map((k) => ({ ...k })))
  if (layout === '75') {
    rows[0]!.push(key('Home', 'Home'))
    rows[1]!.push(key('PageUp', 'PgUp'))
    rows[2]!.push(key('PageDown', 'PgDn'))
    rows[3]!.push(key('ArrowUp', '↑'))
    rows[4]!.push(
      key('ArrowLeft', '←'),
      key('ArrowDown', '↓'),
      key('ArrowRight', '→'),
    )
    return [functionRow, ...rows]
  }
  const extras = [
    [
      key('Insert', 'Ins'),
      key('Home', 'Home'),
      key('PageUp', 'PgUp'),
      key('NumLock', 'Num'),
      key('NumpadDivide', '/'),
      key('NumpadMultiply', '*'),
      key('NumpadSubtract', '-'),
    ],
    [
      key('Delete', 'Del'),
      key('End', 'End'),
      key('PageDown', 'PgDn'),
      ...row(['Numpad7', 'Numpad8', 'Numpad9']),
      key('NumpadAdd', '+'),
    ],
    [...row(['Numpad4', 'Numpad5', 'Numpad6'])],
    [
      key('ArrowUp', '↑'),
      ...row(['Numpad1', 'Numpad2', 'Numpad3']),
      key('NumpadEnter', 'Enter'),
    ],
    [
      key('ArrowLeft', '←'),
      key('ArrowDown', '↓'),
      key('ArrowRight', '→'),
      key('Numpad0', '0', 2),
      key('NumpadDecimal', '.'),
    ],
  ]
  const top = [
    key('Escape', 'Esc'),
    ...Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`)),
    key('PrintScreen', 'PrtSc'),
    key('ScrollLock', 'ScrLk'),
    key('Pause', 'Pause'),
  ]
  return [top, ...rows.map((r, i) => [...r, ...extras[i]!])].map((r) =>
    r.map((k) => ({ ...k, label: k.label.replace('Numpad', '') })),
  )
}
export const allKeys = layoutRows('full').flat()
export const keyCodes = new Set(allKeys.map((k) => k.code))

// ANSI full-size geometry in key units, including the navigation island and numpad.
export function fullPosition(code: string) {
  if (code === 'Escape') return { x: 0, y: 0, height: 1 }
  if (/^F\d+$/.test(code)) {
    const n = +code.slice(1) - 1
    return { x: 2 + n + Math.floor(n / 4) * 0.5, y: 0, height: 1 }
  }
  const top = ['PrintScreen', 'ScrollLock', 'Pause'].indexOf(code)
  if (top >= 0) return { x: 15.5 + top, y: 0, height: 1 }
  for (let i = 0; i < baseRows.length; i++) {
    let x = 0
    for (const key of baseRows[i]!) {
      if (key.code === code) return { x, y: i + 1.5, height: 1 }
      x += key.width
    }
  }
  const nav = [
    ['Insert', 'Home', 'PageUp'],
    ['Delete', 'End', 'PageDown'],
    [],
    ['', 'ArrowUp'],
    ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
  ]
  for (let i = 0; i < nav.length; i++) {
    const x = nav[i]!.indexOf(code)
    if (x >= 0 && code) return { x: 15.5 + x, y: i + 1.5, height: 1 }
  }
  const pad = [
    ['NumLock', 'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract'],
    ['Numpad7', 'Numpad8', 'Numpad9', 'NumpadAdd'],
    ['Numpad4', 'Numpad5', 'Numpad6'],
    ['Numpad1', 'Numpad2', 'Numpad3', 'NumpadEnter'],
    ['Numpad0', '', 'NumpadDecimal'],
  ]
  for (let i = 0; i < pad.length; i++) {
    const x = pad[i]!.indexOf(code)
    if (x >= 0 && code)
      return {
        x: 19 + x,
        y: i + 1.5,
        height: ['NumpadAdd', 'NumpadEnter'].includes(code) ? 2 : 1,
      }
  }
  return { x: 0, y: 0, height: 1 }
}
