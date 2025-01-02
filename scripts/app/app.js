import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO } from '../_constants/_constants.js';
import { loadTiles } from '../rendering/tileRenderer.js';
import { initializeCanvases, loadEntities } from './entitySpawner.js';
import { DeltaTime } from './deltaTime.js';
import { GameManager } from './gameManager.js';

const gameManager = new GameManager({
    gameContainerId: 'gameContainer',
    menuId: 'menu',
    eventTableId: 'eventTable'
});

window.onload = () => {
    //resetGameData();
    gameManager.initialize();
};

export async function startGame() {
    const canvasIds = ['gameCanvas', 'playerLayer', 'chickenLayer', 'dogLayer', 'farmerLayer', 'itemLayer', 'bulletLayer'];
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

    function gameLoop({ player, chickens, fastChickens, dogs, farmers, boots, timer }, timeContainer, deltaTimeCalculator) {
        const deltaTime = deltaTimeCalculator.getDeltaTime();

        timer.display(timeContainer);
        
        player.update({ dogs }, { farmers }, { boots }, timer, deltaTime);

        chickens.forEach((chicken) => {
            if (!chicken.eaten) 
                chicken.update(player.x, player.y, player.size, timer, deltaTime);
        });

        fastChickens.forEach((fastChicken) => {
            if (!fastChicken.eaten) 
                fastChicken.update(player.x, player.y, player.size, timer, deltaTime);
        });

        dogs.forEach((dog) => {
            dog.update(player.x, player.y, player.size, deltaTime);
        });

        farmers.forEach((farmer) => {
            farmer.update(player.x, player.y, player.size, deltaTime);
        });

        boots.forEach((item) => {
            if (!item.pickedUp)
                item.update(player.x, player.y, player.size, timer);
        });

        if (chickens.every(chicken => chicken.eaten) && fastChickens.every(fastChicken => fastChicken.eaten)) {
            gameManager.levelCompleted();   
            return;
        }

        if (player.dead) {
            gameManager.levelFailed();
            return;
        }

        requestAnimationFrame(() => gameLoop({ player, chickens, fastChickens, dogs, farmers, boots, timer }, timeContainer, deltaTimeCalculator));
    }
}