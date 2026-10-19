<script lang="ts">
  import type { Studio } from './session.svelte'
  import type { Design } from '../design/model'
  let { studio }: { studio: Studio } = $props()
  const colors = ['cap', 'ink', 'board', 'page', 'accent'] as const
  const names = { cap: 'Key color', ink: 'Legend color', board: 'Keyboard background', page: 'Canvas background', accent: 'Effect color' }
  function appearance<K extends keyof Design['appearance']>(key: K, value: Design['appearance'][K], group?: string) { studio.change(d => d.appearance[key] = value, group) }
  function mixed(key: 'cap' | 'ink' | 'legend') {
    const values = studio.selection.map(c => studio.design.keys[c]?.[key])
    return new Set(values).size > 1 ? 'Mixed' : values[0] === undefined ? 'Inherited' : 'Overridden'
  }
</script>
<details open><summary>Appearance</summary>
  <p>Global defaults</p>
  {#each colors as key (key)}<label class="color-control">{names[key]}<input type="color" aria-label={names[key]} value={studio.design.appearance[key]} oninput={(e) => appearance(key, e.currentTarget.value, `color:${key}`)} onchange={() => studio.history.endGroup()} /></label>{/each}
  <label>Key font<select value={studio.design.appearance.font} onchange={(e) => appearance('font', e.currentTarget.value as Design['appearance']['font'])}><option value="sans">Humanist sans</option><option value="mono">Monospace</option><option value="serif">Book serif</option></select></label>
  {#each (['radius', 'gap'] as const) as key (key)}<label>{key === 'radius' ? 'Corner radius' : 'Key spacing'}: {studio.design.appearance[key]} px<input type="range" min={key === 'radius' ? 0 : 2} max={key === 'radius' ? 20 : 12} value={studio.design.appearance[key]} oninput={(e) => appearance(key, +e.currentTarget.value, key)} onchange={() => studio.history.endGroup()} /></label>{/each}
</details>
<details open><summary>Selected keys ({studio.selection.length})</summary>
  <div class="button-row">{#each (['letters', 'modifiers', 'function'] as const) as group (group)}<button onclick={() => studio.selection = studio.activeKeys.filter(k => k.group === group).map(k => k.code)}>{group[0].toUpperCase() + group.slice(1)}</button>{/each}</div>
  {#if studio.selection.length}
    {#each (['cap', 'ink'] as const) as key (key)}<label class="color-control">{names[key]} · {mixed(key)}<input type="color" aria-label={`Selected ${names[key].toLowerCase()}`} value={studio.design.keys[studio.selection[0]!]!?.[key] ?? studio.design.appearance[key]} onchange={(e) => studio.override({ [key]: e.currentTarget.value })} /></label>{/each}
    <label>Decorative legend · {mixed('legend')}<input aria-label="Decorative legend" maxlength="24" placeholder={mixed('legend')} value={new Set(studio.selection.map(c => studio.design.keys[c]?.legend)).size === 1 ? studio.design.keys[studio.selection[0]!]?.legend ?? '' : ''} onchange={(e) => studio.override({ legend: e.currentTarget.value })} /></label>
    <p>Legends change appearance. Typed characters follow the language.</p><button onclick={() => studio.reset()}>Reset selected to global</button>
  {:else}<p>Click a key. Shift-click to add keys, or select a group.</p>{/if}
</details>
