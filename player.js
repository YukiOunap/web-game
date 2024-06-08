import { Shot } from './shot.js';
import { gameStates, gameOver, createPlayer } from './game.js';

const gameArea = document.getElementById('game')
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

let keyReleased = true;

export class Player {
    constructor() {
        this.element = document.createElement('div');
        this.element.setAttribute('id', 'player');
        this.playerWidth = this.element.offsetWidth;
        this.playerHeight = this.element.offsetHeight;
        this.x = gameAreaWidth / 2;
        this.y = gameAreaHeight - 60;
        this.speed = 10;
        this.shots = [];
        this.init();
    }

    init() {
        this.updatePosition();
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                keyReleased = true;
                console.log(keyReleased);
            }
        });
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            this.moveLeft();
        } else if (e.key === 'ArrowRight') {
            this.moveRight();
        } else if (e.key === ' ' && keyReleased) {
            keyReleased = false;
            console.log(keyReleased);
            this.shot();
        }
    }

    moveLeft() {
        this.x -= this.speed;
        if (this.x < this.playerWidth / 2) this.x = this.playerWidth / 2;
        this.updatePosition();
    }

    moveRight() {
        this.x += this.speed;
        if (this.x > gameAreaWidth - this.playerWidth / 2) this.x = gameAreaWidth - this.playerWidth / 2;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
    }

    shot() {
        const shot = new Shot(this.x, this.y);
        gameStates.playerShots.push(shot);
        console.log("shot added", this.x, this.y)
        console.log("shots", gameStates.playerShots)
    }

    destroyed() {
        this.element.remove();
        gameStates.lives--;

        if (gameStates.lives == 0) {
            gameOver();
        } else {
            createPlayer();
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
                gameOver();
                return true;
            }

        }
        return false;
    }
}
