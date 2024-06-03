let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let timerDisplay = document.getElementById('timer');
let continueButton = document.getElementById('continue-button');
let restartButton = document.getElementById('restart-button');
let gameArea = document.getElementById('game-container')
let pauseMenu = document.getElementById('pause-menu');
let background = document.getElementById('background');
let gameWhole = document.getElementsByTagName('body')[0];


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

document.addEventListener("DOMContentLoaded", () =>{
    const player = new Player(gameArea);
    document.addEventListener("keydown", (event) =>{
        if (!isPaused){
            switch(event.key){
                case "ArrowLeft":
                    player.moveLeft();
                    break
                case "ArrowRight":
                    player.moveRight();
                    break
                case " ":
                    player.shoot();
                    break;
            }
        }
    })
})



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

class Player{
    constructor(gameArea){
        this.gameArea = gameArea;
        this.element = document.createElement('div');
        this.element.id = 'player';
        this.gameArea.appendChild(this.element);
        this.speed = gameSettings.playerSpeed;
        this.positionX = this.gameArea.clientWidth/2;
        this.updatePosition();
    }

    updatePosition(){
        this.element.style.left = `${this.positionX}px`;
    }

    moveLeft(){
        this.positionX = Math.max(0, this.positionX - this.speed);
        this.updatePosition();
    }
    moveRight(){
        this.positionX = Math.max(this.gameArea.clientWidth - this.element.clientWidth, this.positionX + this.speed);
        this.updatePosition;
    }

    
}


pauseGame()