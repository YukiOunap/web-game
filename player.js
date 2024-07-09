import { Shot } from './shot.js';
import { gameStates, gameOver, pauseGame } from './game.js';

const playerWidth = 60;
const playerHeight = 60;
const positionY = 0;
const bulletCoolDown = 500;

export class Player {
    constructor() {
        this.element = document.getElementById('player');
        this.element.style.width = `${playerWidth}px`;
        this.element.style.height = `${playerHeight}px`;
        this.positionX = gameStates.gameArea.clientWidth / 2;
        this.element.style.bottom = `${positionY}px`;
        this.speed = 250;
        this.lastShotTime = 0;
        this.active = true;
    }

    handleKeyDown(keysPressed, deltaTime) {
        if (keysPressed['ArrowLeft']) {
            this.moveLeft(deltaTime);
        }
        if (keysPressed['ArrowRight']) {
            this.moveRight(deltaTime);
        }
        if (keysPressed[' ']) {
            this.shoot(deltaTime);
        }
    }

    updatePosition() {
        this.element.style.left = `${this.positionX}px`;
        //console.log(this.positionX)
    }

    moveLeft(deltaTime) {
        this.positionX = Math.max(0 + playerWidth / 2, this.positionX - this.speed * deltaTime / 1000);
        this.updatePosition();
    }

    moveRight(deltaTime) {
        this.positionX = Math.min(gameStates.gameArea.clientWidth - playerWidth / 2, this.positionX + this.speed * deltaTime / 1000);
        this.updatePosition();
    }

    shoot() {
        const currentTime = performance.now();
        if (currentTime - this.lastShotTime >= bulletCoolDown) {
            this.lastShotTime = currentTime;
            let shot = new Shot(this.positionX, positionY + playerHeight);
            gameStates.playerShots.push(shot);
        }
    }

    async destroyed() {
        gameStates.lives--;
        //this.element.setAttribute('id', 'player-explode');
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        console.log(this.element);
        this.active = false;
        await new Promise(resolve => setTimeout(resolve, 500));

        if (gameStates.lives == 0) {
            gameOver();
        } else {
            this.element.style.backgroundImage = "url('assets/textures/player.gif')";
            this.positionX = gameStates.gameArea.clientWidth / 2;
            this.updatePosition();
            this.active = true;
            //pauseGame();
        }
    }

    checkCollisionWithEnemies() {
        const player = this.element.getBoundingClientRect();

        for (let enemy of gameStates.enemies) {
            const enemyRect = enemy.element.getBoundingClientRect();

            if (!(
                enemyRect.left > player.right || enemyRect.right < player.left ||
                enemyRect.top > player.bottom || enemyRect.bottom < player.top
            )) {
                console.log("lost");
                this.active = false;
                gameStates.lives = 1;
                this.destroyed();
                return;
            }

        }
        return false;
    }
}
