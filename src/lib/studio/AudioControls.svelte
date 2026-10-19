<script lang="ts">
  import { messages as m } from './messages'
  let {
    state,
    enable,
    volume,
    muted,
    listen,
  }: {
    state: string
    enable: () => void
    volume: number
    muted: boolean
    listen: (volume: number, muted: boolean) => void
  } = $props()
</script>

<div class="audio-controls" aria-label="Listening controls">
  <button onclick={enable} disabled={state === 'Loading sounds…'}
    >{state === 'running'
      ? m.soundEnabled
      : state === 'suspended'
        ? m.resumeSound
        : state === 'Loading sounds…'
          ? state
          : m.enableSound}</button
  >
  <button
    aria-pressed={muted}
    aria-label="Mute"
    onclick={() => listen(volume, !muted)}>{muted ? m.unmute : m.mute}</button
  >
  <label
    >{m.masterVolume}<input
      aria-label="Master volume"
      type="range"
      min="0"
      max="1"
      step=".01"
      value={volume}
      oninput={(e) => listen(+e.currentTarget.value, muted)}
    /></label
  >
</div>
