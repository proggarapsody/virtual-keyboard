import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Asset, Design } from '../design/model'
interface LibraryDB extends DBSchema {
  designs: { key: string; value: Design }
  assets: { key: string; value: Asset }
  preferences: { key: string; value: string }
}
export class Repository {
  private database?: Promise<IDBPDatabase<LibraryDB>>
  private db() {
    return this.database ??= openDB<LibraryDB>('keyboard-artist', 1, {
      upgrade(db) { db.createObjectStore('designs', { keyPath: 'id' }); db.createObjectStore('assets', { keyPath: 'id' }); db.createObjectStore('preferences') },
      blocked() { /* Rejection below keeps the current in-memory design available. */ },
    })
  }
  async list() { return (await this.db()).getAll('designs') }
  async assets() { return (await this.db()).getAll('assets') }
  async active() { return (await this.db()).get('preferences', 'active') }
  async activate(id: string) { return (await this.db()).put('preferences', id, 'active') }
  async save(design: Design, assets: Asset[], expected?: number) {
    const db = await this.db()
    const tx = db.transaction(['designs', 'assets'], 'readwrite')
    void tx.done.catch(() => {})
    const existing = await tx.objectStore('designs').get(design.id)
    if (existing && existing.revision !== expected) { tx.abort(); await tx.done.catch(() => {}); throw new Error('This design changed in another tab. Duplicate or export your work to preserve both versions.') }
    if (!existing && expected !== undefined) { tx.abort(); await tx.done.catch(() => {}); throw new Error('This design was deleted in another tab. Duplicate or export your work.') }
    for (const asset of assets) await tx.objectStore('assets').put(asset)
    await tx.objectStore('designs').put(design)
    await tx.done
  }
  async delete(id: string) { await (await this.db()).delete('designs', id) }
}
