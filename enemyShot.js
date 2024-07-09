import { Enemy } from './enemy.js';
import { gameStates } from './game.js';
import { Player } from './player.js';

const gameArea = document.getElementById('game')

export class EnemyShot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.gameArea = gameArea;
        this.element = document.createElement('div');
        this.element.className = 'enemy-shot';
        //this.element.textContent = '▼'; // test content
        this.gameArea.appendChild(this.element);
        this.active = true;
        this.move();
    }

    move() {
        if (!this.active) {
            return false;
        }

        this.y += this.speed;

        if (this.y > gameStates.gameArea.offsetHeight) {
            this.element.remove();
            return false;
        }
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        if (gameStates.walls.length > 0) {
            gameStates.walls.forEach(wall => this.checkDestroyWall(wall));
        }
        this.checkDestroyPlayer();
        return true;
    }

    async checkDestroyWall(wall) {

        if (!wall.active) {
            return;
        }

        const shot = this.element.getBoundingClientRect();

        if (!(
            wall.boundingClientRect.left > shot.right || wall.boundingClientRect.right < shot.left ||
            wall.boundingClientRect.top > shot.bottom || wall.boundingClientRect.bottom < shot.top
        )) {
            this.active = false;
            this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
            wall.damaged();
            await new Promise(resolve => setTimeout(resolve, 500));
            this.element.remove();
            return false;
        }

        return true;
    }

    checkDestroyPlayer() {
        if (!gameStates.player.active) {
            return;
        }

        const shot = this.element.getBoundingClientRect();
        const player = gameStates.player.element.getBoundingClientRect();

        if (!(
            player.left > shot.right || player.right < shot.left ||
            player.top > shot.bottom || player.bottom < shot.top
        )) {
            this.element.remove();
            this.active = false;
            gameStates.player.destroyed();
            return false;
        }

        return true;
    }
}
