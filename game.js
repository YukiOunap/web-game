let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let gameArea = document.getElementById("game")
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

continueButton.addEventListener("click", resumeGame)
restartButton.addEventListener("click", resetAndStartGame)
gameArea.addEventListener("click", setFocusWithoutScrolling)

const gameSettings = {
    playerSpeed: 7, // frames per second
    enemySpeed: 5,
    bulletSpeed: 10,
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
};

function startGame() {
    isPaused = false;
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function resetAndStartGame() {
    score = 0;
    lives = 3;
    elapsedTime = 0;
    backgroundY = 0;
    updateDisplays();
    pauseMenu.style.display = "none";
    startGame();
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
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function setFocusWithoutScrolling(){
    continueButton.focus({
        preventScroll:true
    })
}

pauseGame()