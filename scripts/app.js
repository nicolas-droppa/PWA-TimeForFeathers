import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO, CANVAS_WIDTH, CANVAS_HEIGHT } from './_constants.js';
import { loadTiles } from './tileRenderer.js';
import { initializeCanvases, loadEntities } from './entitySpawner.js';

window.onload = async () => {
    const canvasIds = ['gameCanvas', 'playerLayer', 'chickenLayer'];
    const tileWidth = TILE_WIDTH * PIXEL_ART_RATIO;
    const tileHeight = TILE_HEIGHT * PIXEL_ART_RATIO;

    const canvases = initializeCanvases(canvasIds);
    const ctx = canvases.gameCanvas.getContext('2d');
    const timeContainer = document.getElementById('timer');

    const grassImage = new Image();
    grassImage.src = '../images/assets/ground/grass.png';

    let entities = null;

    grassImage.onload = async () => {
        entities = await loadEntities(canvases, TILE_WIDTH * PIXEL_ART_RATIO, '../levels.json');

        loadTiles('../levels.json', tileWidth, tileHeight, ctx, grassImage);

        gameLoop(entities, timeContainer);
    };

    function gameLoop({ player, chicken, chicken2, timer }, timeContainer) {
        timer.display(timeContainer);
        player.update();
        if (!chicken.eaten) chicken.update(player.x, player.y, player.size);
        if (!chicken2.eaten) chicken2.update(player.x, player.y, player.size);
        requestAnimationFrame(() => gameLoop({ player, chicken, chicken2, timer }, timeContainer));
    }
};