import { Item } from './_item.js';
import { PORTALS_SIZE } from '../_constants/_constants.js';

export class Portal extends Item {
    constructor(entryX, entryY, exitX, exitY, canvas) {
        super(entryX, entryY, PORTALS_SIZE, canvas);
        this.exit = { x: exitX, y: exitY };

        // Load images for the portal
        this.imageEntry = new Image();
        this.imageEntry.src = '../assets/images/treePortalBlue.png'; // Entry portal image

        this.imageExit = new Image();
        this.imageExit.src = '../assets/images/treePortalPurple.png'; // Exit portal image
    }

    checkCollision(player) {
        /**
         * Detects if the player overlaps with the portal entry.
         * @param player : player object
         * @returns {object|null} : exit coordinates or null
         */
        const overlapX = player.x < this.x + this.size && player.x + player.size > this.x;
        const overlapY = player.y < this.y + this.size && player.y + player.size > this.y;

        if (overlapX && overlapY) {
            return this.exit; // Return exit coordinates
        }
        return null;
    }

    draw() {
        /**
         * Draws both entry and exit portal images on the canvas.
         */
        this.ctx.drawImage(this.imageEntry, this.x, this.y, this.size, this.size);
        this.ctx.drawImage(this.imageExit, this.exit.x, this.exit.y, this.size, this.size);
    }

    update(player) {
        /**
         * Updates portal logic: checks collision and teleports the player.
         * @param player : player object
         */
        const exit = this.checkCollision(player);
        if (exit) {
            player.x = exit.x;
            player.y = exit.y;
        }
        this.draw();
    }
}
