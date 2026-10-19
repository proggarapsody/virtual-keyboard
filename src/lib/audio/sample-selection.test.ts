import { expect, it } from 'vitest'
import { chooseSample } from './sample-selection'
it('never repeats a choice immediately, including extreme random values', () => {
  for (let last = 0; last < 8; last++)
    for (const random of [0, 0.5, 0.999999])
      expect(chooseSample(8, last, () => random)).not.toBe(last)
  expect(chooseSample(1, 0)).toBe(0)
  expect(chooseSample(0, undefined)).toBe(-1)
})
