import { TILE_WIDTH, PIXEL_ART_RATIO } from '../_constants/_constants.js';
export class Item {
    constructor(x, y, size, canvas, path) {
        this.x = x * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - size) / 2;
        this.y = y * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - size) / 2;
        this.size = size;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.image= new Image();
    }

    draw() {
        /*
         * Default displaying of items
         */
        this.ctx.clearRect(this.x, this.y, this.size, this.size);
        this.ctx.drawImage(image, this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }
}