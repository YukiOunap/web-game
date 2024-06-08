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
        const enemy = gameStates.testEnemy.element.getBoundingClientRect();

        /*         console.log("CHECKED");
                console.log("SHOT:");
                for (const key in shot) {
                    console.log(`${key} : ${shot[key]}`);
                }
                console.log("ENEMY:");
                for (const key in enemy) {
                    console.log(`${key} : ${enemy[key]}`);
                } */

        if (!(
            enemy.left > shot.right || enemy.right < shot.left ||
            enemy.top > shot.bottom || enemy.bottom < shot.top
        )) {
            console.log("destroyed");
            this.active = false;
            this.element.remove();
            gameStates.testEnemy.destroyed();
            return false;
        }
        //console.log("false");
        return true;
    }
}
