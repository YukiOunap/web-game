import { gameStates, updateDisplays } from './game.js';

const gameArea = document.getElementById('game');

export class UFO {
    constructor(direction) {
        // constants
        this.element = document.createElement('div');
        this.element.className = 'ufo';
        this.element.style.top = `20px`;
        this.speed = 200;
        this.score = 2000;

        this.direction = direction;
        this.x = this.direction > 0 ? 0 : gameArea.offsetWidth; // set start position depending on its movement direction
        this.element.style.left = `${this.x}px`;
        this.active = true;
    }

    move(deltaTime) {
        this.x += this.speed * this.direction * deltaTime / 1000;
        this.element.style.left = `${this.x}px`;

        // remove UFO when it is outside of game area
        if (this.direction == 1 && this.x >= gameArea.offsetWidth) {
            this.disappear();
        } else if (this.direction == -1 && this.x <= 0) {
            this.disappear();
        }
    }

    disappear() {
        this.active = false;
        this.element.remove();
    }

    async destroyed() {
        // destroy UFO (show explosion effect)
        this.active = false;
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        await new Promise(resolve => setTimeout(resolve, 500));

        this.element.remove();
        gameStates.score += this.score;
        updateDisplays();
    }
}