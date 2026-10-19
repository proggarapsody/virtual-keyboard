export function editText(
  value: string,
  start: number,
  end: number,
  insert: string,
  backspace = false,
) {
  if (backspace && start === end && start > 0) {
    const before = Array.from(value.slice(0, start))
    start -= before.at(-1)!.length
  }
  return {
    value: value.slice(0, start) + insert + value.slice(end),
    caret: start + insert.length,
  }
}
