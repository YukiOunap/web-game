export class Wall {
    constructor(element) {
        // constants
        this.element = element;
        this.boundingClientRect = this.element.getBoundingClientRect();

        this.init();
    }

    init() {
        this.element.style.backgroundImage = "url('assets/textures/wall/wallLife2.png')";
        this.life = 2;
        this.active = true;
    }

    async damaged() {
        if (!this.active) {
            return;
        }

        if (this.life == 2) {
            // destroy this enemy (show explosion effect)
            this.element.style.backgroundImage = "url('assets/textures/wall/wallLife1.png')";
            this.active = false;
            this.life--;
            await new Promise(resolve => setTimeout(resolve, 500));

            this.active = true;
            return;
        }

        this.element.style.backgroundImage = "none";
        this.active = false;
    }
}