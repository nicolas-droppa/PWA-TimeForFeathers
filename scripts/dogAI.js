import { DOG_SIZE, TILE_WIDTH, PIXEL_ART_RATIO, DOG_STATE } from './_constants.js';
export class Dog {
    constructor(startX, startY, speed, canvas, path) {
        this.x = startX * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2;
        this.y = startY * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2;
        this.prevX = this.x;
        this.prevY = this.y;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = (TILE_WIDTH * PIXEL_ART_RATIO);
        this.size = DOG_SIZE;
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
         * Moves dog to target and cycles to another
         * deltaTime : time diff for movement normalization
         */
        if (this.eaten || this.path.length == 0) return;
    
        const [targetX, targetY] = this.path[this.currentTargetIndex];
        const deltaX = targetX - this.x;
        const deltaY = targetY - this.y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    
        const moveDistance = this.speed * deltaTime;
    
        if (distance < moveDistance) { // Target reached
            this.prevX = this.x;
            this.prevY = this.y;
            this.x = targetX;
            this.y = targetY;
            this.reachedTarget = true;
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length; // Next target
        } else { // Move to the target
            this.prevX = this.x;
            this.prevY = this.y;
            const moveX = (deltaX / distance) * moveDistance;
            const moveY = (deltaY / distance) * moveDistance;
            this.x += moveX;
            this.y += moveY;
            this.reachedTarget = false;
        }
    }

    draw() {
        /*
         * Draw the dog
         */
        // -1 and +2 to prevent errors of not delelting whole chicken
        this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update(deltaTime) {
        this.updatePosition(deltaTime);
        this.draw();
    }
}