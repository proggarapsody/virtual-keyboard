<script lang="ts">
  import type { Artist } from './artist.svelte'
  import Icon from '../ui/Icon.svelte'
  import Button from '../ui/Button.svelte'
  let { studio }: { studio: Artist } = $props()
</script>

<header class="studio-header glass-panel">
  <a class="brand" href="./"
    ><span class="brand-mark"><Icon name="keyboard" size={23} /></span><span
      >Keyboard Artist<small>Your personal keyboard studio</small></span
    ></a
  >
  <div class="mode-switch" aria-label="Workspace mode">
    <Button
      variant="ghost"
      class={studio.mode === 'edit' ? 'mode-current' : ''}
      aria-pressed={studio.mode === 'edit'}
      onclick={() => {
        if (studio.mode !== 'edit') studio.setMode()
      }}><Icon name="sliders" size={16} />Edit</Button
    ><Button
      variant="primary"
      class="mode-play"
      aria-pressed={studio.mode === 'play'}
      onclick={() => studio.setMode()}
      ><Icon
        name={studio.mode === 'edit' ? 'play' : 'stop'}
        size={15}
      />{studio.mode === 'edit' ? 'Play keyboard' : 'Exit Play'}</Button
    >
  </div>
  <div class="toolbar">
    <span class="save-state" data-state={studio.saveStatus} role="status"
      ><i aria-hidden="true"></i>{studio.saveStatus}</span
    >
    <div class="history-controls">
      <Button
        variant="ghost"
        compact
        aria-label="Undo"
        title="Undo"
        onclick={() => studio.undo()}
        disabled={!studio.historyVersion || !studio.history.canUndo}
        ><Icon name="undo" size={17} /></Button
      ><Button
        variant="ghost"
        compact
        aria-label="Redo"
        title="Redo"
        onclick={() => studio.undo(true)}
        disabled={!studio.historyVersion || !studio.history.canRedo}
        ><Icon name="redo" size={17} /></Button
      >
    </div>
  </div>
</header>
