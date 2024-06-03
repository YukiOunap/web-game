export class Enemy {
    constructor(element) {
        this.element = element;
        this.speed = 10;

        this.enemyWidth = this.element.offsetWidth;
        this.enemyHeight = this.element.offsetHeight;

        this.x = 50;
        this.y = 50;

        this.direction = 1;

        this.score = 100;
    }

    move() {
        this.x += this.direction * this.speed;
        this.element.style.left = `${this.x}px`;
    }
}
