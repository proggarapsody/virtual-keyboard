<script lang="ts">
  import { presetNames } from '../design/presets'
  import PresetPreview from './PresetPreview.svelte'
  import Icon from '../ui/Icon.svelte'
  let {
    create,
    disabled = false,
  }: { create: (index: number) => void; disabled?: boolean } = $props()
  const descriptions = [
    'A little weight. A satisfying click.',
    'Less noise. More space to think.',
    'A brighter kind of feedback.',
  ]
</script>

<section class="preset-shelf" aria-labelledby="presets-title">
  <div class="section-heading">
    <h2 id="presets-title">Find your starting point</h2>
    <span>Make it yours</span>
  </div>
  <div class="preset-grid">
    {#each presetNames as name, index (name)}<button
        class="preset-item"
        {disabled}
        onclick={() => create(index)}
        ><PresetPreview {index} /><span class="preset-caption"
          ><strong>{name}</strong><small aria-hidden="true"
            >{descriptions[index]}</small
          ></span
        ><span class="preset-action" aria-hidden="true"
          ><Icon name="arrow" size={15} /></span
        ></button
      >{/each}
  </div>
</section>
