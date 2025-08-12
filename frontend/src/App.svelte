<script>
  import Counter from './lib/Counter.svelte'
  import TaskTable from './lib/TaskTable.svelte'
</script>

<main>
  <h1>Task Table</h1>
  <TaskTable apiUrl='http://localhost:3000/api/get_tasks' />
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
