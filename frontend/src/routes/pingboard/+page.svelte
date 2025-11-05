<script>
    let baseURL = "http://localhost:8080/api/pingboard/";
    let { data } = $props();
    let { loadedServices, loadError } = data;
    let services = $state(loadedServices);

    

</script>

<div class="pingboard-content">
    {#if loadError}
        <div class="load-error">Error getting data from server, please try again.</div>
    {:else if services}
        {#each services as service (service.id)}
            <div><a href="{service.base_url}" rel="noopener noreferrer" target="_blank">{service.name}</a></div>
            <div>{service.description}</div>
            <div>Uptime percentage: {Number(service.uptime_percentage).toFixed(3)}%</div>
            <div>Total Checks Logged: {service.total_checks}</div>
        {/each}
    {:else}
        <div>Loading...</div>
    {/if}

</div>

<style>
    
</style>