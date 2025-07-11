// flappy bird 
const gridSize = 15; // grid (10x10)
const gridSizePx = 700; // must be the same as the css width and height
const cellSize = (gridSizePx / gridSize); // idk why but -3 is needed to fit
let gameRunning = false;



function generateRandomObstacle() {
    let newGapY = Math.random() * 4
    const gapHeight = Math.max(Math.random() * 10, 3);
    const x = gridSize;
    return { x, gapY: newGapY, gapHeight: gapHeight };
}
function init() {
    const gridElem = document.querySelector(".grid")
    const startButton = document.getElementById("start-button");
    let playerPos = [5, 5];
    let obstacles = []
    let cells = []
    const minDistanceBetweenObstacles = 2;
    let currentimg = 0;
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

        currentimg = (currentimg + 1) % img.length; // increment currentimg, wrapping around to 0 when it reaches the end
        updateCSSRule(".player", "background-image", `url(${img[currentimg]})`);
    }
    function createGrid() {
        //remove previous grid by emptying ALL the elements
        gridElem.innerHTML = "";
        cells = [];
        playerPos = [5, 5];
        obstacles = [];
        playerPos = [5, 5];

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
        if (playerPos[0] < 1 || playerPos[0] >= gridSize - 1 || playerPos[1] < 1 || playerPos[1] >= gridSize - 1) {
            return true; // out of bounds
        }
        if (cells[playerPos[0]][playerPos[1]].classList.contains("obstacle")) {
            return true; // collision
        }
        return false
    }

    function update() {
        if (gameRunning == false) {
            startButton.textContent = "Start Game";
            return;
        }
        startButton.textContent = "Restart Game";
        movePlayer(0, -1); // gravity
        updateObstacles();
        if (checkForCollision() == true) {
            gameRunning = false;
            console.log("Game Over");
        }
        animateBird();
    }
    function start() {
        createGrid();
        updatePlayerPosition();
    }

    function handleUserInput(e) {

    }
    start()
    setInterval(update, 300);
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
    startButton.addEventListener("click", () => {
        gameRunning = true;
        gridElem.focus();
        createGrid();
    })

}


document.addEventListener("DOMContentLoaded", init)