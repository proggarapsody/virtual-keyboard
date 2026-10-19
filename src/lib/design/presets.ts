import type { Assignment, Design } from './model'
const sound = (asset: string, volume: number): Assignment => ({
  pool: [{ asset, start: 0, end: 0.12 }],
  volume,
  pitch: 0,
})
export const presetNames = [
  'Tactile mechanical',
  'Quiet minimalist',
  'Color study',
]
export function preset(index = 0): Design {
  const d: Design = {
    version: 1,
    id: crypto.randomUUID(),
    name: presetNames[index]!,
    revision: 0,
    layout: '60',
    language: 'en',
    appearance: {
      cap: '#d9d4c9',
      ink: '#292c30',
      board: '#34383d',
      page: '#292d32',
      accent: '#f3bc69',
      font: 'sans',
      radius: 7,
      gap: 6,
    },
    keys: {},
    effect: { type: 'physical', strength: 0.7, duration: 180 },
    sound: {
      press: sound('mechanical', 0.55),
      release: sound('release', 0.25),
    },
    background: null,
  }
  for (const code of ['Escape', 'Enter', 'CapsLock'])
    d.keys[code] = { cap: '#edb66a', ink: '#302416' }
  if (index === 1) {
    d.appearance = {
      ...d.appearance,
      cap: '#eeeef0',
      ink: '#30363f',
      board: '#b8bec8',
      page: '#dce0e6',
      accent: '#426293',
      radius: 4,
      gap: 5,
    }
    d.keys = {}
    d.sound = {
      press: sound('soft', 0.25),
      release: { pool: [], volume: 0.2, pitch: 0 },
    }
    d.effect.type = 'glow'
    d.effect.strength = 0.3
  }
  if (index === 2) {
    d.appearance = {
      ...d.appearance,
      cap: '#c9b6df',
      ink: '#342842',
      board: '#443852',
      page: '#322a3c',
      accent: '#f4bdce',
      font: 'mono',
      radius: 10,
      gap: 7,
    }
    for (const c of 'QWERTYUIOP')
      d.keys[`Key${c}`] = { cap: '#c1d9cf', ink: '#253e35' }
    for (const c of 'ASDFGHJKL')
      d.keys[`Key${c}`] = { cap: '#e8bfd0', ink: '#452e38' }
    d.sound = {
      press: {
        pool: [
          { asset: 'tone', start: 0, end: 0.12 },
          { asset: 'soft', start: 0, end: 0.12 },
        ],
        volume: 0.4,
        pitch: 0,
      },
      release: sound('release', 0.15),
    }
    d.effect.type = 'ripple'
  }
  return d
}
