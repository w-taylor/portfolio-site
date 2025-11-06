<script>
    let baseURL = "http://localhost:8080/api/pingboard/";
    let { data } = $props();
    let { loadedServices, loadError } = data;
    let services = $state(loadedServices);

    let modalDisplay = $state("none");
    let modalChecks = $state([]);
    let modalService = $state({});

    let savedChecks = $state({});
    let detailErrors = $state({});

    function toggleModal() {
        if (modalDisplay === "none") {
            modalDisplay = "block";
        } else {
            modalDisplay = "none";
        }
    }

    // Get data on last 50 checks on a service
    async function getDetailInfo(service){
        let sid = service.id;
        detailErrors[sid] = false;

        // Don't request checks again if already saved in browser memory
        if (!(sid in savedChecks)) {
            try {
                let checkRes = await fetch(baseURL+sid+'/checks');
                savedChecks[sid] = await checkRes.json();
            } catch (error) {
                console.error(`Error getting checks for service with id ${sid}:`, error);
                detailErrors[sid] = true;
                return;
            }
        }
        modalChecks = savedChecks[sid];
        modalService = service;
        toggleModal();
    }

    // format timestamps to yyyy-mm-dd hh:mm (keep in UTC)
    function formatTimestamp(utcTimestamp) {
        try {
            const date = new Date(utcTimestamp);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date string');
            }
            
            return date.toISOString().replace('T', ' ').slice(0, 16);
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return "-";
        }
    }


</script>

<div class="pingboard-content">
    <div class="pb-modal" style="display: {modalDisplay};">
        <div class="pb-modal-content">
            <div onclick={toggleModal} style="float: right; font-size: 2em;">&times;</div>
            {#if modalService}
                <div>{modalService.name}</div>
                <div>Uptime percentage: {Number(modalService.uptime_percentage).toFixed(3)}%</div>
                <div>Total Checks Logged: {modalService.total_checks}</div>
                <div>Average Response Time: {Number(modalService.avg_response_time).toFixed(0)} ms</div>
                <div>First Check (UTC): {formatTimestamp(modalService.first_check)}</div>
                <div>Last Check (UTC): {formatTimestamp(modalService.last_check)}</div>
                <div>Total Checks Logged: {modalService.total_checks}</div>
            {/if}
            <table>
                <thead>
                    <tr>
                        <th>Checked At (UTC)</th>
                        <th>Status Code</th>
                        <th>Response Time (ms)</th>
                        <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {#each modalChecks as mCheck (mCheck.id)}
                    <tr>
                        <td>{formatTimestamp(mCheck.checked_at)}</td>
                        <td>{mCheck.status_code}</td>
                        <td>{mCheck.response_time}</td>
                        <td>{mCheck.status}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>

    </div>
    {#if loadError}
        <div class="load-error">Error getting data from server, please try again.</div>
    {:else if services}
        {#each services as service (service.id)}
            <div>&lt;<a href="{service.base_url}" rel="noopener noreferrer" target="_blank">{service.name}</a>&gt;</div>
            <div>{service.description}</div>
            <div>Uptime percentage: {Number(service.uptime_percentage).toFixed(3)}%</div>
            <div>Total Checks Logged: {service.total_checks}</div>
            <button onclick={() => getDetailInfo(service)}>Detail View</button>
            {#if detailErrors[service.id]}
            <div style="font-color: red;">Failed to get Detail View, please try again.</div>
            {/if}
        {/each}
    {:else}
        <div>Loading...</div>
    {/if}

</div>

<style>
    .pingboard-content {
        max-width: min(70ch, 100% - 4rem);
        margin-inline: auto;
    }

    .pb-modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        background-color: rgb(0,0,0); 
        background-color: rgba(0,0,0,0.4);
        overflow: scroll;
    }

    .pb-modal-content {
        margin: 10% auto; 
        background-color: black;
        padding: 2em;
        border: 1px solid #888;
        max-width: min(70ch, 100% - 4rem);
    }
</style>