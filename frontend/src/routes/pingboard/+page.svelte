<script>
    import { page } from '$app/stores';
    let baseURL = `${$page.url.origin}/api/pingboard/`;
    
    let { data } = $props();
    let { loadedServices, loadError } = data;
    let services = $state(loadedServices);

    let modalDisplay = $state("none");
    let modalChecks = $state([]);
    let modalService = $state({});
    let showAppInfo = $state(false);

    let savedChecks = $state({});
    let detailErrors = $state({});

    const colorMap = {
        "up": "green",
        "down": "red",
        "slow": "orange"
    }

    function toggleModal() {
        if (modalDisplay === "none") {
            modalDisplay = "block";
        } else {
            modalDisplay = "none";
            showAppInfo = false;
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

    function toggleAppInfoModal(){
        showAppInfo = true;
        toggleModal();
    }

    function statusColor(checkStatus){
        if (checkStatus in colorMap){
            return colorMap[checkStatus];
        }

        return "white";
    }


</script>

<div class="pingboard-content">
    <div class="pb-modal" style="display: {modalDisplay};">
        <div class="pb-modal-content">
            <div onclick={toggleModal} style="float: right; font-size: 2em; cursor: pointer;">&times;</div>

            {#if showAppInfo}
            <br/><div class="info-modal-title flex-center">Pingboard Info</div><br/>

            <div>
                Pingboard is an application that tracks the perfomance and uptime of services over time. Once per hour, the server sends a request to each service and logs in the database the response time and whether the request was successful. If a request takes longer than 2 seconds, that request is additionally noted as being slow.
                <br/><br/>
                Below you can find a panel for each service tracked that includes a description, uptime percentage, average response time, and the total number of checks that have been logged for the service. Click the "Detail View" button next to any service to bring up a window that will show a table with information from the last 50 individual checks that were performed on that service.
            </div>

            {:else}
            <div class="modal-name flex-center">{modalService.name}</div><br/>
            <div>Uptime Percentage: {Number(modalService.uptime_percentage).toFixed(3)}%</div>
            <div>Total Checks Logged: {modalService.total_checks}</div>
            <div>Average Response Time: {Number(modalService.avg_response_time).toFixed(0)} ms</div>
            <div>First Check (UTC): {formatTimestamp(modalService.first_check)}</div>
            <div>Last Check (UTC): {formatTimestamp(modalService.last_check)}</div><br />
            
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
                    <tr style="color: {statusColor(mCheck.status)};">
                        <td>{formatTimestamp(mCheck.checked_at)}</td>
                        <td>{mCheck.status_code || '-'}</td>
                        <td>{mCheck.response_time}</td>
                        <td>{mCheck.status}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
            {/if}
        </div>

    </div>

    <div class="pingboard-title flex-center"><div class="pulse-light green"></div>Pingboard<div class="pulse-light red"></div></div>
    <br/><div class="flex-center"><button onclick={toggleAppInfoModal}>See Pingboard Info</button></div>
    
    {#if loadError}
        <div class="load-error" style="color: red;">Error getting data from server, please try again.</div>
    {:else if services}
        {#each services as service (service.id)}
        <div class="pingboard-panel">
            <div class="panel-name flex-center">&lt;<a href="{service.base_url}" rel="noopener noreferrer" target="_blank">{service.name}</a>&gt;</div><br/>
            <div class="panel-desc">{service.description}</div><br/>
            <div>Uptime Percentage: {Number(service.uptime_percentage).toFixed(3)}%</div>
            <div>Average Response Time: {Number(service.avg_response_time).toFixed(0)} ms</div>
            <div>Total Checks Logged: {service.total_checks}</div><br/>
            <div class="flex-center"><button onclick={() => getDetailInfo(service)}>Detail View</button></div>
            {#if detailErrors[service.id]}
            <div style="color: red;">Failed to get Detail View, please try again.</div>
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
        font-size: 5em;
    }

    .info-modal-title{
        font-size: 1.25em;
    }

    .pingboard-panel{
        margin: 1.25em 0;
        border: solid white 2px;
        padding: 1em;
        border-radius: 0.5em;
    }

    .panel-name{
        font-size: 2em;
    }

    .flex-center{
        justify-content: center;
        display: flex;
    }

    .modal-name {
        font-size: 2em;
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

    .pulse-light {
        --pulse-size: 13px;
        --pulse-duration: 1.5s;
        
        width: var(--pulse-size);
        height: var(--pulse-size);
        border-radius: 50%;
        animation: pulse-glow var(--pulse-duration) infinite;
        margin: auto 20px;
    }

    .pulse-light.green {
        --light-color: #00b300;
        --light-color-rgb: 0, 255, 0;
        --light-glow: #27e727;
        background: var(--light-color);
        box-shadow: 
            0 0 5px var(--light-glow),
            inset 0 0 10px var(--light-glow);
    }

    .pulse-light.red {
        --light-color: #d00303;
        --light-color-rgb: 255, 68, 68;
        --light-glow: #ff3737;
        background: var(--light-color);
        box-shadow: 
            0 0 5px var(--light-glow),
            inset 0 0 10px var(--light-glow);
        animation-delay: 0.75s;
    }

    @keyframes pulse-glow {
        0% {
            transform: scale(0.9);
            box-shadow: 
                0 0 5px var(--light-glow),
                inset 0 0 10px var(--light-glow),
                0 0 0 0 rgba(var(--light-color-rgb), 0.7);
        }
        70% {
            transform: scale(1);
            box-shadow: 
                0 0 20px var(--light-glow),
                inset 0 0 15px var(--light-glow),
                0 0 0 15px rgba(var(--light-color-rgb), 0);
        }
        100% {
            transform: scale(0.9);
            box-shadow: 
                0 0 5px var(--light-glow),
                inset 0 0 10px var(--light-glow),
                0 0 0 0 rgba(var(--light-color-rgb), 0);
        }
    }

    @media (max-width: 768px) {
        .pingboard-content {
            max-width: 95vw;
        }
    }

    @media (max-width: 370px) {
        .pulse-light {
            display: none;
        }
    }

</style>