import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Asset, Design } from '../design/model'
type StoredAsset = Omit<Asset, 'blob'> & { bytes?: ArrayBuffer; blob?: Blob }
interface LibraryDB extends DBSchema {
  designs: { key: string; value: Design }
  assets: { key: string; value: StoredAsset }
  preferences: { key: string; value: string }
}
export class Repository {
  private storedAssets = new Set<string>()
  private database?: Promise<IDBPDatabase<LibraryDB>>
  private db() {
    if (!this.database) {
      this.database = new Promise<IDBPDatabase<LibraryDB>>(
        (resolve, reject) => {
          let settled = false
          const fail = (error: Error) => {
            if (!settled) {
              settled = true
              reject(error)
            }
          }
          const timer = setTimeout(
            () =>
              fail(
                new Error(
                  'Local storage did not respond. Export your work and reload to retry.',
                ),
              ),
            5000,
          )
          const opening = openDB<LibraryDB>('keyboard-artist', 1, {
            upgrade(db) {
              db.createObjectStore('designs', { keyPath: 'id' })
              db.createObjectStore('assets', { keyPath: 'id' })
              db.createObjectStore('preferences')
            },
            blocked() {
              clearTimeout(timer)
              fail(
                new Error(
                  'Local storage is blocked by another tab. Close other tabs, export your work, and reload.',
                ),
              )
            },
            blocking: () => {
              void opening.then((db) => db.close())
              this.database = undefined
              this.storedAssets.clear()
            },
            terminated: () => {
              this.database = undefined
              this.storedAssets.clear()
            },
          })
          void opening.then(
            (db) => {
              clearTimeout(timer)
              if (settled) {
                db.close()
                return
              }
              settled = true
              resolve(db)
            },
            (error) => {
              clearTimeout(timer)
              fail(error)
            },
          )
        },
      )
    }
    return this.database
  }
  async list() {
    return (await this.db()).getAll('designs')
  }
  async assets(): Promise<Asset[]> {
    const records = await (await this.db()).getAll('assets')
    this.storedAssets = new Set(records.map((a) => a.id))
    return records.map(({ bytes, blob, ...metadata }) => {
      if (!bytes && !blob) throw new Error('Stored media is missing its bytes.')
      return {
        ...metadata,
        blob: blob ?? new Blob([bytes!], { type: metadata.type }),
      }
    })
  }
  async active() {
    return (await this.db()).get('preferences', 'active')
  }
  async activate(id: string) {
    return (await this.db()).put('preferences', id, 'active')
  }
  async save(design: Design, assets: Asset[], expected?: number) {
    // Materialize bytes before opening the transaction; no asynchronous media work inside it.
    const fresh = await Promise.all(
      assets
        .filter((a) => !this.storedAssets.has(a.id))
        .map(async ({ blob, ...meta }) => ({
          ...meta,
          bytes: await blob.arrayBuffer(),
        })),
    )
    const db = await this.db()
    const tx = db.transaction(['designs', 'assets'], 'readwrite')
    void tx.done.catch(() => {})
    const existing = await tx.objectStore('designs').get(design.id)
    if (existing && existing.revision !== expected) {
      tx.abort()
      await tx.done.catch(() => {})
      throw new Error(
        'This design changed in another tab. Duplicate or export your work to preserve both versions.',
      )
    }
    if (!existing && expected !== undefined) {
      tx.abort()
      await tx.done.catch(() => {})
      throw new Error(
        'This design was deleted in another tab. Duplicate or export your work.',
      )
    }
    for (const asset of fresh) await tx.objectStore('assets').put(asset)
    await tx.objectStore('designs').put(design)
    await tx.done
    for (const asset of fresh) this.storedAssets.add(asset.id)
  }
  async delete(id: string) {
    await (await this.db()).delete('designs', id)
  }
}
