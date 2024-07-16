import { Shot } from './shot.js';
import { gameStates, gameOver, pauseGame } from './game.js';


const gameArea = document.getElementById('game');

export class Player {
    constructor() {
        // constants
        this.element = document.getElementById('player');
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.bulletCoolDown = 400;
        this.playerSpeed = 300;

        this.playerDeathSound = new Audio('assets/music/death.mp3')
        this.playerHitSound = new Audio('assets/music/playerHit.mp3')

        this.init();
    }

    init() {
        this.element.style.backgroundImage = "url('assets/textures/player.gif')";
        this.positionX = gameArea.clientWidth / 2;
        this.lastShotTime = 0;
        this.active = true;
    }

    move(keysPressed, deltaTime) {
        if (keysPressed['ArrowLeft']) {
            this.positionX = Math.max(0 + this.width / 2, this.positionX - this.playerSpeed * deltaTime / 1000);
        }
        if (keysPressed['ArrowRight']) {
            this.positionX = Math.min(gameArea.clientWidth - this.width / 2, this.positionX + this.playerSpeed * deltaTime / 1000);
        }
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.positionX}px`;
    }

    shoot() {
        const currentTime = performance.now();
        if (this.active && currentTime - this.lastShotTime >= this.bulletCoolDown) {
            this.lastShotTime = currentTime;
            let shot = new Shot(this.positionX, this.height);
            gameStates.playerShots.push(shot);
        }
    }

    checkCollisionWithEnemy(enemy) {
        const enemyRect = enemy.element.getBoundingClientRect();
        const playerRect = this.element.getBoundingClientRect();

        if (!(
            enemyRect.left > playerRect.right || enemyRect.right < playerRect.left ||
            enemyRect.top > playerRect.bottom || enemyRect.bottom < playerRect.top
        )) {
            this.active = false;
            gameStates.lives = 1;
            this.destroyed();
        }
    }

    async destroyed() {
        // destroy current player (show explosion effect)
        gameStates.lives--;
        this.active = false;
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        await new Promise(resolve => setTimeout(resolve, 300));

        // check if new player respawn
        if (gameStates.lives == 0) {
            this.element.style.backgroundImage = "none";
            this.playerDeathSound.play();
            gameOver('game-over')
        } else {
            this.element.style.backgroundImage = "url('assets/textures/player.gif')";
            this.positionX = gameArea.clientWidth / 2;
            this.updatePosition();
            this.active = true;
            this.playerHitSound.play();
        }
    }
}
