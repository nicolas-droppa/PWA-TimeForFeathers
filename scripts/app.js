import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO } from './_constants.js';
import { loadTiles } from './tileRenderer.js';
import { initializeCanvases, loadEntities } from './entitySpawner.js';
import { DeltaTime } from './deltaTime.js';
import { GameManager } from './gameManager.js';

const gameManager = new GameManager({
    gameContainerId: 'gameContainer',
    menuId: 'menu',
});

window.onload = () => {
    gameManager.initialize();
};

export async function startGame() {
    const canvasIds = ['gameCanvas', 'playerLayer', 'chickenLayer'];
    const tileWidth = TILE_WIDTH * PIXEL_ART_RATIO;
    const tileHeight = TILE_HEIGHT * PIXEL_ART_RATIO;

    const canvases = initializeCanvases(canvasIds);
    const ctx = canvases.gameCanvas.getContext('2d');
    const timeContainer = document.getElementById('timer');

    const grassImage = new Image();
    grassImage.src = '../images/assets/ground/grass.png';

    let entities = null;

    const deltaTimeCalculator = new DeltaTime();

    grassImage.onload = async () => {
        entities = await loadEntities(canvases, '../levels.json');

        loadTiles('../levels.json', tileWidth, tileHeight, ctx, grassImage);

        gameLoop(entities, timeContainer, deltaTimeCalculator);
    };

    function gameLoop({ player, chickens, timer }, timeContainer, deltaTimeCalculator) {
        const deltaTime = deltaTimeCalculator.getDeltaTime();

        timer.display(timeContainer);
        player.update(deltaTime);
        chickens.forEach((chicken) => {
            if (!chicken.eaten) 
                chicken.update(player.x, player.y, player.size, timer, deltaTime);
        });

        if (chickens.every(chicken => chicken.eaten))
            gameManager.levelCompleted();

        requestAnimationFrame(() => gameLoop({ player, chickens, timer }, timeContainer, deltaTimeCalculator));
    }
}