<script lang="ts">
  import type { Studio } from './session.svelte'
  import { mediaHelp } from '../design/media-policy'
  let { studio, upload, busy }: { studio: Studio; upload: (file: File, kind: 'image' | 'audio') => void; busy: boolean } = $props()
</script>
<details><summary>Background image</summary><p>{mediaHelp}</p>
  <label>Upload or replace image<input type="file" accept="image/png,image/jpeg" disabled={busy} onchange={(e) => { const f = e.currentTarget.files?.[0]; if (f) upload(f, 'image'); e.currentTarget.value = '' }} /></label>
  {#if studio.design.background}
    <label>Image fit<select value={studio.design.background.fit} onchange={(e) => studio.change(d => { d.background!.fit = e.currentTarget.value as 'contain' | 'cover' })}><option value="cover">Fill</option><option value="contain">Fit</option></select></label>
    {#each (['x', 'y', 'dim'] as const) as key (key)}<label>{key === 'dim' ? 'Dim image' : key === 'x' ? 'Horizontal position' : 'Vertical position'}<input type="range" min="0" max={key === 'dim' ? 1 : 100} step={key === 'dim' ? .05 : 1} value={studio.design.background[key]} oninput={(e) => studio.change(d => { d.background![key] = +e.currentTarget.value }, `background:${key}`)} onchange={() => studio.history.endGroup()} /></label>{/each}
    <button onclick={() => studio.change(d => d.background = null)}>Remove background</button>
  {/if}
</details>
