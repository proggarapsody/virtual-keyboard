import type { Design, Asset } from '../design/model'
import type { Repository } from '../library/repository'
export class SaveCoordinator {
  private queue: Promise<void> = Promise.resolve()
  private revisions = new Map<string, number>()
  private conflicts = new Set<string>()
  constructor(private repository: Repository) {}
  seed(designs: Design[]) { for (const d of designs) this.revisions.set(d.id, d.revision) }
  save(design: Design, assets: Asset[]) {
    const snapshot = structuredClone(design)
    const operation = this.queue.then(async () => {
      if (this.conflicts.has(snapshot.id)) throw new Error('Saving is paused after a conflict. Duplicate or export this design.')
      try {
        await this.repository.save(snapshot, assets, this.revisions.get(snapshot.id))
        this.revisions.set(snapshot.id, snapshot.revision)
      } catch (error) {
        if (error instanceof Error && /another tab/.test(error.message)) this.conflicts.add(snapshot.id)
        throw error
      }
    })
    this.queue = operation.catch(() => {})
    return operation
  }
  async flush() { await this.queue }
}
