<script lang="ts">
  import type { Studio } from './session.svelte'
  import type { Assignment, Asset } from '../design/model'
  import { resolveSound } from '../design/model'
  import { mediaHelp } from '../design/media-policy'
  import SampleTrimmer from './SampleTrimmer.svelte'
  let { studio, assets, upload, audition, busy }: { studio: Studio; assets: Asset[]; upload: (file: File, kind: 'image' | 'audio') => void; audition: (assignment: Assignment) => void; busy: boolean } = $props()
  let target = $state<'global' | 'selected'>('global')
  let phase = $state<'press' | 'release'>('press')
  let selected = $derived(target === 'selected' && studio.selection.length > 0)
  let assignment = $derived(selected ? resolveSound(studio.design, studio.selection[0]!, phase) : studio.design.sound[phase])
  let inherited = $derived(selected && studio.selection.every(c => !studio.design.keys[c]?.[phase]))
  let mixed = $derived(selected && new Set(studio.selection.map(c => JSON.stringify(resolveSound(studio.design, c, phase)))).size > 1)
  function update(next: Assignment) {
    studio.change(d => { if (selected) for (const c of studio.selection) d.keys[c] = { ...d.keys[c], [phase]: next }; else d.sound[phase] = next })
  }
  function toggle(asset: Asset) {
    const pool = assignment.pool.some(c => c.asset === asset.id) ? assignment.pool.filter(c => c.asset !== asset.id) : [...assignment.pool, { asset: asset.id, start: 0, end: Math.min(asset.duration ?? .12, 10) }]
    if (pool.length > 8) { studio.error = 'A sample pool can contain up to 8 samples.'; return }
    update({ ...assignment, pool })
  }
</script>
<details><summary>Sound assignments</summary>
  <label>Apply sound to<select bind:value={target}><option value="global">Global default</option><option value="selected" disabled={!studio.selection.length}>Selected keys ({studio.selection.length})</option></select></label>
  <label>Trigger<select bind:value={phase}><option value="press">Press</option><option value="release">Release</option></select></label>
  <p>{mixed ? 'Mixed assignments. Editing applies to every selected key.' : inherited ? 'Inherited from global.' : selected ? 'Selected-key override.' : 'Global default.'}</p>
  <div class="button-row"><button onclick={() => audition(assignment)}>Preview {phase} sound</button><button onclick={() => update({ ...assignment, pool: [] })}>Silence</button></div>
  {#if selected}<button onclick={() => studio.change(d => { for (const c of studio.selection) { const next = { ...d.keys[c] }; delete next[phase]; d.keys[c] = next } })}>Inherit {phase} sound</button>{/if}
  <label>Assignment volume<input type="range" min="0" max="1" step=".01" value={assignment.volume} onchange={(e) => update({ ...assignment, volume: +e.currentTarget.value })} /></label>
  <label>Pitch (semitones)<input type="number" min="-12" max="12" step="1" value={assignment.pitch} onchange={(e) => update({ ...assignment, pitch: Math.max(-12, Math.min(12, +e.currentTarget.value)) })} /></label>
  <h3>Sample pool ({assignment.pool.length}/8)</h3><p>Multiple samples vary without repeating immediately. An empty pool is silent.</p>
  {#each assets.filter(a => a.type.startsWith('audio/')) as asset (asset.id)}<label class="sample-choice"><input type="checkbox" checked={assignment.pool.some(c => c.asset === asset.id)} onchange={() => toggle(asset)} />{asset.name}</label>{/each}
  {#each assignment.pool as clip, i (clip.asset)}{@const asset = assets.find(a => a.id === clip.asset)}{#if asset}<SampleTrimmer {clip} {asset} change={(start, end) => update({ ...assignment, pool: assignment.pool.map((c, j) => j === i ? { ...c, start, end } : c) })} audition={() => audition({ ...assignment, pool: [clip] })} />{/if}{/each}
  <p>{mediaHelp}</p><label>Upload audio sample<input type="file" accept="audio/wav,audio/mpeg,audio/ogg,.wav,.mp3,.ogg" disabled={busy} onchange={(e) => { const f = e.currentTarget.files?.[0]; if (f) upload(f, 'audio'); e.currentTarget.value = '' }} /></label>
  <p>New uploads become the global press sound. Select them here for other assignments.</p>
</details>
