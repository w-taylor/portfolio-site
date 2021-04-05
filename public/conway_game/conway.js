document.addEventListener('DOMContentLoaded', () => {
    let grid = document.querySelector('.grid');
    const rowNum = 15;
    const colNum = 15;
    let startBtn = document.querySelector('.start-button');
    let resetBtn = document.querySelector('.reset-button');
    let currentGrid = [];
    let nextGrid = [];

    //Populate the grid with cells that toggle from alive or dead on click
    function makeGrid () {
        for (let x = 0; x < rowNum; x++) {
            let gridRow = [];
            let row = document.createElement('div');
            row.classList.add('row');
            grid.appendChild(row);
            for (let y = 0; y < colNum; y++) {
                let cell = document.createElement('div');
                cell.classList.add('dead-cell');
                cell.onclick = function () {
                    if (this.classList.contains('dead-cell')) {
                        this.classList.remove('dead-cell');
                        this.classList.add('alive-cell');
                    } else {
                        this.classList.remove('alive-cell');
                        this.classList.add('dead-cell');
                    }
                }
                row.appendChild(cell);
            }
        };
    }

    //Return an array version of the current grid with 0 for dead cells and 1 for alive cells
    function getCurrentGrid() {
        let currGrid = [];
        for (let x = 0; x < rowNum; x++) {
            let rowArr = [];
            for (let y = 0; y < colNum; y++) {
                if (grid.children[x].children[y].classList.contains('dead-cell')) {
                    rowArr.push(0);
                } else if (grid.children[x].children[y].classList.contains('alive-cell')) {
                    rowArr.push(1);
                }
            }
            currGrid.push(rowArr);
        }
        return currGrid;
    }

    //Run game logic on current grid array and produce an array of what the next grid should look like
    //Game logic:
    //If a live cell has less than 2 or more than 3 live neighbors, it dies; if it has exactly 2 or 3 neighbors, it lives
    //If a dead cell has exactly 3 live neighbors, it becomes a live cell
    function getNextGrid() {
        let newGrid = [];
        for (let x = 0; x < rowNum; x++) {
            let newRow = [];
            for (let y = 0; y < colNum; y++) {
                neighbors = getNeighbors(x,y);
                if (currentGrid[x][y] == 1) {
                    if (neighbors == 2 || neighbors == 3) {
                        newRow.push(1);
                    } else {
                        newRow.push(0);
                    }
                } else if (currentGrid[x][y] == 0) {
                    if (neighbors == 3) {
                        newRow.push(1);
                    } else {
                        newRow.push(0);
                    }
                }
            }
            newGrid.push(newRow);
        }
        return newGrid;

    }

    //For a given coordinate of current grid, determine the number of living neighbors it has
    //neighbor cells are the 8 cells directly vertical/horizontal/diagnol
    //cells off the grid are always considered dead
    function getNeighbors(x,y) {
        let liveCount = 0;
        let topRow = x == 0;
        let botRow = x == (rowNum - 1);
        let leftCol = y == 0;
        let rightCol = y == (colNum - 1);
        //Check three neighbors above cell
        if (!topRow) {
            if (!leftCol) {
                liveCount += currentGrid[x-1][y-1]
            }
            liveCount += currentGrid[x-1][y]
            if (!rightCol) {
                liveCount += currentGrid[x-1][y+1]
            }
        }
        //Check two neighbors on same row as cell
        if (!leftCol) {
            liveCount += currentGrid[x][y-1]
        }
        if (!rightCol) {
            liveCount += currentGrid[x][y+1]
        }
        //Check three neighbors below cell
        if (!botRow) {
            if (!leftCol) {
                liveCount += currentGrid[x+1][y-1]
            }
            liveCount += currentGrid[x+1][y]
            if (!rightCol) {
                liveCount += currentGrid[x+1][y+1]
            }
        }
        return liveCount;

    }

    //Use the new calculated grid array to update the visual display
    //Need to do this separate from the calculation as changes in cells need to happen all at once so they new cells don't change how the next gen is calculated
    //Flag parameter allows function to be reused by reset game function. If flag is 0, always fail the check for if the cell should be changed to alive so that every cell is set to dead
    function buildNewGrid(flag) {
        for (let x = 0; x < rowNum; x++) {
            for (let y = 0; y < colNum; y++) {
                //If flag is 1 and next grid says cell should be alive, make the cell alive
                //Next Grid check in a separate if so that reset button works even if next grid doesn't exist so you can clear the grid before having pressed start
                if (flag == 1) {
                    if (nextGrid[x][y] == 1) {
                        if (grid.children[x].children[y].classList.contains('dead-cell')) {
                            grid.children[x].children[y].classList.remove('dead-cell');
                            grid.children[x].children[y].classList.add('alive-cell');
                            
                        }
                    } else {
                        if (grid.children[x].children[y].classList.contains('alive-cell')) {
                            grid.children[x].children[y].classList.remove('alive-cell');
                            grid.children[x].children[y].classList.add('dead-cell');
                        }
                    }
                } else {
                    if (grid.children[x].children[y].classList.contains('alive-cell')) {
                        grid.children[x].children[y].classList.remove('alive-cell');
                        grid.children[x].children[y].classList.add('dead-cell');
                    }
                }
                
            }
        }
    }

    //Call the buildNewGrid function with the 0 flag so that it changes all alive cells to dead cells
    function resetGame() {
        buildNewGrid(0);
    }

    function runGame() {
        //Disable reset button while game is in progress; re-enable when game is stopped
        resetBtn.onclick = "";
        currentGrid = getCurrentGrid();
        //Calculate new grid and update the visual; repeat every 300ms until interrupted by stop button
        let gameLoop = setInterval( function () {
            nextGrid = getNextGrid();
            buildNewGrid(1);
            currentGrid = nextGrid;
        }, 300);
        startBtn.innerHTML = 'Stop';
        startBtn.onclick = function () {
            clearInterval(gameLoop);
            startBtn.innerHTML = 'Start';
            startBtn.onclick = runGame;
            resetBtn.onclick = resetGame;
        }
    }


    makeGrid();
    startBtn.onclick = runGame;
    resetBtn.onclick = resetGame;
})

