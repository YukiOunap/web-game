import { Enemy } from './enemy.js';
import { gameStates } from './game.js';
import { Player } from './player.js';

export class Shot {
    constructor(positionX, positionY) {
        this.positionY = positionY;
        this.speed = 1000;
        this.element = document.createElement('div');
        this.element.className = 'shot';

        this.element.style.left = `${positionX}px`;
        this.element.style.bottom = `${positionY}px`;
        this.active = true;
        gameStates.gameArea.appendChild(this.element);
    }

    move(deltaTime) {

        this.positionY += this.speed * deltaTime / 1000;

        if (this.positionY > gameStates.gameArea.clientHeight) {
            this.element.remove();
            return false;
        }
        this.element.style.bottom = `${this.positionY}px`;
        this.checkDestroy();


        return true;

    }

    checkDestroy() {
        if (!this.active) {
            return;
        }
        //console.log("shot", this.element, this.positionY);

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
            }
        }

        if (!gameStates.ufo) {
            return;
        }
        const ufoRect = gameStates.ufo.element.getBoundingClientRect();
        if (!(
            ufoRect.left > shot.right || ufoRect.right < shot.left ||
            ufoRect.top > shot.bottom || ufoRect.bottom < shot.top
        )) {
            console.log("destroyed");
            this.active = false;
            this.element.remove();
            gameStates.ufo.destroyed();
        }
    }
}
