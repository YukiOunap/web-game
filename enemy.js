import { gameStates, updateDisplays, gameOver } from './game.js';
import { EnemyShot } from './enemyShot.js';

const gameArea = document.getElementById('game');

let enemySpeed = 100;
let enemyShootRate = 40;

export class Enemy {
    constructor(positionX, positionY) {
        // constants
        this.element = document.createElement('div');
        this.element.className = 'enemy';
        this.score = 100;

        this.positionX = positionX;
        this.positionY = positionY;
        this.direction = 1;
        this.active = true;
        this.init();


        //boom sound
        this.boomSound = new Audio('assets/music/boom.mp3')
        this.winSound = new Audio('assets/music/win.mp3')
    }

    init() {
        enemySpeed = 100;
        enemyShootRate = 150;
    }

    move(deltaTime) {
        if (this.positionX < 0 || this.positionX > gameArea.offsetWidth - this.element.offsetWidth) {
            this.direction *= -1;
            this.positionY += 40;
        }
        this.positionX += this.direction * enemySpeed * deltaTime / 1000;
        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;

        if (Math.random() * 100000 < enemyShootRate) {
            this.shot();
        }
    }

    speedUp() {
        enemySpeed += 3;
        enemyShootRate += 5;
    }

    async destroyed() {
        if (!this.active) {
            return;
        }

        //boom sound when destroyed

        this.boomSound.play();

        // destroy this enemy (show explosion effect)
        this.active = false;
        this.element.style.backgroundImage = "url('assets/textures/explosion.gif')";
        await new Promise(resolve => setTimeout(resolve, 500));

        this.element.remove();
        gameStates.score += this.score;
        updateDisplays();
        gameStates.destroyedEnemies++;

        if (gameStates.destroyedEnemies == gameStates.numberOfEnemies) {
            gameOver('game-complete').then(() => {
                this.winSound.play();
            });
        }
    }

    shot() {
        if (!this.active) {
            return;
        }

        const shot = new EnemyShot(this.positionX, this.positionY);
        gameStates.enemyShots.push(shot);
    }

}
