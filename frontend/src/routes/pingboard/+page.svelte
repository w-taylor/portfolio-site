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
                <div class="modal-name">{modalService.name}</div><br/>
                <div>Uptime Percentage: {Number(modalService.uptime_percentage).toFixed(3)}%</div>
                <div>Total Checks Logged: {modalService.total_checks}</div>
                <div>Average Response Time: {Number(modalService.avg_response_time).toFixed(0)} ms</div>
                <div>First Check (UTC): {formatTimestamp(modalService.first_check)}</div>
                <div>Last Check (UTC): {formatTimestamp(modalService.last_check)}</div><br />
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

    <div class="pingboard-title">Pingboard</div>
    <div class="pingboard-desc">
        Pingboard is an application that tracks the perfomance and uptime of services over time. Once per hour, the server sends a request to each service and logs in the database logs the response time and whether the request was successful. If a request takes longer than 2 seconds, that request is additionally noted as being slow.
        <br/><br/>
        Below you can find a panel for each service tracked that includes a description, it's uptime percentage, and the total number of checks that have been logged for the service. Click the "Detail View" button next to any service to bring up a window that will show additional statistics for that service along with a table showing information from the last 50 individual checks that were performed.
    </div>
    
    {#if loadError}
        <div class="load-error">Error getting data from server, please try again.</div>
    {:else if services}
        {#each services as service (service.id)}
        <div class="pingboard-panel">
            <div class="panel-name">&lt;<a href="{service.base_url}" rel="noopener noreferrer" target="_blank">{service.name}</a>&gt;</div><br/>
            <div class="panel-desc">{service.description}</div><br/>
            <div>Uptime Percentage: {Number(service.uptime_percentage).toFixed(3)}%</div>
            <div>Average Response Time: {Number(service.avg_response_time).toFixed(0)} ms</div>
            <div>Total Checks Logged: {service.total_checks}</div><br/>
            <div class="panel-button-cont"><button onclick={() => getDetailInfo(service)} class="panel-button">Detail View</button></div>
            {#if detailErrors[service.id]}
            <div style="font-color: red;">Failed to get Detail View, please try again.</div>
            {/if}
        </div>
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

    .pingboard-title {
        justify-content: center;
        display: flex;
        font-size: 5em;
    }

    .pingboard-desc{
        font-size: 1.2em;
        margin: 1em 0;
    }

    .pingboard-panel{
        margin: 1.25em 0;
        border: solid white 2px;
        padding: 1em;
        border-radius: 0.5em;
    }

    .panel-name{
        justify-content: center;
        display: flex;
        font-size: 2em;
    }

    .panel-button-cont{
        justify-content: center;
        display: flex;
    }

    .modal-name {
        font-size: 2em;
        justify-content: center;
        display: flex;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    }

    th, td {
        padding: 12px 15px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #333;
    }

    tbody tr:hover {
        background-color: #232323;
    }
    
</style>