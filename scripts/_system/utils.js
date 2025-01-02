import { TILE_WIDTH, PIXEL_ART_RATIO } from "../_constants/_constants.js";
export function coordToTile(coord) {
    /**
     * Converts coordinates to tile indices
     * @param {number} coord : The coordinate to convert
     * @returns {number} : Tile index
     */
    return Math.floor(coord / (TILE_WIDTH * PIXEL_ART_RATIO));
}

export function showFadeOverlay() {
    /**
     * overlays screen with fading effect of black color, starting at middle and moving to the corners
     */
    const overlay = document.querySelector('.fade-overlay');
    let radius = 0;
    const maxRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    overlay.style.opacity = '1';
    
    function animateOverlay() {
        radius += 15;
        overlay.style.clipPath = `circle(${radius}px at 50% 50%)`;
        
        if (radius < maxRadius) {
            requestAnimationFrame(animateOverlay);
        }
    }
    
    animateOverlay();
}

export function hideFadeOverlay() {
    /**
     * hides overlay
     */
    const overlay = document.querySelector('.fade-overlay');
    if (overlay) {
        overlay.style.clipPath = 'circle(0px at 50% 50%)';
        overlay.style.opacity = '0';
    }
}