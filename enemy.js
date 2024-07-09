import { gameStates, updateDisplays, gameComplete } from './game.js';
import { EnemyShot } from './enemyShot.js';

const gameArea = document.getElementById('game');
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

let shootRate = 15;
let enemySpeed = 25;

export class Enemy {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'enemy';

        this.direction = 1;

        this.enemyWidth = this.element.offsetWidth;
        this.enemyHeight = this.element.offsetHeight;

        this.x = x;
        this.y = y;

        this.score = 100;

        this.active = true;
    }

    move() {
        if (this.x < 0 || this.x > gameAreaWidth) {
            this.direction *= -1;
            this.y += 50;
        }
        this.x += enemySpeed / 10 * this.direction;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        if (Math.random() * 10000 < shootRate) {
            this.shot();
        }
    }

    speedUp() {
        enemySpeed += 1;
        shootRate += 1;
        //console.log("speed up", this)
    }

    async destroyed() {
        if (!this.active) {
            return;
        }

        this.active = false;
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        await new Promise(resolve => setTimeout(resolve, 500));
        this.element.remove();
        gameStates.score += this.score;
        updateDisplays();

        gameStates.enemies.forEach(enemy => enemy.speedUp());

        gameStates.destroyedEnemies++;
        console.log(gameStates.destroyedEnemies, gameStates.numberOfEnemies);
        if (gameStates.destroyedEnemies == gameStates.numberOfEnemies) {
            gameComplete();
        }
    }

    shot() {
        if (!this.active) {
            return;
        }

        const shot = new EnemyShot(this.x, this.y);
        gameStates.enemyShots.push(shot);
        //console.log("shot added", this.x, this.y)
    }

}
