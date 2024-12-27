import { TILE_WIDTH, PIXEL_ART_RATIO } from '../_constants/_constants.js';
export class Entity {
    constructor(x, y, size, speed, canvas) {
        this.x = x * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - size) / 2;
        this.y = y * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - size) / 2;
        this.prevX = this.x;
        this.prevY = this.y;
        this.size = size;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.imageLeft = new Image();
        this.imageRight = new Image();
    }

    updatePosition(deltaTime, targetX = null, targetY = null) {
        /*
         * Updates position of an entity
         * @param deltaTime : value for movement normalization
         * @param targetX : x-pos coord of where to move
         * @param targetY : y-pos coord of where to move
         */
        if (targetX !== null && targetY !== null) {
            const deltaX = targetX - this.x;
            const deltaY = targetY - this.y;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            if (distance > 0) {
                const moveDistance = this.speed * deltaTime;
                const moveX = (deltaX / distance) * moveDistance;
                const moveY = (deltaY / distance) * moveDistance;

                this.prevX = this.x;
                this.prevY = this.y;
                this.x += moveX;
                this.y += moveY;
            }
        }
    }

    draw() {
        /*
         * Default displaying of animals
         */
        // -1 and +2 to prevent errors of not delelting whole image
        this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
        const image = this.x < this.prevX ? this.imageLeft: this.imageRight;
        this.ctx.drawImage(image, this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }
}