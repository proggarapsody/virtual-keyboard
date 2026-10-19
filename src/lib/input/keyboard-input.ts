export class PressLifecycle {
  private sources = new Map<string, string>()
  down(source: string, code: string) {
    if (this.sources.has(source)) return false
    const first = ![...this.sources.values()].includes(code)
    this.sources.set(source, code)
    return first
  }
  up(source: string) {
    const code = this.sources.get(source)
    this.sources.delete(source)
    return code && ![...this.sources.values()].includes(code) ? code : undefined
  }
  get pressed() {
    return new Set(this.sources.values())
  }
  clear() {
    this.sources.clear()
  }
}
export function isEditorField(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest('input,select,textarea,[contenteditable=true],button,a')
  )
}
