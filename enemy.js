import { gameStates, updateDisplays } from './game.js';

const gameArea = document.getElementById('game');
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

export class Enemy {
    constructor(element) {
        this.element = element;
        this.speed = 10;

        this.enemyWidth = this.element.offsetWidth;
        this.enemyHeight = this.element.offsetHeight;

        this.x = 10;
        this.y = 50;

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
    }

    destroyed() {
        this.element.remove();
        gameStates.score += this.score;
        console.log(gameStates.score);
        updateDisplays();
    }

}
