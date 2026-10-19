import { z } from 'zod'
import { keyCodes } from './layouts'
const color = z.string().regex(/^#[0-9a-f]{6}$/i)
export const clipSchema = z
  .object({
    asset: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),
    start: z.number().min(0).max(30),
    end: z.number().min(0.001).max(30),
  })
  .strict()
  .refine((v) => v.end > v.start, 'Trim end must follow start')
export const assignmentSchema = z
  .object({
    pool: z
      .array(clipSchema)
      .max(8)
      .refine(
        (pool) => new Set(pool.map((c) => c.asset)).size === pool.length,
        'A sample may appear only once in a pool',
      ),
    volume: z.number().min(0).max(1),
    pitch: z.number().min(-12).max(12),
  })
  .strict()
export type Assignment = z.infer<typeof assignmentSchema>
const keyStyleSchema = z
  .object({
    cap: color.optional(),
    ink: color.optional(),
    legend: z.string().max(24).optional(),
    press: assignmentSchema.optional(),
    release: assignmentSchema.optional(),
  })
  .strict()
export const designSchema = z
  .object({
    version: z.literal(1),
    id: z.string().uuid(),
    name: z.string().min(1).max(80),
    revision: z.number().int().min(0),
    layout: z.enum(['60', '75', 'full']),
    language: z.enum(['en', 'ru']),
    appearance: z
      .object({
        cap: color,
        ink: color,
        board: color,
        page: color,
        accent: color,
        font: z.enum(['sans', 'mono', 'serif']),
        radius: z.number().min(0).max(20),
        gap: z.number().min(2).max(12),
      })
      .strict(),
    keys: z.record(
      z.string().refine((v) => keyCodes.has(v), 'Unknown physical key'),
      keyStyleSchema,
    ),
    effect: z
      .object({
        type: z.enum(['physical', 'glow', 'ripple']),
        strength: z.number().min(0).max(1),
        duration: z.number().min(80).max(600),
      })
      .strict(),
    sound: z
      .object({ press: assignmentSchema, release: assignmentSchema })
      .strict(),
    background: z
      .object({
        asset: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),
        fit: z.enum(['contain', 'cover']),
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        dim: z.number().min(0).max(1),
      })
      .strict()
      .nullable(),
  })
  .strict()
export type Design = z.infer<typeof designSchema>
export type KeyStyle = z.infer<typeof keyStyleSchema>
export type Asset = {
  id: string
  name: string
  type: string
  blob: Blob
  duration?: number
  decodedBytes?: number
}
export function resolveStyle(d: Design, code: string) {
  return {
    cap: d.keys[code]?.cap ?? d.appearance.cap,
    ink: d.keys[code]?.ink ?? d.appearance.ink,
    legend: d.keys[code]?.legend,
  }
}
export function resolveSound(
  d: Design,
  code: string,
  phase: 'press' | 'release',
) {
  return d.keys[code]?.[phase] ?? d.sound[phase]
}
export function assetIds(d: Design) {
  return [
    ...new Set([
      ...(d.background ? [d.background.asset] : []),
      ...[
        d.sound.press,
        d.sound.release,
        ...Object.values(d.keys).flatMap((k) => [k.press, k.release]),
      ].flatMap((a) => a?.pool.map((c) => c.asset) ?? []),
    ]),
  ]
}
