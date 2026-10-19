<script lang="ts">
  import { preset } from '../design/presets'
  let { index }: { index: number } = $props()
  const codes = ['QWERTYUI', 'ASDFGHJ', 'ZXCVBN']
  let design = $derived(preset(index))
</script>

<div
  class="preset-preview"
  aria-hidden="true"
  style:--preview-board={design.appearance.board}
  style:--preview-cap={design.appearance.cap}
  style:--preview-accent={design.appearance.accent}
>
  <div class="preview-board">
    {#each codes as row (row)}<div class="preview-row">
        {#each [...row] as letter (letter)}<i
            style:background={design.keys[`Key${letter}`]?.cap ??
              design.appearance.cap}
          ></i>{/each}
      </div>{/each}
    <div class="preview-row">
      <i class="preview-space"></i><i
        class="preview-enter"
        style:background={design.appearance.accent}
      ></i>
    </div>
  </div>
</div>
