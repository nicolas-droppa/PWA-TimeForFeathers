import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO, CANVAS_WIDTH, CANVAS_HEIGHT } from './_constants.js';
import { Player } from './playerMovement.js';
import { Chicken } from './chickenAI.js';
import { Timer } from './timer.js';
import { loadTiles } from './tileRenderer.js';

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const playerCanvas = document.getElementById('playerLayer');
    const chickenCanvas = document.getElementById('chickenLayer');
    const timeContainer = document.getElementById('timer');

    console.log(playerCanvas);
    console.log(chickenCanvas);

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    playerCanvas.width = CANVAS_WIDTH;
    playerCanvas.height = CANVAS_HEIGHT;
    chickenCanvas.width = CANVAS_WIDTH;
    chickenCanvas.height = CANVAS_HEIGHT;
    const tileWidth = TILE_WIDTH * PIXEL_ART_RATIO;
    const tileHeight = TILE_HEIGHT * PIXEL_ART_RATIO;

    const player = new Player(3, 3, 8, playerCanvas, '../levels.json');
    const chicken = new Chicken(0, 0, 1, chickenCanvas, [[0, 0], [0, 3], [2, 3], [2, 0]], TILE_WIDTH * PIXEL_ART_RATIO);
    const timer = new Timer();

    const grassImage = new Image();
    grassImage.src = '../images/assets/ground/grass.png';

    grassImage.onload = () => {
        // Load the level and render tiles
        loadTiles('../levels.json', tileWidth, tileHeight, ctx, grassImage);
        // Start the game loop
        gameLoop();
    };

    function gameLoop() {
        timer.display(timeContainer);
        player.update();
        if (!chicken.eaten)
            chicken.update(player.x, player.y, player.size);
        requestAnimationFrame(gameLoop);
    }
};