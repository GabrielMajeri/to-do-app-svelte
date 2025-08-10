<script lang="ts">
    const toDoList = [
        {
            id: 1,
            text: "Do the dishes"
        },
        {
            id: 2,
            text: "Read a book"
        },
        {
            id: 3,
            text: "Learn Svelte"
        }
    ]
</script>

<h1>To do app</h1>
<p>My to do list:</p>
<ul>
    {#each toDoList as toDo (toDo.id)}
        <li>{toDo.text}</li>
    {/each}
</ul>
