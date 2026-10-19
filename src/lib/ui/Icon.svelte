<script lang="ts">
  const paths = {
    keyboard:
      'M3 5h18v14H3z M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10',
    sliders: 'M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6',
    play: 'm9 5 11 7-11 7z',
    stop: 'M6 6h12v12H6z',
    undo: 'M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12',
    redo: 'm15 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12',
    volume: 'M11 5 6 9H3v6h3l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
    muted: 'M11 5 6 9H3v6h3l5 4zM16 9l5 6m0-6-5 6',
    copy: 'M9 8h11v13H9zM5 16H3V3h11v2',
    trash: 'M4 7h16M9 3h6l1 4H8zM6 7l1 14h10l1-14M10 11v6m4-6v6',
    plus: 'M12 5v14M5 12h14',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    upload: 'M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4',
    check: 'm5 12 4 4L19 6',
    layers: 'm12 3 10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6',
    music:
      'M9 18V5l11-2v13M9 8l11-2M9 18a3 3 0 1 1-3-3c2 0 3 1 3 3zm11-2a3 3 0 1 1-3-3c2 0 3 1 3 3z',
    sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
    arrow: 'M5 12h14m-5-5 5 5-5 5',
  } as const
  let { name, size = 18 }: { name: keyof typeof paths; size?: number } =
    $props()
</script>

<svg
  class="ui-icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.7"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"><path d={paths[name]} /></svg
>
