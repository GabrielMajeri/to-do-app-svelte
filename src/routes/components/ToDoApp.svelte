<script module>
  const TO_DO_LIST_KEY = "toDoList";

  type ToDoItemData = {
    id: number;
    text: string;
    completed: boolean;
  };

  const savedToDoListData = localStorage.getItem(TO_DO_LIST_KEY);
  const savedToDoList: ToDoItemData[] = savedToDoListData
    ? JSON.parse(savedToDoListData)
    : null;
</script>

<script lang="ts">
  import { tick } from "svelte";
  import ToDoItem from "./ToDoItem.svelte";

  let activeElement: HTMLElement | undefined = $state();
  let searchTerm = $state("");
  let saving = $state(false);

  interface ToDoItemElementData extends ToDoItemData {
    input?: HTMLInputElement;
  }

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

  let toDoList: ToDoItemElementData[] = $state(
    savedToDoList || initialToDoList,
  );

  $effect(() => {
    saving = true;
    const serializedToDoList = toDoList.map((item) => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
    }));
    localStorage.setItem(TO_DO_LIST_KEY, JSON.stringify(serializedToDoList));
    saving = false;
  });

  const filteredToDoList = $derived.by(() => {
    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();
    return toDoList.filter(
      (item) =>
        item.input === activeElement ||
        item.text.toLocaleLowerCase().includes(lowerCaseSearchTerm),
    );
  });

  function getToDoById(toDoId: number): ToDoItemElementData | undefined {
    return toDoList.find((item) => item.id === toDoId);
  }

  type AddToDoOptions = {
    text?: string;
    afterId?: number;
    focus?: boolean;
  };

  function addToDo(options?: AddToDoOptions) {
    console.log("Adding new to do");

    const id =
      toDoList
        .map((item) => item.id)
        .reduce((prev, curr) => Math.max(prev, curr), 0) + 1;

    const newToDo: ToDoItemData = {
      id,
      text: options?.text ?? "",
      completed: false,
    };

    if (options?.afterId !== undefined) {
      let insertIndex = toDoList.findIndex(
        (item) => item.id === options.afterId,
      );
      if (insertIndex === -1) {
        insertIndex = toDoList.length - 1;
      } else {
        insertIndex += 1;
      }
      toDoList.splice(insertIndex, 0, newToDo);
    } else {
      toDoList.push(newToDo);
    }

    if (options?.focus) {
      tick().then(() => {
        const toDoItem = toDoList.find((item) => item.id === id);
        toDoItem?.input?.focus();
      });
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
            const newToDoId = addToDo({ afterId: toDo.id });
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
  <li>
    <button onclick={() => addToDo({ focus: true })}>Add to do</button>
  </li>
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
{#if saving}
  <p>Saving to dos to local storage...</p>
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

  ul li {
    margin-top: 16px;
    margin-bottom: 24px;
  }

  .search-box-container {
    text-align: center;
  }
</style>
