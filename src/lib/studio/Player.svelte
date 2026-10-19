<script lang="ts">
  import type { Artist } from './artist.svelte'
  import { presetNames } from '../design/presets'
  import TransferControls from './TransferControls.svelte'
  let { studio }: { studio: Artist } = $props()
</script>
<div class="mobile-picker">
  <label>Local design<select aria-label="Local design" value={studio.design.id} onchange={(e) => { const d = studio.designs.find(d => d.id === e.currentTarget.value); if (d) void studio.openDesign(d) }}>{#each studio.designs as d (d.id)}<option value={d.id}>{d.name}</option>{/each}</select></label>
  <label>Start from preset<select aria-label="Start from preset" value="" onchange={(e) => { if (e.currentTarget.value !== '') void studio.create(+e.currentTarget.value); e.currentTarget.value = '' }}><option value="">Choose a preset</option>{#each presetNames as name, i (name)}<option value={i}>{name}</option>{/each}</select></label>
  <details><summary>Portable designs</summary><TransferControls exportFile={() => void studio.exportFile()} importFile={(f, replace) => void studio.importFile(f, replace)} busy={studio.mediaBusy} /></details>
  <p>Swipe the space around the keyboard to scroll. Touch and hold keys to play together. Full editing is available on desktop.</p>
</div>
