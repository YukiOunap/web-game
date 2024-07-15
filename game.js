import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { UFO } from './ufo.js';
import { Wall } from './wall.js';

const gameWhole = document.getElementsByTagName('body')[0];
const gameArea = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
const continueButton = document.getElementById('continue-button');
const restartButton = document.getElementById('restart-button');
const pauseMenu = document.getElementById('pause-menu');
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');

// UFO setting
const ufoSpawnRate = 5;
const ufoCoolDown = 1000;
let lastUFOTime = 0;

// enemy speed increase setting
const speedIncreaseInterval = 5000;
let lastSpeedIncreaseTime = 0;

const keysPressed = {};
let gameInterval;
let isPaused = true;
let elapsedTime = 0;
let lastTime = 0;

export let gameStates = {
    player: 0,
    playerShots: [],
    enemies: [],
    enemyShots: [],
    numberOfEnemies: 0,
    destroyedEnemies: 0,
    ufo: 0,
    walls: [],
    score: 0,
    lives: 0,
    elapsedTime: 0,
}

// First Time Start Menu ------------------

function showStartMenu() {
    isPaused = true;
    startMenu.style.display = "block";
    pauseMenu.style.display = "none";
    unfocusOnGame();
}

function resetAndStartGame() {
    startMenu.style.display = "none";
    resetGame();
}

showStartMenu();
startButton.addEventListener("click", resetAndStartGame);
restartButton.addEventListener("click", resetAndStartGame);
continueButton.addEventListener("click", startGame);
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        pauseGame();
    } else {
        lastTime = performance.now();
        startGame();
    }
});


// Initialize / Reset Environments -------------------

gameStates.player = new Player();

function resetGame() {
    // reset scores and display
    gameStates.score = 0;
    gameStates.lives = 3;
    elapsedTime = 0;
    updateDisplays();

    // reset player
    gameStates.player.init();
    removeAllElements(gameStates.playerShots);
    gameStates.playerShots.splice(0);

    // reset enemy states
    gameStates.destroyedEnemies = 0;
    removeAllElements(gameStates.enemies);
    gameStates.enemies.splice(0);
    removeAllElements(gameStates.enemyShots);
    gameStates.enemyShots.splice(0);
    createEnemies();
    lastSpeedIncreaseTime = 0;

    // reset walls
    gameStates.walls.splice(0);
    getWallElements();

    // reset UFO
    lastUFOTime = 0;
    if (gameStates.ufo) {
        gameStates.ufo.element.remove();
    }

    pauseMenu.style.display = "none";

    if (gameInterval) {
        cancelAnimationFrame(gameInterval);
    }
    addKeyEventListeners();

    console.log("RESET!", gameInterval, gameStates);
    startGame();
}

function removeAllElements(elementArray) {
    if (elementArray.length > 0) {
        elementArray.forEach((element) => {
            element.element.remove();
        });
    }
}

function createEnemies() {
    const rows = 4;
    const cols = 7;
    const enemySpacingWidth = 60;
    const enemySpacingHeight = 30;
    const enemyWidth = 35;
    const enemyHeight = 35;
    gameStates.numberOfEnemies = rows * cols;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = 50 + col * (enemyWidth + enemySpacingWidth);
            const y = 50 + row * (enemyHeight + enemySpacingHeight);
            const enemy = new Enemy(x, y);
            gameArea.appendChild(enemy.element);
            gameStates.enemies.push(enemy);
        }
    }
}

function getWallElements() {
    const wallElements = document.getElementsByClassName('wall');
    gameStates.walls = Array.from(wallElements).map(el => new Wall(el));
}


// Pause & Resume(Start) -----------------------

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

    isPaused = true;
    cancelAnimationFrame(gameInterval);
    removeKeyEventListeners();

    await new Promise(resolve => setTimeout(resolve, 2500));
    elem.style.display = "none";
    showStartMenu();
}


// Key Event Handlers --------------------

function pauseKeyHandler(pressedKey) {
    if (pressedKey.key === "Escape" || pressedKey.key === "p" || pressedKey.key === "P") {
        if (isPaused) {
            startGame();
        } else {
            pauseGame();
            console.log(gameStates);
        }
    }
}

function playerKeyHandler(pressedKey) {
    if (isPaused) {
        return;
    }

    keysPressed[pressedKey.key] = true;
    if (pressedKey.key == ' ') {
        gameStates.player.shoot();
    }
}

function keyUpHandler(releasedKey) {
    keysPressed[releasedKey.key] = false;
}

function addKeyEventListeners() {
    document.addEventListener("keydown", pauseKeyHandler);
    document.addEventListener("keydown", playerKeyHandler);
    document.addEventListener("keyup", keyUpHandler);
}

function removeKeyEventListeners() {
    document.removeEventListener("keydown", pauseKeyHandler);
    document.removeEventListener("keydown", playerKeyHandler);
}


// Loop and Update ------------------------ !!!

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
    updateDisplays();

    // update player
    if (gameStates.player.active) {
        gameStates.player.move(keysPressed, deltaTime);
        gameStates.enemies.forEach(enemy => gameStates.player.checkCollisionWithEnemy(enemy));
    }
    gameStates.playerShots.forEach(shot => shot.move(deltaTime));

    // update enemies
    gameStates.enemies.forEach(enemy => enemy.move(deltaTime));
    gameStates.enemyShots.forEach(enemyShot => enemyShot.move(deltaTime));
    if (elapsedTime - lastSpeedIncreaseTime > speedIncreaseInterval) {
        gameStates.enemies.forEach(enemy => enemy.speedUp());
        lastSpeedIncreaseTime = elapsedTime;
        console.log(`speed up`, elapsedTime, lastSpeedIncreaseTime);
    }

    // update UFO
    if (gameStates.ufo.active) {
        gameStates.ufo.move(deltaTime);
    } else if (currentTime - lastUFOTime >= ufoCoolDown) {
        spawnUFO();
        lastUFOTime = currentTime;
    }
}

function spawnUFO() {
    if (Math.random() * 100 < ufoSpawnRate) {
        const ufoDirection = Math.random().toFixed(1) > 0.5 ? -1 : 1;
        gameStates.ufo = new UFO(ufoDirection);
        gameArea.appendChild(gameStates.ufo.element);
    }
}

export function updateDisplays() {
    scoreDisplay.textContent = `Score: ${gameStates.score}`
    livesDisplay.textContent = `Lives: ${gameStates.lives}`
    timerDisplay.textContent = `Time: ${(elapsedTime / 1000).toFixed(1)}`;
}