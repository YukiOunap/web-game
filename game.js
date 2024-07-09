import { Player } from './player.js';
import { Shot } from './shot.js';
import { Enemy } from './enemy.js';
import { UFO } from './ufo.js';
import { Wall } from './wall.js';

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

const ufoSpawnRate = 0.001;

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
let numberOfEnemies;
let destroyedEnemies = 0;
let ufo = 0;
let walls = [];

// let testEnemy = new Enemy(enemyElem)

let player;

export let gameStates = {
    gameArea,
    enemies,
    numberOfEnemies,
    destroyedEnemies,
    ufo,
    walls,
    score,
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
    const enemySpacingWidth = 60;
    const enemySpacingHeight = 40;
    const enemyWidth = 40;
    const enemyHeight = 40;
    gameStates.numberOfEnemies = rows * cols;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = 100 + col * (enemyWidth + enemySpacingWidth);
            const y = 100 + row * (enemyHeight + enemySpacingHeight);
            const enemy = new Enemy(x, y);
            gameArea.appendChild(enemy.element);
            enemies.push(enemy);
        }
    }
}

function getWalls() {
    const wallElements = document.getElementsByClassName('wall');
    console.log(wallElements);
    gameStates.walls = Array.from(wallElements).map(el => new Wall(el));
    console.log(gameStates.walls);
}

function resetAndStartGame() {
    gameStates.score = 0;
    gameStates.lives = 3;
    elapsedTime = 0;
    backgroundY = 0;
    updateDisplays();
    gameStates.destroyedEnemies = 0;

    removeElement(gameOverText);
    console.log("test", gameStates.enemies);

    if (gameStates.enemies.length > 0) {
        gameStates.enemies.forEach((enemy) => {
            if (enemy.element) {
                enemy.element.remove();
            }
        });
    }

    if (gameStates.enemyShots.length > 0) {
        gameStates.enemyShots.forEach((shot) => removeElement(shot.element));
    }
    createEnemies();

    getWalls();

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
    enemyShots.forEach(enemyShot => enemyShot.move());

    if (!gameStates.ufo.active && Math.random() < ufoSpawnRate) {
        console.log(`UFO`);
        const tmp = Math.random().toFixed(1)
        const ufoDirection = tmp > 0.5 ? -1 : 1;
        console.log("random", tmp, ufoDirection);
        gameStates.ufo = new UFO(ufoDirection);
        gameArea.appendChild(gameStates.ufo.element);
    } else if (gameStates.ufo.active) {
        gameStates.ufo.move();
    }

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