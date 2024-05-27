let scoreDisplay = document.getElementById('score')
let livesDisplay = document.getElementById('lives')
let timerDisplay = document.getElementById('timer')
let continueButton = document.getElementById('continue-button')
let restartButton = document.getElementById('retry-button')
let gameArea = document.getElementById('game')
let pauseMenu = document.getElementById('pause-menu')
let player = document.getElementById('player')


let gameInterval, enemyInterval;
let paused = false;
let score = 0;
let lives = 3;
let timer = 0;
let elapsedTime = 0;
let lastTime = performance.now();

const gameSettings ={
    playerSpeed : 7, // frames per second
    enemySpeed : 5,
    bulletSpeed : 10,
    enemySpawnRate : 1000, //in ms
    bulletCoolDown : 500, //in ms
}

function startGame(){
    gameInterval = requestAnimationFrame(gameLoop);
    enemyInterval = setInterval(spawnEnemy, gameSettings.enemySpawnRate);    
}

function gameLoop(currentTime) {
    if (paused) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    gameInterval = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    elapsedTime += deltaTime;
    timerDisplay.textContent = `Time: ${(elapsedTime / 1000).toFixed(1)}`;
}



startGame()