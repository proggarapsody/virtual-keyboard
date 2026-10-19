import { z } from 'zod'
import { designSchema } from '../design/model'
import { limits } from '../design/media-policy'
export const manifestSchema = z.object({
  format: z.literal('keyboard-artist'), version: z.literal(1), design: designSchema,
  assets: z.array(z.object({ id: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/), name: z.string().max(80), sha256: z.string().regex(/^[0-9a-f]{64}$/), type: z.enum(['audio/wav', 'audio/mpeg', 'audio/ogg', 'image/png', 'image/jpeg']), duration: z.number().min(.001).max(10).optional() }).strict()).max(limits.assets),
}).strict()
export const notices = 'Keyboard Artist original built-in PCM samples may be redistributed with designs. System fonts are not embedded. Uploaded media belongs to its respective rights holders. No scratchpad text or editor preferences are included.'

export async function mediaHash(bytes: ArrayBuffer) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('') }
