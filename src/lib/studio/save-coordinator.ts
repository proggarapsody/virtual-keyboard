import type { Design, Asset } from '../design/model'
import type { Repository } from '../library/repository'
type Job = {
  design: Design
  assets: Asset[]
  waiters: { resolve: () => void; reject: (e: unknown) => void }[]
}
export class SaveCoordinator {
  private running?: Promise<void>
  private pending = new Map<string, Job>()
  private revisions = new Map<string, number>()
  private conflicts = new Set<string>()
  constructor(private repository: Repository) {}
  seed(designs: Design[]) {
    for (const d of designs) this.revisions.set(d.id, d.revision)
  }
  save(design: Design, assets: Asset[]) {
    const snapshot = structuredClone(design)
    const promise = new Promise<void>((resolve, reject) => {
      const previous = this.pending.get(snapshot.id)
      this.pending.set(snapshot.id, {
        design: snapshot,
        assets,
        waiters: [...(previous?.waiters ?? []), { resolve, reject }],
      })
    })
    this.kick()
    return promise
  }
  private kick() {
    if (this.running) return
    this.running = this.drain().finally(() => {
      this.running = undefined
      if (this.pending.size) this.kick()
    })
  }
  private async drain() {
    while (this.pending.size) {
      const [id, job] = this.pending.entries().next().value!
      this.pending.delete(id)
      try {
        if (this.conflicts.has(id))
          throw new Error(
            'Saving is paused after a conflict. Duplicate or export this design.',
          )
        await this.repository.save(
          job.design,
          job.assets,
          this.revisions.get(id),
        )
        this.revisions.set(id, job.design.revision)
        for (const waiter of job.waiters) waiter.resolve()
      } catch (error) {
        if (error instanceof Error && /another tab/.test(error.message))
          this.conflicts.add(id)
        for (const waiter of job.waiters) waiter.reject(error)
      }
    }
  }
  async flush() {
    while (this.running) await this.running
  }
}
