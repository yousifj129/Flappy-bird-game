// the reason why I have some variables here is because I want to access them in the console
const gridSize = 15; // grid (10x10)
let gridSizePx = 700; // must be the same as the css width and height
if(window.innerWidth   <= 800){
    gridSizePx = window.innerWidth - 100;
}

const cellSize = (gridSizePx / gridSize);
let gameRunning = false;
let minDistanceBetweenObstacles = 2;
let gapHeightObstacles = 10;
let gapSizeMin = 3;
let timer = 0;
let updateInterval = 300; // ms
console.log(window.innerWidth );


const difficultiesList = {
    "easy": {
        minDistanceBetweenObstacles: 5,
        gapHeightObstacles: 12,
        gapSizeMin: 4,
        updateInterval: 300 
    },
    "medium": {
        minDistanceBetweenObstacles: 3,
        gapHeightObstacles: 9,
        gapSizeMin: 3,
        updateInterval: 250 
    },
    "hard": {
        minDistanceBetweenObstacles: 2,
        gapHeightObstacles: 5,
        gapSizeMin: 2,
        updateInterval: 200 
    }
}
let currentDifficulty = "medium";

function generateRandomObstacle() {
    let newGapY = Math.random() * 4
    const gapHeight = Math.max(Math.random() * gapHeightObstacles, gapSizeMin);
    const x = gridSize;
    return { x, gapY: newGapY, gapHeight: gapHeight };
}
function init() {
    const gridElem = document.querySelector(".grid")
    const startButtonElem = document.getElementById("start-button");
    const displayTextElem = document.getElementById("displayText");
    const difficultySelectElem = document.getElementById("difficulty-select");
    let playerPos = [5, 5];
    let obstacles = []
    let cells = []
    let currentimg = 0;
    let intrevalID = null;
    // found this function on stackoverflow, it updates a css rule, or creates it if it does not exist.
    // https://stackoverflow.com/questions/6620393/is-it-possible-to-alter-a-css-stylesheet-using-javascript-not-the-style-of-an
    function updateCSSRule(selector, property, value) {
        selector = selector.toLowerCase();
        property = property.toLowerCase();
        value = value.toLowerCase();
        for (let i = 0; i < document.styleSheets.length; i++) {
            let sheet = document.styleSheets[i];

            try {
                let rules = sheet.cssRules || sheet.rules;
                for (let j = 0; j < rules.length; j++) {
                    let rule = rules[j];
                    if (rule.selectorText && rule.selectorText.toLowerCase() === selector) {
                        rule.style[property] = value;
                        return;
                    }
                }

                sheet.insertRule(`${selector} { ${property}: ${value}; }`, rules.length);
                return;

            } catch (e) {
                continue;
            }
        }
    }

    function animateBird() {
        const img = ["../Assets/bird1.png", "../Assets/bird2.png", "../Assets/bird3.png"];

        currentimg = (currentimg + 1) % img.length; // fun trick to cycle, when image reaches 2, this will reset it to 0 because (2+1) % 3 = 0
        updateCSSRule(".player", "background-image", `url(${img[currentimg]})`);
    }
    function createGrid() {
        timer = 0;
        //remove previous grid by emptying ALL the elements
        gridElem.innerHTML = "";
        cells = [];
        playerPos = [5, 5];
        obstacles = [];

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
        if (gridSize - lastX > minDistanceBetweenObstacles + Math.random() * 2) {
            const newObstacle = generateRandomObstacle();
            lastObstacleGapY = newObstacle.gapY;
            obstacles.push(newObstacle);
        }

        renderObstacles();
    }
    function checkForCollision() {
        if (playerPos[0] < 1 || playerPos[0] >= gridSize - 1 || playerPos[1] < 1 || playerPos[1] >= gridSize - 1) {
            return true; // out of bounds
        }
        if (cells[playerPos[0]][playerPos[1]].classList.contains("obstacle")) {
            return true; // collision
        }
        return false
    }

    function update() {
        timer += updateInterval;
        if (gameRunning == false) {
            startButtonElem.textContent = "Start Game";
            return;
        }
        startButtonElem.textContent = "Restart Game";
        movePlayer(0, -1); // gravity
        updateObstacles();
        displayTextElem.textContent = `Timer: ${Math.floor(timer / 1000)}s`;

        if (checkForCollision() == true) {
            gameRunning = false;
            displayTextElem.innerText = `Game Over! Click the start button to play again` + "\n" + `You survived for ${Math.floor(timer / 1000)} seconds`;
        }
        animateBird();
        if (timer / 1000 >= 30) {
            displayTextElem.innerText = `You win! Click the start button to play again`;
            gameRunning = false;
        }
    }
    function updateDifficulty() {
        currentDifficulty = difficultySelectElem.value;
        switch (currentDifficulty) {
            case "easy":
                minDistanceBetweenObstacles = difficultiesList.easy.minDistanceBetweenObstacles;
                gapHeightObstacles = difficultiesList.easy.gapHeightObstacles;
                gapSizeMin = difficultiesList.easy.gapSizeMin;
                updateInterval = difficultiesList.easy.updateInterval;
                break;
            case "medium":
                minDistanceBetweenObstacles = difficultiesList.medium.minDistanceBetweenObstacles;
                gapHeightObstacles = difficultiesList.medium.gapHeightObstacles;
                gapSizeMin = difficultiesList.medium.gapSizeMin;
                updateInterval = difficultiesList.medium.updateInterval;
                break;
            case "hard":
                minDistanceBetweenObstacles = difficultiesList.hard.minDistanceBetweenObstacles;
                gapHeightObstacles = difficultiesList.hard.gapHeightObstacles;
                gapSizeMin = difficultiesList.hard.gapSizeMin;
                updateInterval = difficultiesList.hard.updateInterval;
                break;
            default:
                minDistanceBetweenObstacles = difficultiesList.medium.minDistanceBetweenObstacles;
                gapHeightObstacles = difficultiesList.medium.gapHeightObstacles;
                gapSizeMin = difficultiesList.medium.gapSizeMin;
                updateInterval = difficultiesList.medium.updateInterval;
                break;
        }
    }
    function start() {
        clearInterval(intrevalID);
        updateDifficulty();
        createGrid();
        updatePlayerPosition();
        intrevalID =  setInterval(update, updateInterval);
    }
    start()
    window.addEventListener("keydown", (e) => {
        if (gameRunning == false) {
            return;
        }
        switch (e.key) {
            case "ArrowUp":
                movePlayer(0, 2);
                break;
            case "w":
                movePlayer(0, 2);
                break;
        }
    });
    window.addEventListener("click", (e) => {
        if (gameRunning == false) {
            return;
        }
        movePlayer(0, 2);
    });
    startButtonElem.addEventListener("click", () => {
        gameRunning = true;
        gridElem.focus();
        start();
    })

}

function showInstructions() {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
document.addEventListener("DOMContentLoaded", init)