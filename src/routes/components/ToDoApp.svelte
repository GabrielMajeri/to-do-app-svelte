<script lang="ts">
  import { tick } from "svelte";
  import ToDoItem from "./ToDoItem.svelte";

  let activeElement: HTMLElement | undefined = $state();
  let searchTerm = $state("");

  type ToDoItemData = {
    id: number;
    text: string;
    completed: boolean;
    input?: HTMLInputElement;
  };

  const initialToDoList = [
    {
      id: 1,
      text: "Do the dishes",
      completed: false,
    },
    {
      id: 2,
      text: "Read a book",
      completed: false,
    },
    {
      id: 3,
      text: "Learn Svelte",
      completed: false,
    },
  ];

  let toDoList: ToDoItemData[] = $state(initialToDoList.slice());

  const filteredToDoList = $derived.by(() => {
    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();
    return toDoList.filter(
      (item) =>
        item.input === activeElement ||
        item.text.toLocaleLowerCase().includes(lowerCaseSearchTerm),
    );
  });

  function getToDoById(toDoId: number): ToDoItemData | undefined {
    return toDoList.find((item) => item.id === toDoId);
  }

  function addToDo(afterId?: number) {
    console.log("Adding new to do");

    const id =
      toDoList
        .map((item) => item.id)
        .reduce((prev, curr) => Math.max(prev, curr), 0) + 1;

    const newToDo: ToDoItemData = {
      id,
      text: "",
      completed: false,
    };

    if (afterId) {
      let insertIndex = toDoList.findIndex((item) => item.id === afterId);
      if (insertIndex === -1) {
        insertIndex = toDoList.length - 1;
      } else {
        insertIndex += 1;
      }
      toDoList.splice(insertIndex, 0, newToDo);
    } else {
      toDoList.push(newToDo);
    }

    return id;
  }

  function focusToDo(toDoId: number) {
    getToDoById(toDoId)?.input?.focus();
  }

  function removeToDo(toDoId: number) {
    console.log("Removing to do with ID %d", toDoId);

    const index = toDoList.findIndex((item) => item.id === toDoId);
    if (index > -1) {
      toDoList.splice(index, 1);
    }
  }

  function resetToDoList() {
    toDoList = initialToDoList.slice();
  }
</script>

<svelte:document bind:activeElement />

<h1>To do app</h1>

<p>Your to do list:</p>

<div class="search-box-container">
  <span class="search-box">
    <label
      >Filter:
      <input
        type="search"
        autocomplete="off"
        placeholder="Search for to do..."
        bind:value={searchTerm}
      />
    </label>
  </span>
</div>

<ul>
  {#each filteredToDoList as toDo (toDo.id)}
    <ToDoItem
      bind:text={toDo.text}
      bind:completed={toDo.completed}
      bind:input={toDo.input}
      onkeydown={(event) => {
        if (event.key === "Enter") {
          // Only add a new to do if we're not currently filtering to dos.
          if (searchTerm === "") {
            const newToDoId = addToDo(toDo.id);
            tick().then(() => focusToDo(newToDoId));
          }

          event.preventDefault();
        } else if (event.key === "Backspace") {
          if (toDo.text === "" && searchTerm === "") {
            // Try focusing the to do item just above this one,
            // if it exists.
            const toDoItemIndex = filteredToDoList.findIndex(
              (item) => item.id === toDo.id,
            );
            let previousToDoId = null;
            if (toDoItemIndex > 0) {
              previousToDoId = filteredToDoList[toDoItemIndex - 1].id;
            }

            removeToDo(toDo.id);

            if (previousToDoId !== null) {
              const toDoItem = getToDoById(previousToDoId)!;
              const previousInput = toDoItem.input;
              const end = previousInput?.value?.length || 0;
              previousInput?.setSelectionRange(end, end);
              previousInput?.focus();
            }

            event.preventDefault();
          }
        }
      }}
    />
  {/each}
</ul>
{#if filteredToDoList.length === 0}
  {#if searchTerm === ""}
    <p>No items in your to do list.</p>
  {:else}
    <p>No items were found matching the search criteria.</p>
  {/if}
{:else if searchTerm === ""}
  <p>There are {toDoList.length} items in your to do list.</p>
{:else}
  <p>Found {filteredToDoList.length} matching items.</p>
{/if}
<p>
  <button onclick={() => addToDo()}>Add to do</button>
  <button onclick={() => resetToDoList()}>Reset</button>
</p>

<style>
  h1,
  p {
    text-align: center;
  }

  h1 {
    margin-top: 5rem;
  }

  ul {
    list-style-type: none;
    text-align: center;
  }

  .search-box-container {
    text-align: center;
  }
</style>
