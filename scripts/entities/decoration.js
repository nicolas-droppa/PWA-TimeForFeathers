import { Item } from './_item.js';
import { DECORATIONS_SIZE } from "../_constants/_constants";

export class Decoration extends Item {
    constructor(x, y, canvas, imageSrc) {
        super(x, y, DECORATIONS_SIZE, canvas);
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}
