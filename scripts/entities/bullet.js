import { FARMER_SIZE } from '../_constants/_constants.js';

export class Bullet {
    constructor(x, y, direction, speed, canvas) {
        this.x = x + FARMER_SIZE / 2;
        this.y = y + FARMER_SIZE / 2;
        this.direction = direction;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = 5;
        this.active = true;
        this.travelledDistance = 0;
        this.maxDistance = 180;
    }

    draw() {
        /**
         * Draws the bullet on canvas
         */
        if (!this.active) return;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = 'cyan';
        this.ctx.fill();
        this.ctx.closePath();
    }

    destroy() {
        /**
         * Erases the bullet from canvas
         */
        this.active = false;
        this.ctx.clearRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }

    isOutOfBounds() {
        /**
         * Checks if bullet is still within canvas width
         * @returns { boolean } true if bullet is out of cavas, false otherwise
         */
        return (
            this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height
        );
    }

    update(deltaTime) {
        if (!this.active) return;

        const distanceThisFrame = this.speed * deltaTime;
        this.travelledDistance += distanceThisFrame;

        this.x += Math.cos(this.direction) * distanceThisFrame;
        this.y += Math.sin(this.direction) * distanceThisFrame;

        if (this.isOutOfBounds() || this.travelledDistance >= this.maxDistance) {
            this.destroy();
        }
    }
}