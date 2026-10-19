<script lang="ts">
  import { onMount } from 'svelte'
  import AppearanceInspector from './lib/studio/AppearanceInspector.svelte'
  import DesignLibrary from './lib/studio/DesignLibrary.svelte'
  import { Artist } from './lib/studio/artist.svelte'
  import BackgroundInspector from './lib/studio/BackgroundInspector.svelte'
  import EffectInspector from './lib/studio/EffectInspector.svelte'
  import SoundInspector from './lib/studio/SoundInspector.svelte'
  import Player from './lib/studio/Player.svelte'
  import TransferControls from './lib/studio/TransferControls.svelte'
  import AudioControls from './lib/studio/AudioControls.svelte'
  import Keyboard from './lib/studio/Keyboard.svelte'
  import Scratchpad from './lib/studio/Scratchpad.svelte'
  import { output } from './lib/design/languages'
  import { isEditorField } from './lib/input/keyboard-input'
  const studio = new Artist()
  let scratch: HTMLTextAreaElement | undefined
  let deleteDialog: HTMLDialogElement
  onMount(() => { if (matchMedia('(max-width: 1099px)').matches) studio.mode = 'play'; void studio.initialize(); return () => studio.dispose() })
  function typeKey(code: string, shift = studio.shift, caps = studio.caps) {
    if (!scratch || ['CapsLock', 'Tab'].includes(code) || /Shift|Alt|Control|Meta/.test(code)) return
    const text = code === 'Enter' || code === 'NumpadEnter' ? '\n' : output(code, studio.design.language, shift, caps)
    if (!text && code !== 'Backspace') return
    scratch.focus({ preventScroll: true })
    // Browser editing preserves native caret, selection replacement, and text undo.
    document.execCommand(code === 'Backspace' ? 'delete' : 'insertText', false, text)
    studio.scratch = scratch.value
  }
  function keydown(e: KeyboardEvent) {
    if (e.isComposing) return
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if (studio.mode === 'edit' && !isEditorField(e.target) && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); studio.undo(e.shiftKey) }
      return
    }
    if (studio.mode !== 'play' || (isEditorField(e.target) && e.target !== scratch) || e.code === 'Tab') return
    studio.down(`physical:${e.code}`, e.code)
    const text = output(e.code, studio.design.language, e.shiftKey, e.getModifierState('CapsLock'))
    if (text || ['Enter', 'NumpadEnter', 'Backspace'].includes(e.code)) {
      e.preventDefault(); typeKey(e.code, e.shiftKey, e.getModifierState('CapsLock'))
    }
  }
</script>
<svelte:window onkeydown={keydown} onkeyup={(e) => studio.up(`physical:${e.code}`)} onblur={() => studio.cancel()} />
<svelte:document onvisibilitychange={() => { if (document.hidden) studio.cancel() }} />
<div class={['studio', { playing: studio.mode === 'play' }]}>
  <header><a class="brand" href="./">Keyboard Artist<span>Make every key yours.</span></a><div class="toolbar"><span role="status">{studio.saveStatus}</span><button onclick={() => studio.undo()} disabled={!studio.historyVersion || !studio.history.canUndo}>Undo</button><button onclick={() => studio.undo(true)} disabled={!studio.historyVersion || !studio.history.canRedo}>Redo</button><button class="primary" onclick={() => studio.setMode()}>{studio.mode === 'edit' ? 'Play keyboard' : 'Exit Play'}</button></div><AudioControls state={studio.audioState} volume={studio.volume} muted={studio.muted} enable={() => void studio.enableSound()} listen={(volume, muted) => studio.listen(volume, muted)} /></header>
  {#if studio.error}<div role="alert" class="error">{studio.error}<button onclick={() => void studio.exportFile()}>Export backup</button><button onclick={() => studio.error = ''}>Dismiss</button></div>{/if}
  <aside class="library" aria-label="Design library"><DesignLibrary design={studio.design} designs={studio.designs} open={(d) => void studio.openDesign(d)} create={(i) => void studio.create(i)} duplicate={() => void studio.duplicate()} remove={() => deleteDialog.showModal()} rename={(name) => studio.change(d => d.name = name)} /><TransferControls exportFile={() => void studio.exportFile()} importFile={(f, replace) => void studio.importFile(f, replace)} busy={studio.mediaBusy} /></aside>
  <main>
    <Player {studio} />
    <div class="canvas-heading"><div><h1>{studio.design.name}</h1><p>{studio.mode === 'edit' ? 'Select a key to give it a little character.' : 'Play with your keyboard or touch the keys.'}</p></div><label>Language<select aria-label="Language" value={studio.design.language} onchange={(e) => { studio.cancel(); studio.change(d => d.language = e.currentTarget.value as 'en' | 'ru') }}><option value="en">English</option><option value="ru">Русский</option></select></label></div>
    <section class="canvas" style:background={studio.design.appearance.page} aria-label="Design preview">{#if studio.design.background}<div class="canvas-background" style:background-image={`url("${studio.assetUrl(studio.design.background.asset)}")`} style:background-size={studio.design.background.fit} style:background-position={`${studio.design.background.x}% ${studio.design.background.y}%`} style:opacity={1 - studio.design.background.dim}></div>{/if}<Keyboard {studio} {typeKey} /></section>
    <div class="canvas-footer"><span>{studio.design.layout}% ANSI · {studio.mode === 'edit' ? `${studio.selection.length} selected` : 'Play mode'}</span><button onclick={() => studio.showScratch = !studio.showScratch}>{studio.showScratch ? 'Hide scratchpad' : 'Show scratchpad'}</button></div>
    {#if studio.showScratch}<Scratchpad {studio} setElement={(node) => scratch = node} />{/if}
  </main>
  <aside class="inspector" aria-label="Design inspector"><h2>Design settings</h2><p>Customize the whole keyboard or select individual keys.</p><label>Layout<select aria-label="Layout" value={studio.design.layout} onchange={(e) => { studio.cancel(); studio.change(d => d.layout = e.currentTarget.value as '60' | '75' | 'full') }}><option value="60">ANSI 60%</option><option value="75">ANSI 75%</option><option value="full">Full-size</option></select></label><AppearanceInspector {studio} /><BackgroundInspector {studio} upload={(f, kind) => void studio.upload(f, kind)} busy={studio.mediaBusy} /><EffectInspector {studio} /><SoundInspector {studio} assets={studio.assetList} upload={(f, kind) => void studio.upload(f, kind)} busy={studio.mediaBusy} audition={(a) => void studio.audition(a)} /></aside>
</div>

<dialog bind:this={deleteDialog}><h2>Delete “{studio.design.name}”?</h2><p>This removes this design from this browser. Export a backup before deleting.</p><div class="button-row"><button onclick={() => deleteDialog.close()}>Keep design</button><button onclick={() => void studio.removeDesign().then(() => deleteDialog.close()).catch(e => { studio.error = studio.message(e); deleteDialog.close() })}>Delete design</button></div></dialog>
