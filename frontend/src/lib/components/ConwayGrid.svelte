<script>
    import { run } from "svelte/legacy";

    let gridSize = 15;

    let modalDisplay = $state("none");

    let simGrid = $state(Array.from({ length: gridSize }, () => new Array(gridSize).fill(false)));

    let cycleNum = $state(0);

    let running = $state(false);
    let startBtnTxt = $state("Start")
    let simLoop;

    // On-click for toggling a grid cell as alive or dead
    function toggleCell(rIdx, cIdx) {
        if (simGrid[rIdx][cIdx]) {
            simGrid[rIdx][cIdx] = false;
        } else {
            simGrid[rIdx][cIdx] = true;
        }
    }

    // Reset the grid to the starting state
    function resetGrid() {
        if (!running){
            simGrid = Array.from({ length: gridSize }, () => new Array(gridSize).fill(false));
            cycleNum = 0;
        }
    }

    function cycleOneStep() {
        if (!running) {
            runSim();
        }
    }

    // Iterate through current grid to determine new grid after one cycle
    function runSim(){
        let newGrid = [];
        simGrid.forEach((gridRow, rowIdx) => {
            newGrid.push([]);
            gridRow.forEach((gridCell, colIdx) => {
                let neighbors = getNeighbors(rowIdx, colIdx);

                if (gridCell == true && (neighbors < 2 || neighbors > 3)){
                    newGrid[rowIdx].push(false);
                } else if (gridCell === false && neighbors === 3){
                    newGrid[rowIdx].push(true);
                } else {
                    newGrid[rowIdx].push(gridCell);
                }
            })
        })

        simGrid = newGrid;
        cycleNum += 1;
    }

    // Return the number of alive neighbors from adjacent cells (including diagonals)
    function getNeighbors(rIdx, cIdx) {
        let nCount = 0;
        let rowAbove = rIdx - 1;
        let rowBelow = rIdx + 1;

        [rowAbove, rIdx, rowBelow].forEach((row) => {
            nCount += checkCell(row, cIdx - 1);
            nCount += checkCell(row, cIdx + 1);

            // Don't include cell itself in neighbor count
            if (row !== rIdx) {
                nCount += checkCell(row, cIdx);
            }
        })
        return nCount;
    }

    // Return 1 if coordinate is for a living cell; return 0 if cell is dead or coordinate is out of range
    function checkCell(r,c) {
        let upperLimit = gridSize - 1;
        if (
            r < 0 ||
            r > upperLimit ||
            c < 0 ||
            c > upperLimit
        ) {
            return 0;
        } else {
            return simGrid[r][c] ? 1 : 0;
        }
    }

    // Start or stop continuous run
    function runContinuous() {
        if (running) {
            running = false;
            clearInterval(simLoop);
            startBtnTxt = "Start"
            return;
        }

        startBtnTxt = "Stop"
        running = true;
        simLoop = setInterval(() => {
            runSim();
        }, 500);
    }

    // Open/close modal with instructions
    function toggleModal() {
        if (modalDisplay === "none") {
            modalDisplay = "block";
        } else {
            modalDisplay = "none";
        }
    }
    
</script>

<div class="conway-content">
    <div class="conway-title">Conway's&nbsp;<i>Game of Life</i></div>
    <br />
    
    <div class="grid-buttons">
        <button class="conway-btn" onclick={toggleModal}>Instructions</button>
    </div>
    
    <br />
    <div class="conway-modal" style="display: {modalDisplay};">
        <div class="modal-content">
            <div onclick={toggleModal} style="float: right; font-size: 2em; cursor: pointer;">&times;</div>
            <br />
            <p>
                This is a simple implementation of British mathematician John Conway's <i>Game of Life</i>. 
            </p>

            <p>
                Each square in the grid represents a cell that can either be dead (blank white square) or alive (filled with a black circle). You can click on a square to toggle its starting state between alive or dead. After hitting "Start", the simulation will proceed and cells will change between alive or dead based on its 8 neighboring cells according to the following rules:
            </p>
            <ul>
                <li>A live cell dies due to underpopulation if it has less than two living neighbors</li>
                <li>A live cell dies due to overpopulation if it has more than three living neighbors</li>
                <li>A live cell with two or three living neighbors is stable and survives to the next cycle</li>
                <li>A dead cell with exactly three living neighbors becomes a live cell due to reproduction</li>
            </ul>
            <p>
                In this implementation, any imaginary cells beyond the grid are considered uninhabitable and can never support life. So, for example, the cell in the top right of the grid will always have at least five dead neighbors due to the cells above and to the right of it being uninhabitable.
            </p>
            <p>
                After clicking on some initial live cells, click the "Start" button to begin the simulation. The counter under the grid will track the progression of cycles. You can hit the "Stop" button to pause the simulation and make changes to the grid or hit the "Reset" button to return the grid to a blank slate and return the cycle counter to 0.
            </p>
            <p>
                If you want to let the simulation proceed for only a single cycle, you can hit the "Step 1 Cycle" button.
            </p>
            <p>
                You can read more about Conway's <i>Game of Life</i> and find some starting patterns to play with <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">&lt;here&gt;</a>
            </p>
        </div>
    </div>
    <div class="conway-grid">
        {#each simGrid as gridRow, rowIdx}
            <div class="row">
                {#each gridRow as gridCell, colIdx}
                    <div onclick={() => toggleCell(rowIdx, colIdx)} class={gridCell ? 'alive-cell' : 'dead-cell'} >
                        <div class="dot"></div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="grid-buttons">
        <button class="conway-start conway-btn" onclick={runContinuous}>{startBtnTxt}</button>
        <button class="conway-step conway-btn" onclick={cycleOneStep}>Step 1 Cycle</button>
        <button class="conway-reset conway-btn" onclick={resetGrid}>Reset</button>
        <div class="conway-counter conway-btn">{cycleNum} Cycles</div>
    </div>
</div>

<style>
    .conway-content {
        max-width: min(70ch, 100% - 4rem);
        margin-inline: auto;
    }

    .conway-title {
        font-size: 3em;
        display: flex;
        justify-content: center;
    }

    .conway-grid {
        height: calc(1.81em*15);
        width: calc(1.81em*15);
        margin: auto;
    }

    .grid-buttons {
        display: flex;
        justify-content: center;
    }

    .grid-buttons > button, .grid-buttons > div {
        margin: 0 .5em;
    }

    .conway-counter {
        padding: .5em;
    }

    .row {
        height: 1.75em;
    }

    [class*="cell"] {
        height: 1.75em;
        width: 1.75em;
        border: .06em;
        border-color: black;
        border-style: solid;
        display: inline-block;
        margin-left: -1px;
        background-color: white;
    }

    .alive-cell > .dot {
        height: 1.5em;
        width: 1.5em;
        background-color: black;
        border-radius: 50%;
        margin: .125em;
    }

    .conway-modal {
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

    .modal-content {
        margin: 10% auto; 
        background-color: black;
        padding: 2em;
        border: 1px solid #888;
        max-width: min(70ch, 100% - 4rem);
    }
</style>