import { gameStates } from './game.js';

const gameArea = document.getElementById('game');

export class Shot {
    constructor(positionX, positionY) {
        // constants
        this.element = document.createElement('div');
        this.element.className = 'shot';
        this.element.style.left = `${positionX}px`;
        this.speed = 1200;

        this.positionY = positionY;
        this.element.style.bottom = `${positionY}px`;
        this.active = true;

        this.fireSound = new Audio('assets/music/fire.mp3');

        gameArea.appendChild(this.element);
        this.fireSound.play();  
    }

    move(deltaTime) {
        this.positionY += this.speed * deltaTime / 1000;

        if (this.positionY > gameArea.clientHeight) {
            this.active = false;
            this.element.remove();
        }
        this.element.style.bottom = `${this.positionY}px`;
        this.checkDestroy();
    }

    checkDestroy() {
        if (!this.active) {
            return;
        }

        const shotRect = this.element.getBoundingClientRect();
        // adjust shot hit area
        const shotHitBox = {
            left: shotRect.left,
            right: shotRect.right - 5,
            top: shotRect.top - 5,
            bottom: shotRect.bottom
        };

        // check destroy enemy
        for (let enemy of gameStates.enemies) {
            const enemyRect = enemy.element.getBoundingClientRect();

            if (enemy.active &&
                !(
                    enemyRect.left > shotHitBox.right || enemyRect.right < shotHitBox.left ||
                    enemyRect.top > shotHitBox.bottom || enemyRect.bottom < shotHitBox.top
                )) {
                this.active = false;
                this.element.remove();
                enemy.destroyed();
                console.log("DESTROYED!")
                return;
            }
        }

        // check destroy UFO
        if (!gameStates.ufo) {
            return;
        }
        const ufoRect = gameStates.ufo.element.getBoundingClientRect();
        if (!(
            ufoRect.left > shotHitBox.right || ufoRect.right < shotHitBox.left ||
            ufoRect.top > shotHitBox.bottom || ufoRect.bottom < shotHitBox.top
        )) {
            this.active = false;
            this.element.remove();
            gameStates.ufo.destroyed();
        }
    }
}
