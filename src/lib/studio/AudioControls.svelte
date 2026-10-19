<script lang="ts">
  let { state, enable, volume, muted, listen }: { state: string; enable: () => void; volume: number; muted: boolean; listen: (volume: number, muted: boolean) => void } = $props()
</script>
<div class="audio-controls" aria-label="Listening controls">
  <button onclick={enable} disabled={state === 'Loading sounds…'}>{state === 'running' ? 'Sound enabled' : state === 'suspended' ? 'Resume sound' : state === 'Loading sounds…' ? state : 'Enable sound'}</button>
  <button aria-pressed={muted} aria-label="Mute" onclick={() => listen(volume, !muted)}>{muted ? 'Unmute' : 'Mute'}</button>
  <label>Master volume<input aria-label="Master volume" type="range" min="0" max="1" step=".01" value={volume} oninput={(e) => listen(+e.currentTarget.value, muted)} /></label>
</div>
