import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO } from '../_constants/_constants.js';
import { loadTiles } from '../rendering/tileRenderer.js';
import { initializeCanvases, loadEntities } from './entitySpawner.js';
import { DeltaTime } from './deltaTime.js';
import { GameManager } from './gameManager.js';
import { getCurrentLevel, resetGameData } from '../_system/storageSystem.js';

const gameManager = new GameManager({
    gameContainerId: 'gameContainer',
    menuId: 'menu',
    eventTableId: 'eventTable'
});

window.onload = () => {
    resetGameData();
    gameManager.initialize();
};

export async function startGame() {
    const canvasIds = ['gameCanvas', 'playerLayer', 'chickenLayer', 'dogLayer'];
    const tileWidth = TILE_WIDTH * PIXEL_ART_RATIO;
    const tileHeight = TILE_HEIGHT * PIXEL_ART_RATIO;

    const canvases = initializeCanvases(canvasIds);
    const ctx = canvases.gameCanvas.getContext('2d');
    const timeContainer = document.getElementById('timer');

    const grassImage = new Image();
    grassImage.src = '../../assets/images/tileMap/grass.png';

    let entities = null;

    const deltaTimeCalculator = new DeltaTime();

    grassImage.onload = async () => {
        entities = await loadEntities(canvases, '../../assets/levels/levels.json', gameManager.currentLevel);
    
        loadTiles('../../assets/levels/levels.json', gameManager.currentLevel, tileWidth, tileHeight, ctx, grassImage);
    
        gameLoop(entities, timeContainer, deltaTimeCalculator);
    };

    function gameLoop({ player, chickens, dogs, timer }, timeContainer, deltaTimeCalculator) {
        const deltaTime = deltaTimeCalculator.getDeltaTime();

        timer.display(timeContainer);
        player.update(deltaTime);
        chickens.forEach((chicken) => {
            if (!chicken.eaten) 
                chicken.update(player.x, player.y, player.size, timer, deltaTime);
        });
        dogs.forEach((dog) => {
            dog.update(player.x, player.y, player.size, deltaTime);
        });

        if (chickens.every(chicken => chicken.eaten)) {
            gameManager.levelCompleted();   
            return;
        }

        requestAnimationFrame(() => gameLoop({ player, chickens, dogs, timer }, timeContainer, deltaTimeCalculator));
    }
}