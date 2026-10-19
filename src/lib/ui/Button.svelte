<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  type Props = HTMLButtonAttributes & {
    variant?: 'primary' | 'secondary' | 'ghost'
    compact?: boolean
    children: Snippet
  }
  let {
    variant = 'secondary',
    compact = false,
    children,
    class: className,
    ...attributes
  }: Props = $props()
</script>

<button
  class={['button', `button-${variant}`, { compact }, className]}
  {...attributes}>{@render children()}</button
>
