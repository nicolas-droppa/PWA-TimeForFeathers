import { Entity } from './_entity.js';
import { DOG_SIZE, DOG_STATE, TILE_WIDTH, PIXEL_ART_RATIO } from '../_constants/_constants.js';

export class Dog extends Entity {
    constructor(x, y, speed, canvas, path) {
        super(x, y, DOG_SIZE, speed, canvas);
        this.path = path.map(([col, row]) => [
            col * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2,
            row * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2
        ]);
        this.currentTargetIndex = 0;
        this.reachedTarget = true;
        this.state = DOG_STATE.GUARDING;
    }

    updatePosition(deltaTime) {
        /*
         * Updates position of a dog
         * @param deltaTime : value for movement normalization
         */
        const [targetX, targetY] = this.path[this.currentTargetIndex];
        super.updatePosition(deltaTime, targetX, targetY);

        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < this.speed * deltaTime) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length;
        }
    }

    checkForPlayerInSight(playerX, playerY, playerSize) {
        
    }

    draw() {
        /*
         * Draws the dog on canvas
         */
        // -1 and +2 to prevent errors of not delelting whole chicken
        this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update(playerX, playerY, playerSize, deltaTime) {
        /*
         * Parrent class for all the smaller functions regarding dog script
         * @param playerX : ...
         * @param playerY : ...
         * @param playerSize : ...
         * @param deltaTime : value used to normalize movement speed
         */
        this.updatePosition(deltaTime);
        this.checkForPlayerInSight(playerX, playerY, playerSize)
        this.draw();
    }
}