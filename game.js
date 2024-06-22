import { Player } from './player.js';
import { Shot } from './shot.js';
import { Enemy } from './enemy.js';

let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let pauseMenu = document.getElementById('pause-menu');
let gameOverText;
// let enemyElem = document.getElementById('enemy');

let background = document.getElementById('background');
let gameWhole = document.getElementsByTagName('body')[0];

let gameArea = document.getElementById('game');
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;
const initialPlayerX = gameAreaWidth / 2;
const initialPlayerY = gameAreaHeight - 60;

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
let enemyShots = [];
let threshold = 5000;

// let testEnemy = new Enemy(enemyElem)

let player;

export let gameStates = {
    enemies,
    score,
    maxScore: 0,
    elapsedTime,
    lives,
    enemyShots,
    gameArea,
    player,
    playerShots: [],
}

gameStates.player = new Player();

const keysPressed = {};

function keydownHandler(pressedKey) {
    keysPressed[pressedKey.key] = true;
    if (pressedKey.key === "Escape" || pressedKey.key === "p" || pressedKey.key === "P") {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
}

document.addEventListener("keydown", keydownHandler);

document.addEventListener("keyup", function (releasedKey) {
    keysPressed[releasedKey.key] = false;
});

continueButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", resetAndStartGame);

const gameSettings = {
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
};

function startGame() {
    isPaused = false;
    focusOnGame();
    lastTime = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
    //enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
}

function createEnemies() {
    const rows = 2;
    const cols = 7;
    const enemySpacingWidth = 30;
    const enemySpacingHeight = 20;
    const enemyWidth = 40;
    const enemyHeight = 40;

    gameStates.maxScore = rows * cols;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = 150 + col * (enemyWidth + enemySpacingWidth);
            const y = 100 + row * (enemyHeight + enemySpacingHeight);
            const enemy = new Enemy(x, y);
            gameArea.appendChild(enemy.element);
            enemies.push(enemy);
        }
    }
}

function resetAndStartGame() {
    score = 0;
    gameStates.lives = 3;
    elapsedTime = 0;
    backgroundY = 0;
    updateDisplays();

    removeElement(gameOverText);

    if (enemies.length > 0) {
        enemies.forEach((enemy) => removeElement(enemy.element));
    }
    createEnemies();

    pauseMenu.style.display = "none";
    startGame();
}

function removeElement(element) {
    console.log(element);
    if (element) {
        element.remove();
        console.log(`Element with selector '${element}' has been removed.`);
    } else {
        console.log(`Element with selector '${element}' does not exist.`);
    }
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
    updateDisplays();

    backgroundY += backgroundSpeed * (deltaTime / 1000);
    if (backgroundY <= -600) {
        backgroundY = 0;
    }
    background.style.backgroundPosition = `0px ${backgroundY}px`;

    gameStates.playerShots = gameStates.playerShots.filter(shot => shot.move(deltaTime));
    //console.log("shot", Array.isArray(gameStates.playerShots), gameStates.playerShots);


    enemies.forEach(enemy => enemy.move());
    if (elapsedTime > threshold) {
        console.log("speed", elapsedTime, threshold);
        threshold *= 2;
        enemies.forEach(enemy => enemy.speedUp());
    }
    enemyShots.forEach(enemyShot => enemyShot.move());

    // update player
    if (!gameStates.player.active) {
        return;
    }
    gameStates.player.handleKeyDown(keysPressed, deltaTime);
    gameStates.player.checkCollisionWithEnemies();
    //console.log("shot", Array.isArray(gameStates.playerShots), gameStates.playerShots);
}

export function updateDisplays() {
    //console.log("gamestates", gameStates.lives);

    scoreDisplay.textContent = `Score: ${gameStates.score}`
    livesDisplay.textContent = `Lives: ${gameStates.lives}`
    timerDisplay.textContent = `Time: ${(elapsedTime / 1000).toFixed(1)}`;
}

export function pauseGame() {
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
    //enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);
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

export function gameOver() {
    gameStates.player.element.style.visibility = 'hidden';

    updateDisplays();
    gameOverText = document.createElement('div');
    gameOverText.setAttribute('id', 'game-over');
    gameOverText.textContent = 'Game Over';
    gameArea.appendChild(gameOverText);

    isPaused = true;
    cancelAnimationFrame(gameInterval);
    clearInterval(enemyInterval);
    document.removeEventListener("keydown", keydownHandler);
    unfocusOnGame();
}

export function gameComplete() {
    gameOverText = document.createElement('div');
    gameOverText.setAttribute('id', 'game-complete');
    gameOverText.textContent = 'Mission Complete';
    gameArea.appendChild(gameOverText);

    isPaused = true;
    cancelAnimationFrame(gameInterval);
    clearInterval(enemyInterval);
    document.removeEventListener("keydown", keydownHandler);
    unfocusOnGame();
}

pauseGame()