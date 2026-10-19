<script lang="ts">
  let {
    exportFile,
    importFile,
    busy,
  }: {
    exportFile: () => void
    importFile: (file: File, replace: boolean) => void
    busy: boolean
  } = $props()
  let replace = $state(false)
</script>

<div class="transfer-controls">
  <button disabled={busy} onclick={exportFile}>Export design</button><label
    >Import design<input
      aria-label="Import design"
      type="file"
      accept=".keyboard-artist,.zip"
      disabled={busy}
      onchange={(e) => {
        const file = e.currentTarget.files?.[0]
        if (file) importFile(file, replace)
        e.currentTarget.value = ''
      }}
    /></label
  ><label class="sample-choice"
    ><input type="checkbox" bind:checked={replace} />Replace current design on
    import</label
  >
  <p>
    Up to 32 MiB. New imports create a separate design unless replacement is
    explicitly selected.
  </p>
</div>
