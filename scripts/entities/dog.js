import { Entity } from './_entity.js';
import { DOG_SIZE, DOG_STATE, TILE_WIDTH, PIXEL_ART_RATIO, DOG_SPEED } from '../_constants/_constants.js';
export class Dog extends Entity {
    constructor(x, y, canvas, path, levelDataPath, currentLevel) {
        super(x, y, DOG_SIZE, DOG_SPEED, canvas);
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
        this.walkingSpeed = DOG_SPEED;
        this.runningSpeed = DOG_SPEED * 2;
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
            //playerX = parseInt(playerX / TILE_WIDTH / 2);
            //playerY = parseInt(playerY / TILE_WIDTH / 2);

            console.log(playerX + " " + playerY);
            
            super.updatePosition(deltaTime, playerX, playerY);
            return;
        }
        
        const [targetX, targetY] = this.path[this.currentTargetIndex];
        super.updatePosition(deltaTime, targetX, targetY);

        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < this.speed * deltaTime) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length;
        }
    }

    drawCone(centerX, centerY, detectionRadius, angle, facingDirection) {
        /*
         * Draws a cone-shaped field of view (FOV) for the dog
         * @param centerX : X-coordinate of the dog's center
         * @param centerY : Y-coordinate of the dog's center
         * @param detectionRadius : The radius of the cone
         * @param angle : The FOV angle in radians
         * @param facingDirection : The direction the dog is facing (in radians)
         */
        // Clear the canvas area (optional: remove if handled elsewhere)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Calculate the start and end angles of the cone
        const startAngle = facingDirection - angle / 2;
        const endAngle = facingDirection + angle / 2;
    
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY); // Start at the center of the dog
        this.ctx.arc(centerX, centerY, detectionRadius, startAngle, endAngle); // Draw the arc
        this.ctx.closePath(); // Close the shape by connecting the arc to the center
    
        // Set fill and stroke styles
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'; // Semi-transparent blue
        this.ctx.fill();
        this.ctx.strokeStyle = 'blue'; // Outline color
        this.ctx.stroke();
    }

    checkForPlayerInSight(playerX, playerY, playerSize) {
        /*
         * Checks if the player is within the dog's cone-shaped field of view
         * @param playerX : X position of the player
         * @param playerY : Y position of the player
         * @param playerSize : Size of the player
         */
        const dogCenterX = this.x + this.size / 2;
        const dogCenterY = this.y + this.size / 2;
        const playerCenterX = playerX + playerSize / 2;
        const playerCenterY = playerY + playerSize / 2;
    
        let targetX, targetY;
    
        if (this.state == DOG_STATE.CHASING) {
            targetX = parseInt(playerX);
            targetY = parseInt(playerY);
        } else {
            [targetX, targetY] = this.path[this.currentTargetIndex];
        }
    
        const facingDirection = Math.atan2(targetY - this.y, targetX - this.x);
    
        // Draw the cone for visualization
        this.drawCone(dogCenterX, dogCenterY, this.detectionRadius, this.fovAngle, facingDirection);
    
        // Check if the player is within the detection radius
        const dx = playerCenterX - dogCenterX;
        const dy = playerCenterY - dogCenterY;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
    
        if (distance <= this.detectionRadius) {
            // Check if the player is within the field of view angle
            const angleToPlayer = Math.atan2(dy, dx);
            const deltaAngle = Math.abs(facingDirection - angleToPlayer);
    
            // Normalize angles to account for edge cases at 0/2π
            const normalizedDeltaAngle = Math.min(deltaAngle, Math.abs(2 * Math.PI - deltaAngle));
    
            if (normalizedDeltaAngle <= this.fovAngle / 2) {
                // Player detected within cone
                if (!this.stateFlag) {
                    console.log("Alarmed!");
                    this.state = DOG_STATE.ALARMED;
                    this.speed = this.runningSpeed;
                    this.stateFlag = true;
    
                    setTimeout(() => {
                        console.log("Chasing!");
                        this.state = DOG_STATE.CHASING;
                    }, 250);
                }
                return;
            }
        }
    
        // Player not detected
        if (this.stateFlag) {
            console.log("Confused?");
            this.state = DOG_STATE.CONFUSED;
            this.speed = this.walkingSpeed;
    
            setTimeout(() => {
                console.log("Guarding...");
                this.state = DOG_STATE.GUARDING;
                this.stateFlag = false;
            }, 250);
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
