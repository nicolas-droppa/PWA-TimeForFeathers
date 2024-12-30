import { TILE_WIDTH, PIXEL_ART_RATIO } from "../_constants/_constants.js";
export function coordToTile(coord) {
    /**
     * Converts coordinates to tile indices
     * @param {number} coord : The coordinate to convert
     * @returns {number} : Tile index
     */
    return Math.floor(coord / (TILE_WIDTH * PIXEL_ART_RATIO));
}