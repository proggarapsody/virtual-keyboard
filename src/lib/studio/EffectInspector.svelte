<script lang="ts">
  import type { Studio } from './session.svelte'
  import type { Design } from '../design/model'
  let { studio }: { studio: Studio } = $props()
</script>

<details>
  <summary>Press effect</summary>
  <label
    ><span>Effect</span><select
      value={studio.design.effect.type}
      onchange={(e) =>
        studio.change(
          (d) =>
            (d.effect.type = e.currentTarget.value as Design['effect']['type']),
        )}
      ><option value="physical">Physical press</option><option value="glow"
        >Glow</option
      ><option value="ripple">Ripple</option></select
    ></label
  >
  <label
    >Effect strength<input
      type="range"
      min="0"
      max="1"
      step=".05"
      value={studio.design.effect.strength}
      oninput={(e) =>
        studio.change(
          (d) => (d.effect.strength = +e.currentTarget.value),
          'strength',
        )}
      onchange={() => studio.history.endGroup()}
    /></label
  >
  <label
    >Effect duration (ms)<input
      type="number"
      min="80"
      max="600"
      value={studio.design.effect.duration}
      onchange={(e) =>
        studio.change(
          (d) =>
            (d.effect.duration = Math.max(
              80,
              Math.min(600, +e.currentTarget.value),
            )),
        )}
    /></label
  >
  <p>Reduced motion uses a restrained held-key highlight.</p>
</details>
