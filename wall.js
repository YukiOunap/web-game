export class Wall {
    constructor(element) {
        this.element = element;

        this.boundingClientRect = this.element.getBoundingClientRect();

        this.life = 2;
        this.active = true;
    }

    async damaged() {
        if (!this.active) {
            return;
        }

        console.log(this);
        if (this.life == 2) {

            this.active = false;
            this.element.style.backgroundImage = "url('assets/textures/wall/wallLife1.png')";
            this.life--;

            await new Promise(resolve => setTimeout(resolve, 500));
            this.active = true;

            console.log(this);

            return;
        }

        this.element.style.backgroundImage = "url('assets/textures/wall/wallLife0.png')";
        this.active = false;
    }
}