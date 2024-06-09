import { Enemy } from './enemy.js';
import { gameStates } from './game.js';

const gameArea = document.getElementById('game')

export class Shot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.gameArea = gameArea;
        this.element = document.createElement('div');
        this.element.className = 'shot';
        this.element.textContent = '■'; // test content
        this.gameArea.appendChild(this.element);
        this.active = true;
        this.move();
    }

    move() {
        if (!this.active) {
            return false;
        }

        this.y -= this.speed;
        if (this.y < 0) {

            this.element.remove();
            return false;
        }
        console.log("shot", this.x);
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.checkDestroy();
        return true;
    }

    checkDestroy() {
        if (!this.active) {
            return false;
        }

        const shot = this.element.getBoundingClientRect();

        for (let enemy of gameStates.enemies) {
            const enemyRect = enemy.element.getBoundingClientRect();

            if (!(
                enemyRect.left > shot.right || enemyRect.right < shot.left ||
                enemyRect.top > shot.bottom || enemyRect.bottom < shot.top
            )) {
                console.log("destroyed");
                this.active = false;
                this.element.remove();
                enemy.destroyed();
                return false;
            }
        }

        return true;
    }
}
