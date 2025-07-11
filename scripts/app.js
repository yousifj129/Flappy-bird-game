// flappy bird 
const gridSize = 15; // grid (10x10)
const gridSizePx = 700; // must be the same as the css width and height
const cellSize = (gridSizePx / gridSize) - 3; // idk why but -3 is needed to fit
let gameRunning = false;



function generateRandomObstacle() {
    let newGapY = Math.random()*4
    const gapHeight = Math.max(Math.random()*10, 3);
    const x = gridSize;
    return { x, gapY: newGapY, gapHeight: gapHeight };
}
function init() {
    const gridElem = document.querySelector(".grid")
    const startButton = document.getElementById("start-button");
    let playerPos = [5, 5];
    let obstacles = []
    let cells = []
    let lastObstacleGapY = 6;
    const minDistanceBetweenObstacles = 4;

    function createGrid() {
        //remove previous grid by emptying ALL the elements
        gridElem.innerHTML = "";
        cells = [];
        playerPos = [5, 5];
        obstacles = [];
        playerPos = [5,5];

        gridElem.style.width = `${gridSizePx}px`;
        gridElem.style.height = `${gridSizePx}px`;
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
    function renderObstacles() {
        cells.forEach(col => col.forEach(cell => cell.classList.remove("obstacle")));

        for (const obs of obstacles) {
            for (let y = 0; y < gridSize; y++) {
                if (y >= obs.gapY && y < obs.gapY + obs.gapHeight) continue;

                if (obs.x >= 0 && obs.x < gridSize) {
                    cells[obs.x][y].classList.add("obstacle");
                }
            }
        }
    }
    function updateObstacles() {
        for (let obs of obstacles) obs.x -= 1;
        obstacles = obstacles.filter(obs => obs.x >= 0);

        const lastX = obstacles.length > 0 ? Math.max(...obstacles.map(o => o.x)) : -10;
        if (gridSize - lastX > minDistanceBetweenObstacles) {
            const newObstacle = generateRandomObstacle();
            lastObstacleGapY = newObstacle.gapY;
            obstacles.push(newObstacle);
        }

        renderObstacles();
    }
    function checkForCollision() {
        if( playerPos[0] < 0 || playerPos[0] >= gridSize || playerPos[1] < 0 || playerPos[1] >= gridSize) {
            return true; // out of bounds
        }
        if(cells[playerPos[0]][playerPos[1]].classList.contains("obstacle")) {
            return true; // collision
        }
        return false
    }

    function update() {
        if(gameRunning == false) {
            return;
        }
        movePlayer(0, -1); // gravity
        updateObstacles();
        if(checkForCollision() == true){
            gameRunning = false;
            console.log("Game Over");
        }
    }
    function start() {
        createGrid();
        updatePlayerPosition();
    }


    start()
    setInterval(update, 300);
    window.addEventListener("keydown", (e) => {
        if(gameRunning == false) {
            return;
        }
        switch (e.key) {
            case "ArrowUp":
                movePlayer(0, 2);
                break;
        }
    });
    startButton.addEventListener("click", () => {
        gameRunning = true;
        createGrid();
    })

}


document.addEventListener("DOMContentLoaded", init)