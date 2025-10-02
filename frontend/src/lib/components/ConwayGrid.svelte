<script>
    let gridSize = 15;

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
        simGrid = Array.from({ length: gridSize }, () => new Array(gridSize).fill(false));
        cycleNum = 0;
    }

    // Iterate through current grid to determine new grid after one cycle
    function runSim(){
        console.log("sim loop...");
        let newGrid = [];
        simGrid.forEach((gridRow, rowIdx) => {
            newGrid.push([]);
            gridRow.forEach((gridCell, colIdx) => {
                let neighbors = getNeighbors(rowIdx, colIdx);
                console.log(rowIdx + "," + colIdx + ": " + neighbors)

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

    $inspect(simGrid);
    
</script>

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
<div class="conway-start" onclick={runContinuous}>{startBtnTxt}</div>
<div class="conway-step" onclick={runSim}>Step 1 Cycle</div>
<div class="conway-reset" onclick={resetGrid}>Reset</div>
<div class="conway-counter">{cycleNum} Cycles</div>

<style>
    [class*="cell"] {
        height: 1.75em;
        width: 1.75em;
        border: 1px;
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
</style>