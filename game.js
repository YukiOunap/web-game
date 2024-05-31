let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('retry-button');
let gameArea = document.getElementById('game');
let pauseMenu = document.getElementById('pause-menu');
let player = document.getElementById('player');
let background = document.getElementById('background');

let gameInterval, enemyInterval;
let isPaused = true;
let score = 0;
let lives = 3;
let timer = 0;
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

const gameSettings = {
    playerSpeed: 7, // frames per second
    enemySpeed: 5,
    bulletSpeed: 10,
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
};

function startGame() {
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function gameLoop(currentTime) {
    if (!isPaused) {
        const deltaTime = currentTime - lastTime; // DELTA TIME
        lastTime = currentTime;

        update(deltaTime);
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function update(deltaTime) {
    elapsedTime += deltaTime;
    timerDisplay.textContent = `Time: ${(elapsedTime / 1000).toFixed(1)}`;
    
    backgroundY -= backgroundSpeed * (deltaTime / 1000);
    if (backgroundY <= -600) {
        backgroundY = 0;
    }
    background.style.backgroundPosition = `0px ${backgroundY}px`;
}

function pauseGame() {
    isPaused = true;
    pauseMenu.style.display = "block";
    cancelAnimationFrame(gameInterval);
    clearInterval(enemyInterval);
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

startGame();
