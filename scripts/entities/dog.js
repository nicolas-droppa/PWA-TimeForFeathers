import { Entity } from './_entity.js';
import { DOG_SIZE, DOG_STATE, TILE_WIDTH, PIXEL_ART_RATIO } from '../_constants/_constants.js';
export class Dog extends Entity {
    constructor(x, y, speed, canvas, path, levelDataPath, currentLevel) {
        super(x, y, DOG_SIZE, speed, canvas);
        this.path = path.map(([col, row]) => [
            col * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2,
            row * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - DOG_SIZE) / 2
        ]);
        this.currentTargetIndex = 0;
        this.reachedTarget = true;
        this.state = DOG_STATE.GUARDING;
        this.stateFlag = false;
        this.fovAngle = Math.PI * 2 / 3; //120 degrees
        this.detectionRadius = 150;
        this.recentlyChased = false;
    }

    updatePosition(deltaTime, playerX, playerY, playerSize) {
        /*
         * Updates position of a dog
         * @param deltaTime : value for movement normalization
         */
        if (this.state == DOG_STATE.ALARMED || this.state == DOG_STATE.CONFUSED) {
            return; // Stop movement
        }

        if (this.state == DOG_STATE.CHASING) {
            playerX = playerX * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - playerSize) / 2;
            playerY = playerY * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - playerSize) / 2;
        }
        
        const [targetX, targetY] = this.path[this.currentTargetIndex];
        super.updatePosition(deltaTime, targetX, targetY);

        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < this.speed * deltaTime) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length;
        }
    }

    checkForPlayerInSight(playerX, playerY, playerSize) {
        /*
         * Checks if the player is within the dog's triangular field of view
         * @param playerX : X position of the player
         * @param playerY : Y position of the player
         * @param playerSize : Size of the player
         */
        const dogCenterX = this.x + this.size / 2;
        const dogCenterY = this.y + this.size / 2;
        const playerCenterX = playerX + playerSize / 2;
        const playerCenterY = playerY + playerSize / 2;
    
        // Determine the direction the dog is facing
        const [targetX, targetY] = this.path[this.currentTargetIndex];
        const isHorizontal = Math.abs(targetX - this.x) > Math.abs(targetY - this.y);
    
        let triangle;
        if (isHorizontal) {
            const facingRight = targetX > this.x;
            const direction = facingRight ? 1 : -1;
    
            triangle = [
                [dogCenterX, dogCenterY],
                [dogCenterX + direction * this.detectionRadius, dogCenterY - this.detectionRadius * Math.tan(this.fovAngle)], // Top corner
                [dogCenterX + direction * this.detectionRadius, dogCenterY + this.detectionRadius * Math.tan(this.fovAngle)]  // Bottom corner
            ];
        } else {
            const facingDown = targetY > this.y;
            const direction = facingDown ? 1 : -1;
    
            triangle = [
                [dogCenterX, dogCenterY],
                [dogCenterX - this.detectionRadius * Math.tan(this.fovAngle), dogCenterY + direction * this.detectionRadius], // Left corner
                [dogCenterX + this.detectionRadius * Math.tan(this.fovAngle), dogCenterY + direction * this.detectionRadius]  // Right corner
            ];
        }

        if (this.isPointInTriangle(playerCenterX, playerCenterY, triangle)) {
            if (!this.stateFlag) {
                console.log("Alarmed!");
                this.state = DOG_STATE.ALARMED;
                this.stateFlag = true;
    
                setTimeout(() => {
                    console.log("Chasing!");
                    this.state = DOG_STATE.CHASING;
                }, 500);
            }
        } else {
            if (this.stateFlag) {
                console.log("Confused?");
                this.state = DOG_STATE.CONFUSED;

                setTimeout(() => {
                    console.log("Guarding...");
                    this.state = DOG_STATE.GUARDING;
                    this.stateFlag = false;
                }, 500);
            }
        }
    }
    
    isPointInTriangle(px, py, [v1, v2, v3]) {
        /*
         * Determines if a point is inside a triangle
         * @param px : X coordinate of the point
         * @param py : Y coordinate of the point
         * @param [v1, v2, v3] : Array of triangle vertices
         */
        const area = (v1, v2, v3) =>
            Math.abs((v1[0] * (v2[1] - v3[1]) + v2[0] * (v3[1] - v1[1]) + v3[0] * (v1[1] - v2[1])) / 2);
    
        const A = area(v1, v2, v3);
        const A1 = area([px, py], v2, v3);
        const A2 = area(v1, [px, py], v3);
        const A3 = area(v1, v2, [px, py]);
    
        return Math.abs(A - (A1 + A2 + A3)) < 0.01; // Floating-point tolerance
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
        this.updatePosition(deltaTime, playerX, playerY, playerSize);
        this.checkForPlayerInSight(playerX, playerY, playerSize)
        this.draw();
    }
}
