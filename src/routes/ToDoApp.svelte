<script lang="ts">
  import { tick } from "svelte";

  type ToDoItem = {
    id: number;
    text: string;
    input?: HTMLInputElement;
  };

  let activeElement: HTMLElement | undefined = $state();
  let searchTerm = $state("");

  let toDoList: ToDoItem[] = $state([
    {
      id: 1,
      text: "Do the dishes",
    },
    {
      id: 2,
      text: "Read a book",
    },
    {
      id: 3,
      text: "Learn Svelte",
    },
  ]);

  const filteredToDoList = $derived.by(() => {
    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();
    return toDoList.filter(
      (item) =>
        item.input === activeElement ||
        item.text.toLocaleLowerCase().includes(lowerCaseSearchTerm),
    );
  });

  function getToDoById(toDoId: number): ToDoItem | undefined {
    return toDoList.find((item) => item.id === toDoId);
  }

  function addToDo(afterId?: number) {
    console.log("Adding new to do");

    const id =
      toDoList
        .map((item) => item.id)
        .reduce((prev, curr) => Math.max(prev, curr), 0) + 1;

    const newToDo = {
      id,
      text: "",
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
    toDoList = toDoList.filter((item) => item.id !== toDoId);
  }
</script>

<svelte:document bind:activeElement />

<h1>To do app</h1>

<p>Your to do list:</p>
<label
  >Filter:
  <input
    type="search"
    placeholder="Search for to do..."
    bind:value={searchTerm}
  />
</label>
<ul>
  {#each filteredToDoList as toDo (toDo.id)}
    <li>
      <input
        type="text"
        bind:value={toDo.text}
        bind:this={toDo.input}
        placeholder="What needs to be done?"
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

              if (previousToDoId) {
                tick().then(() => {
                  const toDoItem = getToDoById(previousToDoId)!;
                  const previousInput = toDoItem.input;
                  const end = previousInput?.value?.length || 0;
                  previousInput?.setSelectionRange(end, end);
                  previousInput?.focus();
                });
              }

              event.preventDefault();
            }
          }
        }}
      />
    </li>
  {/each}
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
</ul>
<button onclick={() => addToDo()}>Add to do</button>
