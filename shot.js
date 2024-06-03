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
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    move() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.element.remove();
            return false;
        }
        this.updatePosition();
        return true;
    }

    checkDestroy(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            ) {
                this.element.remove();
                enemy.destroy();
                return true;
            }
        }
        return false;
    }
}
