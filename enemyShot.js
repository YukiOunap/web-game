import { gameStates } from './game.js';

const gameArea = document.getElementById('game')

export class EnemyShot {
    constructor(x, y) {
        // constants
        this.element = document.createElement('div');
        this.element.className = 'enemy-shot';
        this.x = x;
        this.speed = 500;

        this.y = y;
        this.active = true;

        gameArea.appendChild(this.element);
    }

    move(deltaTime) {
        if (!this.active) {
            return false;
        }

        this.y += this.speed * deltaTime / 1000;
        if (this.y > gameArea.offsetHeight) {
            this.element.remove();
            return false;
        }
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        this.checkDestroyWalls();
        this.checkDestroyPlayer();
        return true;
    }

    async checkDestroyWalls() {
        if (gameStates.walls.length < 0) {
            return;
        }

        for (let wall of gameStates.walls) {
            const shotRect = this.element.getBoundingClientRect();
            // adjust shot hit area
            const shotHitBox = this.adjustShotArea(shotRect);

            const wallRect = wall.boundingClientRect;

            if (wall.active && this.active &&
                !(
                    wallRect.left > shotHitBox.right || wallRect.right < shotHitBox.left ||
                    wallRect.top > shotHitBox.bottom || wallRect.bottom < shotHitBox.top
                )) {
                // destroy the wall (show explosion effect)
                this.active = false;
                wall.damaged();
                this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
                await new Promise(resolve => setTimeout(resolve, 500));

                this.element.remove();
            }
        }
    }

    checkDestroyPlayer() {
        if (!gameStates.player.active) {
            return;
        }

        const shotRect = this.element.getBoundingClientRect();
        // adjust shot hit area
        const shotHitBox = this.adjustShotArea(shotRect);

        const player = gameStates.player.element.getBoundingClientRect();

        if (!(
            player.left > shotHitBox.right || player.right < shotHitBox.left ||
            player.top > shotHitBox.bottom || player.bottom < shotHitBox.top
        )) {
            this.element.remove();
            this.active = false;
            gameStates.player.destroyed();
        }
    }

    adjustShotArea(shotRect) {
        return {
            left: shotRect.left,
            right: shotRect.right - 5,
            top: shotRect.top - 5,
            bottom: shotRect.bottom
        };
    }
}
