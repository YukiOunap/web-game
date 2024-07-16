let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let gameArea = document.getElementById('game-container')
let pauseMenu = document.getElementById('pause-menu');
let player = document.getElementById('player');
let background = document.getElementById('background');
let gameWhole = document.getElementsByTagName('body')[0];

let gameInterval, enemyInterval;
let isPaused = true;
let elapsedTime = 0;
let lastTime = performance.now();
let backgroundSpeed = 30;
let backgroundY = 0;

document.addEventListener("keydown", function (pressedKey) {
    if (pressedKey.key === "Escape" || pressedKey.key === "p" || pressedKey.key === "P") {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

document.addEventListener("keyup", function (releasedKey) {
    keysPressed[releasedKey.key] = false;
});

document.addEventListener("DOMContentLoaded", () => {
    player = new Player(gameArea);
    pauseGame();
});


continueButton.addEventListener("click", resumeGame)
restartButton.addEventListener("click", resetAndStartGame)

const gameSettings = {
    playerSpeed: 7, // frames per second
    enemySpeed: 5,
    bulletSpeed: 10,
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
};

function startGame() {
    pauseMenu.style.display = "none";
    isPaused = false;
    focusOnGame();
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    console.log("RESET!", gameInterval, gameStates);
}

export function pauseGame() {
    isPaused = true;
    pauseMenu.style.display = "block";
    cancelAnimationFrame(gameInterval);
    unfocusOnGame();
}

function focusOnGame() {
    gameWhole.style.cursor = "none";
    gameWhole.focus();
    gameWhole.style.overflow = "hidden";
}

function unfocusOnGame() {
    gameWhole.style.cursor = "auto"
    gameWhole.style.overflow = "visible"
}


// Game Over & Complete -------------------

export async function gameOver(gameOverType) {
    const elem = document.getElementById(gameOverType);
    elem.style.display = "block";
    updateDisplays();
    pauseMenu.style.display = "none";
    startGame();
}

function gameLoop(currentTime) {
    if (!isPaused) {
        const deltaTime = currentTime - lastTime; // DELTA TIME
        lastTime = currentTime;

        update(deltaTime, currentTime);
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function update(deltaTime, currentTime) {
    elapsedTime += deltaTime;
    updateDisplays()
    
    backgroundY -= backgroundSpeed * (deltaTime / 1000);
    if (backgroundY <= -600) {
        backgroundY = 0;
    }
    background.style.backgroundPosition = `0px ${backgroundY}px`;
}

function updateDisplays(){
    scoreDisplay.textContent = `Score: ${score}`
    livesDisplay.textContent = `Lives: ${lives}`
    timerDisplay.textContent = `Time: ${(elapsedTime / 1000).toFixed(1)}`;
}

function pauseGame() {
    isPaused = true;
    pauseMenu.style.display = "block";
    cancelAnimationFrame(gameInterval);
    clearInterval(enemyInterval);
    unfocusOnGame();
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    focusOnGame();
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function focusOnGame(){
    gameWhole.style.cursor = "none";
    gameWhole.focus();
    gameWhole.style.overflow = "hidden";
}

function unfocusOnGame(){
    gameWhole.style.cursor = "auto"
    gameWhole.style.overflow ="visible"
}


pauseGame()