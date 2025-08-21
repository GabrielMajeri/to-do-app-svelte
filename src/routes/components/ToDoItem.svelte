<script lang="ts">
  import type { KeyboardEventHandler } from "svelte/elements";

  type Props = {
    text?: string;
    input?: HTMLInputElement;
    onkeydown?: KeyboardEventHandler<HTMLInputElement>;
  };

  let { text = $bindable(), input = $bindable(), onkeydown }: Props = $props();
</script>

<li>
  <input
    type="text"
    bind:value={text}
    bind:this={input}
    autocomplete="off"
    placeholder="What needs to be done?"
    {onkeydown}
  />
</li>
