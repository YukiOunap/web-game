let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let gameArea = document.getElementById('game-container')
let pauseMenu = document.getElementById('pause-menu');
let background = document.getElementById('background');
let gameWhole = document.getElementsByTagName('body')[0];

const gameSettings = {
    playerSpeed: 240,
    enemySpeed: 5,
    bulletSpeed: 500,
    rateOfFire: 1, //seconds
    enemySpawnRate: 1000, // in ms
    bulletCoolDown: 500, // in ms
    playerWidth: 100,
    playerHeight: 100,
};

const keysPressed = {};

let gameInterval, enemyInterval;
let isPaused = true;
let score = 0;
let lives = 3;
let timer = 0;
let elapsedTime = 0;
let lastTime = performance.now();
let backgroundSpeed = 30;
let backgroundY = 0;

let player;

document.addEventListener("keydown", function (pressedKey) {
    keysPressed[pressedKey.key] = true;
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


function startGame() {
    isPaused = false;
    focusOnGame();
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
    gameArea.scrollIntoView()
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

    if (keysPressed['ArrowLeft']) {
        player.moveLeft(deltaTime);
    }
    if (keysPressed['ArrowRight']) {
        player.moveRight(deltaTime);
    }
    if (keysPressed[' ']) {
        player.shoot(deltaTime);
    }
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



//====================PLAYER ITSELF AND ITS INTERACTIONS
class Player{
    constructor(gameArea){
        this.gameArea = gameArea;
        this.player = document.createElement('div');
        this.player.id = 'player';
        this.player.style.width = `${gameSettings.playerHeight}px`
        this.player.style.height = `${gameSettings.playerWidth}px`
        this.gameArea.appendChild(this.player);
        this.speed = gameSettings.playerSpeed;
        this.playerPositionX = this.gameArea.clientWidth/2-gameSettings.playerWidth/2;
        this.updatePosition();
        this.lastShotTime = 0;
    }

    updatePosition(){
        this.player.style.left = `${this.playerPositionX}px`;
        console.log(this.playerPositionX)
    }

    moveLeft(deltaTime){ 
        this.playerPositionX = Math.max(0, this.playerPositionX - this.speed*deltaTime/1000);
        this.updatePosition();
    }

    moveRight(deltaTime){
        this.playerPositionX = Math.min(this.gameArea.clientWidth-this.player.clientWidth, this.playerPositionX + this.speed*deltaTime/1000);
        this.updatePosition();
    }

    shoot(deltaTime) {
        const currentTime = performance.now();
        if (!isPaused && (currentTime - this.lastShotTime >= gameSettings.bulletCoolDown)) {
            this.lastShotTime = currentTime;
            let bullet = document.createElement('div');
            bullet.className = 'bullet';
            bullet.style.left = `${this.playerPositionX + gameSettings.playerWidth / 2}px`;
            bullet.style.bottom = `${gameSettings.playerHeight}px`;
            this.gameArea.appendChild(bullet);

            if (!isPaused) {
                let bulletPosition = parseInt(bullet.style.bottom);
                if (bulletPosition >= this.gameArea.clientHeight + 240) {
                    bullet.remove();
                    clearInterval(bulletInterval);
                } else {
                    bullet.style.bottom = `${bulletPosition + gameSettings.bulletSpeed * deltaTime / 1000}px`;
                }
            }
        }
    }
}
//TBD Class for bullet

pauseGame()