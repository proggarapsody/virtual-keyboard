<script lang="ts">
  import type { Studio } from './session.svelte'
  import { layoutRows } from '../design/layouts'
  import { resolveStyle } from '../design/model'
  import { output } from '../design/languages'
  let { studio, typeKey }: { studio: Studio; typeKey: (code: string) => void } = $props()
  let rows = $derived(layoutRows(studio.design.layout))
  let a = $derived(studio.design.appearance)
  const fonts = { sans: 'system-ui, sans-serif', mono: 'ui-monospace, monospace', serif: 'Georgia, serif' }
  const repeats = new Map<number, ReturnType<typeof setTimeout>>()
  function stop(id: number) { clearTimeout(repeats.get(id)); repeats.delete(id); studio.up(`pointer:${id}`) }
  function start(e: PointerEvent, code: string) {
    if (studio.mode === 'edit') return
    e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    studio.down(`pointer:${e.pointerId}`, code); typeKey(code)
    if (output(code, studio.design.language, false, false) || code === 'Backspace') {
      const repeat = () => { if (studio.input.pressed.has(code)) { typeKey(code); repeats.set(e.pointerId, setTimeout(repeat, 65)) } }
      repeats.set(e.pointerId, setTimeout(repeat, 450))
    }
  }
</script>
<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable keyboard viewport requires keyboard access.) -->
<div class="keyboard-scroll" tabindex="0" role="region" aria-label="Keyboard canvas. Scroll horizontally for larger layouts">
  <div class="board" style:background={a.board} style:--gap={`${a.gap}px`} style:--radius={`${a.radius}px`} style:font-family={fonts[a.font]} style:--accent={a.accent} style:--duration={`${studio.design.effect.duration}ms`} style:--strength={studio.design.effect.strength}>
    {#each rows as row, i (i)}
      <div class="key-row">
        {#each row as key (key.code)}
          {@const style = resolveStyle(studio.design, key.code)}
          <button class={['key', studio.design.effect.type, { pressed: studio.pressed.includes(key.code), selected: studio.selection.includes(key.code) && studio.mode === 'edit' }]}
            data-code={key.code} aria-label={`${key.code}${studio.mode === 'edit' ? ' select' : ''}`} aria-pressed={studio.mode === 'edit' ? studio.selection.includes(key.code) : studio.pressed.includes(key.code)}
            style:--units={key.width} style:background={style.cap} style:color={style.ink}
            onclick={(e) => { if (studio.mode === 'edit') studio.select(key.code, e.shiftKey); else if (e.detail === 0) { studio.down(`assist:${key.code}`, key.code); typeKey(key.code); studio.up(`assist:${key.code}`) } }}
            onpointerdown={(e) => start(e, key.code)} onpointerup={(e) => stop(e.pointerId)} onpointercancel={(e) => stop(e.pointerId)} onlostpointercapture={(e) => stop(e.pointerId)}
            onkeydown={(e) => { if (studio.mode === 'play' && ['Enter', ' '].includes(e.key)) { e.preventDefault(); studio.down(`button:${key.code}`, key.code); typeKey(key.code) } }}
            onkeyup={(e) => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); studio.up(`button:${key.code}`) } }} onblur={() => studio.up(`button:${key.code}`)}>
            <span>{style.legend ?? (output(key.code, studio.design.language, studio.shift, studio.caps).trim() || key.label)}</span>
            {#if studio.mode === 'edit' && studio.selection.includes(key.code)}<span class="selection-mark" aria-hidden="true">✓</span>{/if}
            {#if key.code === 'CapsLock' && studio.caps}<span class="caps-mark">On</span>{/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>
