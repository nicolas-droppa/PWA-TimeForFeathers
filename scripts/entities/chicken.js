import { Entity } from './_entity.js';
import { CHICKEN_SIZE, TILE_WIDTH, PIXEL_ART_RATIO, CHICKEN_SPEED } from '../_constants/_constants.js';

export class Chicken extends Entity {
    constructor(x, y, canvas, path) {
        super(x, y, CHICKEN_SIZE, CHICKEN_SPEED, canvas);
        this.imageLeft.src = '../../assets/images/chicken/chicken_left.png';
        this.imageRight.src = '../../assets/images/chicken/chicken_right.png';

        this.path = path.map(([col, row]) => [
            col * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2,
            row * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2
        ]);
        this.currentTargetIndex = 0;
        this.eaten = false;
    }

    updatePosition(deltaTime) {
        /**
         * Updates position of a chicken
         * @param deltaTime : value for movement normalization
         */
        if (this.eaten || !this.path.length) return;

        const [targetX, targetY] = this.path[this.currentTargetIndex];
        super.updatePosition(deltaTime, targetX, targetY);

        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < this.speed * deltaTime) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length;
        }
    }

    checkCollision(playerX, playerY, playerSize, timer) {
        /**
         * Check if the player overlaps with the chicken.
         * If so, mark the chicken as "eaten."
         * @paramplayerX : x-position of player
         * @param playerY : y-position of player
         * @param playerSize : size of player
         * @param timer : timer object
         */
        const overlapX = playerX < this.x + this.size && playerX + playerSize > this.x;
        const overlapY = playerY < this.y + this.size && playerY + playerSize > this.y;

        if (overlapX && overlapY) {
            this.eaten = true;
            this.logEvent(timer);
        }
    }

    logEvent(timer) {
        /**
         * Logs event in case of chicken beign eaten
         * @param timer : timer object
         */
        const [minutes,seconds,milliseconds] = timer.getFormattedTime();
        const eventContainer = document.getElementById('eventTable');
        const eventElement = document.createElement('p');
        eventElement.id = 'event';
        eventElement.innerHTML = `<span id="eventTitle">Chicken</span><span id="eventTime">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}</span>`;
        eventContainer.appendChild(eventElement);
    }

    draw() {
        /**
         * Draw the chicken if not eaten.
         */
        if (this.eaten) {
            // -1 and +2 to prevent errors of not delelting whole chicken
            this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
            return;
        }

        // -1 and +2 to prevent errors of not delelting whole chicken
        this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
        const image = this.x < this.prevX ? this.imageLeft: this.imageRight;
        this.ctx.drawImage(image, this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update(playerX, playerY, playerSize, timer, deltaTime) {
        /**
         * Parrent class for all the smaller functions regarding chicken script
         * @param playerX : ...
         * @param playerY : ...
         * @param playerSize : ...
         * @param timer : timer object
         * @param deltaTime : value used to normalize movement speed
         */
        this.updatePosition(deltaTime);
        this.checkCollision(playerX, playerY, playerSize, timer);
        this.draw();
    }
}