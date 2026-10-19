<script lang="ts">
  import { messages as m } from './messages'
  import type { Studio } from './session.svelte'
  let {
    studio,
    setElement,
  }: { studio: Studio; setElement: (node: HTMLTextAreaElement) => void } =
    $props()
</script>

<section class="scratchpad">
  <div class="section-heading">
    <h2>{m.scratchpad}</h2>
    <span>{m.temporaryText}</span><button onclick={() => (studio.scratch = '')}
      >{m.clearText}</button
    >
  </div>
  <textarea
    aria-label="Scratchpad"
    placeholder={studio.mode === 'play' ? m.playPlaceholder : m.editPlaceholder}
    bind:value={studio.scratch}
    spellcheck="false"
    {@attach (node) => setElement(node)}></textarea>
</section>
