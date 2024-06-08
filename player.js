import { Shot } from './shot.js';
import { gameStates } from './game.js';

const gameArea = document.getElementById('game')
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

let keyReleased = true;

export class Player {
    constructor(element) {
        this.element = element;
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
        console.log(keyReleased);
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

    checkCollisionWithEnemies(enemies) {
        for (let enemy of enemies) {
            if (enemy.checkCollision(this.x, this.y, this.playerWidth, this.playerHeight)) {
                console.log('Collision detected!');
                return true;
            }
        }
        return false;
    }
}
