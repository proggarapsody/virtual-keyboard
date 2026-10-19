export class History<T> {
  private past: T[] = []
  private future: T[] = []
  private lastGroup?: string
  record(value: T, group?: string) {
    if (!group || group !== this.lastGroup)
      this.past.push(structuredClone(value))
    if (this.past.length > 100) this.past.shift()
    this.lastGroup = group
    this.future = []
  }
  undo(current: T) {
    const value = this.past.pop()
    if (!value) return
    this.future.push(structuredClone(current))
    this.lastGroup = undefined
    return value
  }
  redo(current: T) {
    const value = this.future.pop()
    if (!value) return
    this.past.push(structuredClone(current))
    this.lastGroup = undefined
    return value
  }
  get canUndo() {
    return this.past.length > 0
  }
  get canRedo() {
    return this.future.length > 0
  }
  clear() {
    this.past = []
    this.future = []
    this.lastGroup = undefined
  }
  endGroup() {
    this.lastGroup = undefined
  }
}
