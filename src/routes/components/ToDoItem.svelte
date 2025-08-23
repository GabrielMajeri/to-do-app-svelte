<script lang="ts">
  import type { KeyboardEventHandler } from "svelte/elements";

  type Props = {
    text?: string;
    completed?: boolean;
    input?: HTMLInputElement;
    onkeydown?: KeyboardEventHandler<HTMLInputElement>;
  };

  let {
    text = $bindable(),
    completed = $bindable(),
    input = $bindable(),
    onkeydown,
  }: Props = $props();
</script>

<li class={completed ? "completed" : ""}>
  <input type="checkbox" autocomplete="off" bind:checked={completed} />
  <input
    type="text"
    bind:value={text}
    bind:this={input}
    disabled={completed}
    autocomplete="off"
    placeholder="What needs to be done?"
    {onkeydown}
  />
</li>

<style>
  input {
    border: none;
  }

  .completed input {
    text-decoration: line-through;
    font-style: italic;
  }
</style>
