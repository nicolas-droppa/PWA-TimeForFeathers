import { TILE_WIDTH, TILE_HEIGHT, PIXEL_ART_RATIO, CANVAS_WIDTH, CANVAS_HEIGHT } from './_constants.js';
import { Player } from './playerMovement.js';
import { loadTiles } from './tileRenderer.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerCanvas = document.getElementById('playerLayer');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
playerCanvas.width = CANVAS_WIDTH;
playerCanvas.height = CANVAS_HEIGHT;
const tileWidth = TILE_WIDTH * PIXEL_ART_RATIO;
const tileHeight = TILE_HEIGHT * PIXEL_ART_RATIO;

const player = new Player(50, 50, 5, playerCanvas, '../levels.json');

const grassImage = new Image();
grassImage.src = '../images/assets/ground/grass.png';

grassImage.onload = () => {
    // Load the level and render tiles
    loadTiles('../levels.json', tileWidth, tileHeight, ctx, grassImage);
    // Start the game loop
    gameLoop();
};

function gameLoop() {
    player.update();
    requestAnimationFrame(gameLoop);
}