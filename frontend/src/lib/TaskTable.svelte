<!-- UserTable.svelte -->
<script>
  // State for storing the user data
  let apiUrl = 'http://localhost:3000/api/get_tasks';
  let tasks = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let newDesc = $state("");

  // Function to fetch data from API
  async function fetchTasks() {
    try {
      isLoading = true;
      error = null;
      
      // Replace with your actual API endpoint
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      tasks = await response.json();
    } catch (err) {
      error = err.message;
      console.error("Error fetching tasks:", err);
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  }

  function handleCheckboxChange(task) {
    if (task.is_completed) {
      // If checked, set completion date
      task.date_completed = new Date().toISOString();
    } else {
      // If unchecked, clear completion date
      task.date_completed = null;
    }
    // You might want to trigger an API update here
    updateTask(task);
  }
  
  async function updateTask(updatedTask) {
    // Toggle completion of task
    fetch(`http://localhost:3000/api/tasks/${updatedTask.id}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    }).then(response => {
      if (!response.ok) throw new Error('Update failed');
    }).catch(error => {
      console.error('Error updating task:', error);
      // Revert the checkbox if update fails
      updatedTask.is_completed = !updatedTask.is_completed;
      updatedTask.date_completed = updatedTask.is_completed ? new Date().toISOString() : null;
    })
  }

  async function submitTask(){
    // Add new task
    fetch(`http://localhost:3000/api/submit_task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"newDesc":newDesc})
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit new task.');
      } else {
        return response.json()
      }
    }).then(data => {
      console.log(data);
      tasks.push(data);
      newDesc = "";
    })
    .catch(error => {
      console.error('Error creating new task:', error);
    })
  }

  // Fetch data when component mounts
  fetchTasks();
</script>

<div class="task-table-container">
  {#if isLoading}
    <p>Loading user data...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
    <button on:click={fetchTasks}>Retry</button>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Date Added</th>
          <th>Date Completed</th>
          <th>Complete</th>
        </tr>
      </thead>
      <tbody>
        {#each tasks as task (task.id)}
          <tr>
            <td>{task.description}</td>
            <td>{formatDate(task.date_added)}</td>
            <td>{formatDate(task.date_completed)}</td>
            <td><input 
              type="checkbox" 
              bind:checked={task.is_completed}
              on:change={() => handleCheckboxChange(task)}
            ></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<div>
  <h1>Add New Task</h1>
  <p>New Task Description</p>
  <textarea rows="4" cols="50" bind:value={newDesc}></textarea><br /><br />
  <button on:click={submitTask}>Submit New Task</button>
</div>

<style>
  .task-table-container {
    margin: 1rem;
    font-family: Arial, sans-serif;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #333333;
    position: sticky;
    top: 0;
  }

  tr:nth-child(even) {
    background-color: #7d7d7d;
  }

  tr:hover {
    background-color: #000000;
  }

  .error {
    color: red;
  }

</style>