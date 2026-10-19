<script lang="ts">
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import PresetPreview from '../studio/PresetPreview.svelte'
  let muted = $state(false)
  let volume = $state(0.7)
  const colors = [
    'text-primary',
    'text-secondary',
    'text-muted',
    'surface-glass',
    'surface-raised',
    'surface-inset',
    'accent',
    'success',
    'danger',
  ]
</script>

<main class="system-page">
  <header class="glass-panel system-intro">
    <a href="./">← Back to the studio</a>
    <h1>Soft light. Solid controls.</h1>
    <p>
      A smoked-glass workspace with tactile keys, warm typography, and a little
      dusk color. These are the live tokens and components used by the app.
    </p>
  </header>
  <section class="glass-panel system-section">
    <h2>Palette & materials</h2>
    <div class="system-swatches">
      {#each colors as color (color)}<div>
          <i style:background={`var(--${color})`}></i><code>--{color}</code>
        </div>{/each}
    </div>
    <p>
      Glass panels use a blurred backdrop with a solid fallback. Authored
      keyboard colors stay independent of the interface palette.
    </p>
  </section>
  <section class="glass-panel system-section">
    <h2>Type & rhythm</h2>
    <h1>Your keyboard, your signature.</h1>
    <p class="system-body">
      Manrope Variable gives the interface a soft, compact voice. Keyboard
      legends retain their own selectable font.
    </p>
    <div class="system-spacing">
      {#each [4, 8, 12, 16, 20, 24, 32] as space (space)}<div>
          <i style:width={`${space}px`}></i><code>{space}px</code>
        </div>{/each}
    </div>
  </section>
  <section class="glass-panel system-section">
    <h2>Actions & feedback</h2>
    <div class="system-actions">
      <Button variant="primary"
        ><Icon name="play" size={15} />Primary action</Button
      ><Button><Icon name="plus" size={16} />Secondary</Button><Button
        variant="ghost">Quiet action</Button
      ><Button disabled>Unavailable</Button><Button
        variant="ghost"
        aria-pressed={muted}
        onclick={() => (muted = !muted)}
        ><Icon name={muted ? 'muted' : 'volume'} size={17} />{muted
          ? 'Muted'
          : 'Sound on'}</Button
      >
    </div>
    <p>
      Tab through controls to inspect the independent focus ring. Feedback lasts
      160 ms; reduced motion is respected.
    </p>
  </section>
  <section class="glass-panel system-section">
    <h2>Fields & disclosure</h2>
    <div class="system-fields">
      <label>Design name<input value="Evening practice" /></label><label
        >Keyboard language<select
          ><option>English</option><option>Русский</option></select
        ></label
      ><label
        >Volume · {Math.round(volume * 100)}%<input
          type="range"
          min="0"
          max="1"
          step=".01"
          bind:value={volume}
        /></label
      >
    </div>
    <details>
      <summary>Progressive disclosure</summary>
      <p>
        Secondary settings stay within a continuous panel, separated by a fine
        rule.
      </p>
    </details>
  </section>
  <section class="glass-panel system-section">
    <h2>Authored starting points</h2>
    <div class="system-presets">
      {#each ['Tactile mechanical', 'Quiet minimalist', 'Color study'] as name, index (name)}<div
        >
          <PresetPreview {index} />
          <h2>{name}</h2>
        </div>{/each}
    </div>
    <p>
      These previews derive from real preset colors. The studio wallpaper and
      interface font are excluded from portable designs.
    </p>
  </section>
</main>

<style>
  .system-page {
    max-width: 1000px;
    margin: auto;
    padding: 32px 24px 64px;
    display: grid;
    gap: 20px;
  }
  .system-intro,
  .system-section {
    padding: 32px;
  }
  .system-intro a {
    font-size: 11px;
    text-underline-offset: 4px;
  }
  .system-intro h1 {
    margin-top: 26px;
    font-size: clamp(30px, 5vw, 48px);
    letter-spacing: -0.04em;
  }
  .system-intro > p:last-child {
    max-width: 570px;
    margin-top: 18px;
    font-size: 13px;
  }
  .system-section > h2 {
    margin-bottom: 26px;
    color: var(--text-secondary);
    font-size: 12px;
  }
  .system-section > p {
    margin-top: 23px;
    font-size: 11px;
    max-width: 630px;
  }
  .system-swatches {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .system-swatches i {
    display: block;
    height: 64px;
    border: 1px solid var(--line-subtle);
    border-radius: 12px;
    margin-bottom: 8px;
  }
  code {
    font-size: 10px;
    color: var(--text-secondary);
  }
  .system-body {
    font-size: 13px !important;
  }
  .system-spacing {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-top: 24px;
  }
  .system-spacing i {
    height: 24px;
    display: block;
    background: var(--accent);
    border-radius: 3px;
    margin-bottom: 8px;
  }
  .system-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .system-fields,
  .system-presets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  .system-fields label {
    margin: 0;
  }
  .system-presets > div {
    min-width: 0;
  }
  .system-presets h2 {
    margin-top: 12px;
    font-size: 11px;
  }
  .system-presets :global(.preset-preview) {
    min-height: 120px;
    border-radius: 16px;
  }
  @media (max-width: 600px) {
    .system-page {
      padding: 12px 12px 32px;
      gap: 14px;
    }
    .system-intro,
    .system-section {
      padding: 23px;
    }
    .system-swatches {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .system-fields,
    .system-presets {
      grid-template-columns: 1fr;
    }
    .system-spacing {
      gap: 20px;
    }
  }
</style>
