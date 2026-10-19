<script lang="ts">
  import { messages as m } from './messages'
  import Icon from '../ui/Icon.svelte'
  import Button from '../ui/Button.svelte'
  let {
    state,
    enable,
    volume,
    muted,
    listen,
    active = false,
  }: {
    state: string
    enable: () => void
    volume: number
    muted: boolean
    listen: (volume: number, muted: boolean) => void
    active?: boolean
  } = $props()
</script>

<div
  class={[
    'audio-controls',
    { 'audio-active': active && state === 'running' && !muted },
  ]}
  aria-label="Listening controls"
>
  <Button
    class="audio-enable"
    variant="ghost"
    onclick={enable}
    disabled={state === 'Loading sounds…'}
    ><span class="audio-wave" aria-hidden="true"
      ><i></i><i></i><i></i><i></i><i></i></span
    ><span
      >{state === 'running'
        ? m.soundEnabled
        : state === 'suspended'
          ? m.resumeSound
          : state === 'Loading sounds…'
            ? state
            : m.enableSound}<small aria-hidden="true"
        >{muted
          ? 'Muted'
          : state === 'running'
            ? 'Ready when you are'
            : 'Give your keyboard a voice'}</small
      ></span
    ></Button
  >
  <div class="listening-volume">
    <Icon name="volume" size={17} /><label
      ><span
        >{m.masterVolume}<span class="volume-value"
          >{Math.round(volume * 100)}%</span
        ></span
      ><input
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
  <Button
    variant="ghost"
    class="mute-control"
    aria-pressed={muted}
    aria-label="Mute"
    title={muted ? 'Unmute' : 'Mute'}
    onclick={() => listen(volume, !muted)}
    ><Icon name={muted ? 'muted' : 'volume'} size={18} /><span>Mute</span
    ></Button
  >
</div>
