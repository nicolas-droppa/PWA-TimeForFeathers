import { CHICKEN_SIZE, TILE_WIDTH, PIXEL_ART_RATIO } from './_constants.js';
export class Chicken {
    constructor(startX, startY, speed, canvas, path) {
        this.x = startX * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2;
        this.y = startY * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2;
        this.prevX = this.x;
        this.prevY = this.y;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = (TILE_WIDTH * PIXEL_ART_RATIO);
        this.size = CHICKEN_SIZE;
        this.path = path.map(([col, row]) => [
            col * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2,
            row * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - CHICKEN_SIZE) / 2
        ]);
        this.currentTargetIndex = 0;
        this.reachedTarget = true;
        this.eaten = false;

        this.imageLeft = new Image();
        this.imageLeft.src = '../images/chicken_left.png';

        this.imageRight = new Image();
        this.imageRight.src = '../images/chicken_right.png';
    }

    updatePosition(deltaTime) {
        /*
         * Moves chicken to target and cycles to another
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

    checkCollision(playerX, playerY, playerSize, timer) {
        /*
         * Check if the player overlaps with the chicken.
         * If so, mark the chicken as "eaten."
         * playerX : x-position of player
         * playerY : y-position of player
         * playerSize : size of player
         */
        const overlapX = playerX < this.x + this.size && playerX + playerSize > this.x;
        const overlapY = playerY < this.y + this.size && playerY + playerSize > this.y;

        if (overlapX && overlapY) {
            this.eaten = true;
            this.logEvent(timer);
        }
    }

    logEvent(timer) {
        /*
         * Logs event in case of chicken beign eaten
         * timer : timer object
         */
        const [minutes,seconds,milliseconds] = timer.getFormattedTime();
        const eventContainer = document.getElementById('eventTable');
        const eventElement = document.createElement('p');
        eventElement.id = 'event';
        eventElement.innerHTML = `<span id="eventTitle">Chicken</span><span id="eventTime">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}</span>`;
        eventContainer.appendChild(eventElement);
    }

    draw() {
        /*
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
        this.updatePosition(deltaTime);
        this.checkCollision(playerX, playerY, playerSize, timer);
        this.draw();
    }
}
