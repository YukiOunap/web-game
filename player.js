import { Shot } from './shot.js';

const gameArea = document.getElementById('game-container')
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

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
        window.addEventListener('resize', () => this.handleResize());
    }

    handleKeyDown(e) {
        console.log('keyPressed');
        if (e.key === 'ArrowLeft') {
            this.moveLeft();
        } else if (e.key === 'ArrowRight') {
            this.moveRight();
        } else if (e.key === ' ') {
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

    handleResize() {
        this.playerWidth = this.element.offsetWidth;
        if (this.x > window.innerWidth - this.playerWidth) {
            this.x = window.innerWidth - this.playerWidth;
        }
        this.updatePosition();
    }

    shot() {
        const shot = new Shot(this.x, this.y);
        this.shots.push(shot);
    }

    updateShots() {
        this.shots = this.shots.filter(shot => shot.move());
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
