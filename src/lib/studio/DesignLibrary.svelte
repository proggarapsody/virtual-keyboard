<script lang="ts">
  import type { Design } from '../design/model'
  import { presetNames } from '../design/presets'
  let { design, designs, open, create, duplicate, remove, rename }: { design: Design; designs: Design[]; open: (d: Design) => void; create: (index: number) => void; duplicate: () => void; remove: () => void; rename: (name: string) => void } = $props()
</script>
<h2>Your designs</h2><p>Saved on this browser.</p>
{#each designs as d (d.id)}<button class={['design-item', { active: d.id === design.id }]} aria-current={d.id === design.id ? 'true' : undefined} onclick={() => open(d)}>{d.name}</button>{/each}
{#if !designs.length}<p>No saved designs yet. Your current work is still open.</p>{/if}
<label>Design name<input aria-label="Design name" maxlength="80" value={design.name} onchange={(e) => rename(e.currentTarget.value.trim() || 'Untitled design')} /></label>
<div class="button-row"><button onclick={duplicate}>Duplicate</button><button onclick={remove}>Delete</button></div>
<h2>Start from a preset</h2><p>Creates a new design, keeping your work.</p>
{#each presetNames as name, index (name)}<button class="preset-item" onclick={() => create(index)}><span class={`preset-swatch preset-${index}`} aria-hidden="true"></span>{name}</button>{/each}
