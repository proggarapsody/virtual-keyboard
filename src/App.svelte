<script lang="ts">
  import { onMount } from 'svelte'
  import AppearanceInspector from './lib/studio/AppearanceInspector.svelte'
  import DesignLibrary from './lib/studio/DesignLibrary.svelte'
  import { Repository } from './lib/library/repository'
  import { SaveCoordinator } from './lib/studio/save-coordinator'
  import { preset } from './lib/design/presets'
  import { designSchema, type Design, type Asset } from './lib/design/model'
  import { Studio } from './lib/studio/session.svelte'
  import Keyboard from './lib/studio/Keyboard.svelte'
  import Scratchpad from './lib/studio/Scratchpad.svelte'
  import { output } from './lib/design/languages'
  import { isEditorField } from './lib/input/keyboard-input'
  const studio = new Studio()
  let scratch: HTMLTextAreaElement | undefined
  const repository = new Repository()
  const saver = new SaveCoordinator(repository)
  let designs = $state.raw<Design[]>([])
  let assets = new Map<string, Asset>()
  let ready = $state(false)
  let saving = 0
  let deleteDialog: HTMLDialogElement
  async function save() {
    if (!ready) return
    const snapshot = studio.design, ticket = ++saving
    designs = [...designs.filter(d => d.id !== snapshot.id), snapshot]
    studio.saveStatus = 'Saving…'
    try {
      await saver.save(snapshot, [...assets.values()])
      if (studio.design.id === snapshot.id && saving === ticket) studio.saveStatus = 'Saved'
    } catch (e) {
      if (studio.design.id === snapshot.id) { studio.saveStatus = 'Unsaved'; studio.error = `${e instanceof Error ? e.message : 'Storage is unavailable.'} Your work remains open. Export a backup.` }
    }
  }
  studio.onEdit = () => { void save() }
  async function openDesign(d: Design) {
    await saver.flush()
    studio.open(designs.find(item => item.id === d.id) ?? d)
    studio.saveStatus = 'Saved'; studio.error = ''
    void repository.activate(d.id).catch(() => {})
  }
  async function create(index: number) {
    await saver.flush(); studio.open(preset(index)); await save()
    void repository.activate(studio.design.id).catch(() => {})
  }
  async function duplicate() {
    const d = structuredClone(studio.design); d.id = crypto.randomUUID(); d.name = `${d.name.slice(0, 70)} copy`; d.revision = 0
    await saver.flush(); studio.open(d); await save(); void repository.activate(d.id).catch(() => {})
  }
  async function removeDesign() {
    const id = studio.design.id
    await saver.flush()
    try {
      await repository.delete(id); designs = designs.filter(d => d.id !== id)
      deleteDialog.close()
      if (designs.length) await openDesign(designs[0]!); else await create(0)
    } catch { studio.error = 'Deletion failed. The design remains available.'; deleteDialog.close() }
  }
  onMount(() => {
    let disposed = false
    void (async () => {
      try {
        const [stored, media, active] = await Promise.all([repository.list(), repository.assets(), repository.active()])
        if (disposed) return
        designs = stored.map(d => designSchema.parse(d)); saver.seed(designs)
        assets = new Map(media.map(a => [a.id, a]))
        const selected = designs.find(d => d.id === active) ?? designs[0]
        if (selected) studio.open(selected)
        ready = true
        if (selected) studio.saveStatus = 'Saved'; else await save()
      } catch { ready = true; studio.saveStatus = 'Unsaved'; studio.error = 'Local storage is unavailable. Your work remains in memory; export a backup.' }
    })()
    return () => { disposed = true; studio.cancel() }
  })
  function typeKey(code: string) {
    if (!scratch || ['CapsLock', 'Tab'].includes(code) || /Shift|Alt|Control|Meta/.test(code)) return
    const text = code === 'Enter' || code === 'NumpadEnter' ? '\n' : output(code, studio.design.language, studio.shift, studio.caps)
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
      e.preventDefault(); typeKey(e.code)
    }
  }
</script>
<svelte:window onkeydown={keydown} onkeyup={(e) => studio.up(`physical:${e.code}`)} onblur={() => studio.cancel()} />
<svelte:document onvisibilitychange={() => { if (document.hidden) studio.cancel() }} />
<div class={['studio', { playing: studio.mode === 'play' }]}>
  <header><a class="brand" href="./">Keyboard Artist<span>Make every key yours.</span></a><div class="toolbar"><span role="status">{studio.saveStatus}</span><button onclick={() => studio.undo()} disabled={!studio.historyVersion || !studio.history.canUndo}>Undo</button><button onclick={() => studio.undo(true)} disabled={!studio.historyVersion || !studio.history.canRedo}>Redo</button><button class="primary" onclick={() => studio.setMode()}>{studio.mode === 'edit' ? 'Play keyboard' : 'Exit Play'}</button></div></header>
  {#if studio.error}<div role="alert" class="error">{studio.error}<button onclick={() => studio.error = ''}>Dismiss</button></div>{/if}
  <aside class="library"><DesignLibrary design={studio.design} {designs} open={(d) => void openDesign(d)} create={(i) => void create(i)} duplicate={() => void duplicate()} remove={() => deleteDialog.showModal()} rename={(name) => studio.change(d => d.name = name)} /></aside>
  <main>
    <div class="canvas-heading"><div><h1>{studio.design.name}</h1><p>{studio.mode === 'edit' ? 'Select a key to give it a little character.' : 'Play with your keyboard or touch the keys.'}</p></div><label>Language<select aria-label="Language" value={studio.design.language} onchange={(e) => { studio.cancel(); studio.change(d => d.language = e.currentTarget.value as 'en' | 'ru') }}><option value="en">English</option><option value="ru">Русский</option></select></label></div>
    <section class="canvas" style:background={studio.design.appearance.page} aria-label="Design preview"><Keyboard {studio} {typeKey} /></section>
    <div class="canvas-footer"><span>{studio.design.layout}% ANSI · {studio.mode === 'edit' ? `${studio.selection.length} selected` : 'Play mode'}</span><button onclick={() => studio.showScratch = !studio.showScratch}>{studio.showScratch ? 'Hide scratchpad' : 'Show scratchpad'}</button></div>
    {#if studio.showScratch}<Scratchpad {studio} setElement={(node) => scratch = node} />{/if}
  </main>
  <aside class="inspector"><h2>Design settings</h2><p>Customize the whole keyboard or select individual keys.</p><label>Layout<select value={studio.design.layout} onchange={(e) => { studio.cancel(); studio.change(d => d.layout = e.currentTarget.value as '60' | '75' | 'full') }}><option value="60">ANSI 60%</option><option value="75">ANSI 75%</option><option value="full">Full-size</option></select></label><AppearanceInspector {studio} /></aside>
</div>

<dialog bind:this={deleteDialog}><h2>Delete “{studio.design.name}”?</h2><p>This removes this design from this browser. Export a backup before deleting.</p><div class="button-row"><button onclick={() => deleteDialog.close()}>Keep design</button><button onclick={() => void removeDesign()}>Delete design</button></div></dialog>
