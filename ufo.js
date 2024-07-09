import { gameStates, updateDisplays } from './game.js';

const ufoSpeed = 8;
const ufoScore = 1000;

export class UFO {
    constructor(direction) {
        this.element = document.createElement('div');
        this.element.className = 'ufo';

        this.direction = direction;

        this.enemyWidth = this.element.offsetWidth;
        this.enemyHeight = this.element.offsetHeight;

        this.x = this.direction > 0 ? 0 : gameStates.gameArea.offsetWidth;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `20px`;

        this.active = true;
    }

    move() {
        if (this.direction == 1 && this.x >= gameStates.gameArea.offsetWidth) {
            this.disappear();
        } else if (this.direction == -1 && this.x <= 0) {
            this.disappear();
        }
        this.x += ufoSpeed * this.direction;
        this.element.style.left = `${this.x}px`;
    }

    disappear() {
        this.active = false;
        this.element.remove();
    }

    async destroyed() {
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        this.active = false;
        await new Promise(resolve => setTimeout(resolve, 500));
        this.element.remove();
        gameStates.score += ufoScore;
        updateDisplays();
    }
}