<script lang="ts">
  import type { Assignment, Asset } from '../design/model'
  let { clip, asset, change, audition }: { clip: Assignment['pool'][number]; asset: Asset; change: (start: number, end: number) => void; audition: () => void } = $props()
</script>
<div class="trim-controls"><strong>{asset.name}</strong>
  <div class="button-row"><label>Start (s)<input aria-label={`Trim start ${asset.name}`} type="number" min="0" max={clip.end - .001} step=".001" value={clip.start} onchange={(e) => change(Math.max(0, Math.min(clip.end - .001, +e.currentTarget.value)), clip.end)} /></label><label>End (s)<input aria-label={`Trim end ${asset.name}`} type="number" min={clip.start + .001} max={asset.duration ?? 10} step=".001" value={clip.end} onchange={(e) => change(clip.start, Math.max(clip.start + .001, Math.min(asset.duration ?? 10, +e.currentTarget.value)))} /></label></div>
  <label>Trim start<input type="range" min="0" max={clip.end - .001} step=".001" value={clip.start} onchange={(e) => change(+e.currentTarget.value, clip.end)} /></label>
  <label>Trim end<input type="range" min={clip.start + .001} max={asset.duration ?? 10} step=".001" value={clip.end} onchange={(e) => change(clip.start, +e.currentTarget.value)} /></label>
  <button onclick={audition}>Audition trimmed sample</button>
</div>
