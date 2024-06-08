import { gameStates, updateDisplays } from './game.js';
import { EnemyShot } from './enemyShot.js';

const gameArea = document.getElementById('game');
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

export class Enemy {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'enemy';

        this.speed = 2;

        this.enemyWidth = this.element.offsetWidth;
        this.enemyHeight = this.element.offsetHeight;

        this.x = x;
        this.y = y;

        this.score = 100;
    }

    move() {
        if (this.x < 0 || this.x > gameAreaWidth) {
            this.speed *= -1;
            this.y += 50;
        }
        this.x += this.speed;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        if (Math.random() > 0.999) {
            this.shot();
        }
    }

    destroyed() {
        this.element.remove();
        gameStates.score += this.score;
        console.log(gameStates.score);
        updateDisplays();
    }

    shot() {
        const shot = new EnemyShot(this.x, this.y);
        gameStates.enemyShots.push(shot);
        console.log("shot added", this.x, this.y)
    }

}
