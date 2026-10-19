<script lang="ts">
  import type { Design } from '../design/model'
  import Icon from '../ui/Icon.svelte'
  import Button from '../ui/Button.svelte'
  let {
    design,
    designs,
    open,
    create,
    duplicate,
    remove,
    rename,
  }: {
    design: Design
    designs: Design[]
    open: (d: Design) => void
    create: (index: number) => void
    duplicate: () => void
    remove: () => void
    rename: (name: string) => void
  } = $props()
</script>

<div class="panel-heading">
  <span class="panel-icon"><Icon name="layers" size={18} /></span>
  <h2>Your designs</h2>
  <Button
    variant="ghost"
    compact
    aria-label="New design"
    title="New design"
    onclick={() => create(0)}><Icon name="plus" size={17} /></Button
  >
</div>
<p class="panel-description">A little collection of you.</p>
<div class="design-list">
  {#each designs as d (d.id)}<button
      class={['design-item', { active: d.id === design.id }]}
      aria-current={d.id === design.id ? 'true' : undefined}
      onclick={() => open(d)}
      ><span class="design-symbol" style:--design-color={d.appearance.accent}
        ><Icon name="keyboard" size={20} /></span
      ><span class="design-info"
        ><strong>{d.name}</strong><small
          >{d.layout === 'full' ? 'Full-size' : `${d.layout}%`} · {d.language.toUpperCase()}</small
        ></span
      >{#if d.id === design.id}<Icon name="check" size={14} />{/if}</button
    >{/each}
</div>
{#if !designs.length}<p>
    No saved designs yet. Your current work is still open.
  </p>{/if}
<div class="library-edit">
  <label
    >Design name<input
      aria-label="Design name"
      maxlength="80"
      value={design.name}
      onchange={(e) =>
        rename(e.currentTarget.value.trim() || 'Untitled design')}
    /></label
  >
  <div class="button-row">
    <Button variant="ghost" onclick={duplicate}
      ><Icon name="copy" size={15} />Duplicate</Button
    ><Button variant="ghost" onclick={remove}
      ><Icon name="trash" size={15} />Delete</Button
    >
  </div>
</div>
<div class="local-note">
  <Icon name="check" size={14} />
  <p>Just yours. Saved locally<br />in this browser.</p>
</div>
