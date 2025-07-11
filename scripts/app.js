const gridSize = 11; // Size of the grid (10x10)
const cellSize = 50;
function init() {
    const gridElem = document.querySelector(".grid")
    let playerPos = [5, 5]; // Starting position of the player

    let cells = [[]]

    function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            let row = [];
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement("div")
                row.push(cell);
                cell.className = "cell"
                cell.style.width = `${cellSize}px`
                cell.style.height = `${cellSize}px`
                gridElem.append(cell)
            }
            cells.push(row); 
        }
    }
    function movePlayer(x, y) {
        const newX = playerPos[0] + x;
        const newY = playerPos[1] + y;

        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            playerPos = [newX, newY];
            updatePlayerPosition();
        }
    }
    function updatePlayerPosition() {
        cells.forEach(row => row.forEach(cell => cell.classList.remove("player")));
        const playerCell = cells[playerPos[0]][playerPos[1]];
        playerCell.classList.add("player");
    }
    function start() {
        createGrid();
        updatePlayerPosition();
    }
    start()
}


document.addEventListener("DOMContentLoaded", init)