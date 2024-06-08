import { Player } from './player.js';
import { Shot } from './shot.js';
import { Enemy } from './enemy.js';

let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let pauseMenu = document.getElementById('pause-menu');
let playerElement = document.getElementById('player');
let enemyElem = document.getElementById('enemy');

let background = document.getElementById('background');
let gameWhole = document.getElementsByTagName('body')[0];
const gameArea = document.getElementById('game');

let gameInterval, enemyInterval;
let isPaused = true;
let score = 0;
let lives = 3;
let timer = 0;
let elapsedTime = 0;
let lastTime = performance.now();
let backgroundSpeed = 30;
let backgroundY = 0;
let enemies = [];
let playerShots = [];
let testEnemy = new Enemy(enemyElem)

export let gameStates = {
    testEnemy,
    score,
    playerShots,
}

document.addEventListener("keydown", function (pressedKey) {
    if (pressedKey.key === "Escape" || pressedKey.key === "p" || pressedKey.key === "P") {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

continueButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", resetAndStartGame);

let player = new Player(playerElement);

const gameSettings = {
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
};

function startGame() {
    isPaused = false;
    focusOnGame();
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function createEnemies() {
    const rows = 5;
    const cols = 11;
    const enemySpacing = 10;
    const enemyWidth = 40;
    const enemyHeight = 40;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (enemyWidth + enemySpacing);
            const y = row * (enemyHeight + enemySpacing);
            const enemy = new Enemy(x, y, gameArea);
            enemies.push(enemy);
        }
    }

    console.log(enemies);

}

function resetAndStartGame() {
    score = 0;
    lives = 3;
    elapsedTime = 0;
    backgroundY = 0;
    player = new Player(playerElement);
    updateDisplays();
    pauseMenu.style.display = "none";
    startGame();
}

function gameLoop(currentTime) {
    if (!isPaused) {
        const deltaTime = currentTime - lastTime; // DELTA TIME
        lastTime = currentTime;

        try {
            update(deltaTime);
            gameInterval = requestAnimationFrame(gameLoop);
        } catch (error) {
            console.error("Error in gameLoop:", error);
            update(deltaTime);
            gameInterval = requestAnimationFrame(gameLoop);
        }
    }
}

function update(deltaTime) {
    elapsedTime += deltaTime;
    updateDisplays()

    backgroundY += backgroundSpeed * (deltaTime / 1000);
    if (backgroundY <= -600) {
        backgroundY = 0;
    }
    background.style.backgroundPosition = `0px ${backgroundY}px`;

    console.log("MOVE!", gameStates.playerShots);
    gameStates.playerShots = gameStates.playerShots.filter(shot => shot.move());

    testEnemy.move();

    enemies.forEach(enemy => enemy.move());
}

export function updateDisplays() {
    scoreDisplay.textContent = `Score: ${gameStates.score}`
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

function focusOnGame() {
    gameWhole.style.cursor = "none";
    gameWhole.focus();
    gameWhole.style.overflow = "hidden";
}

function unfocusOnGame() {
    gameWhole.style.cursor = "auto"
    gameWhole.style.overflow = "visible"
}

pauseGame()