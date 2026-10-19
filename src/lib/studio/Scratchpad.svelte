<script lang="ts">
  import type { Studio } from './session.svelte'
  let { studio, setElement }: { studio: Studio; setElement: (node: HTMLTextAreaElement) => void } = $props()
</script>
<section class="scratchpad">
  <div class="section-heading"><h2>Scratchpad</h2><span>Temporary text</span><button onclick={() => studio.scratch = ''}>Clear text</button></div>
  <textarea aria-label="Scratchpad" placeholder="Switch to Play and make yourself heard…" bind:value={studio.scratch} spellcheck="false" {@attach (node) => setElement(node)}></textarea>
</section>
