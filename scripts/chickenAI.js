export class Chicken {
    constructor(startX, startY, speed, canvas, path, tileSize) {
        this.x = startX * tileSize;
        this.y = startY * tileSize;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = tileSize;
        this.size = tileSize;
        this.path = path.map(([col, row]) => [col * tileSize, row * tileSize]);
        this.currentTargetIndex = 0;
        this.reachedTarget = true;
        this.eaten = false;
    }

    updatePosition() {
        /*
         * Move the chicken toward the current target coordinate in the path.
         * When it reaches the target, switch to the next one.
         */
        if (this.eaten || this.path.length == 0) return;

        const [targetX, targetY] = this.path[this.currentTargetIndex];

        const deltaX = targetX - this.x;
        const deltaY = targetY - this.y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        if (distance < this.speed) { //target reached
            this.x = targetX;
            this.y = targetY;
            this.reachedTarget = true;
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length; //next target
        } else { //move to the target
            const moveX = (deltaX / distance) * this.speed;
            const moveY = (deltaY / distance) * this.speed;
            this.x += moveX;
            this.y += moveY;
            this.reachedTarget = false;
        }
    }

    checkCollision(playerX, playerY, playerSize) {
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
        }
    }

    draw() {
        /*
         * Draw the chicken as a red square if not eaten.
         */
        if (this.eaten) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(playerX, playerY, playerSize) {
        this.updatePosition();
        this.checkCollision(playerX, playerY, playerSize);
        this.draw();
    }
}