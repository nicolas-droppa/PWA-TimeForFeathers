import { Player } from './playerMovement.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pixelArtRatio = 3;

canvas.width = 500;
canvas.height = 500;

const player = new Player(50, 50, 5, canvas);

function gameLoop() {
    player.update();
    requestAnimationFrame(gameLoop);
}

gameLoop();

/*
const tileWidth = 32 * pixelArtRatio;
const tileHeight = 32 * pixelArtRatio;

const grassImage = new Image();
grassImage.src = '../images/assets/ground/grass.png';

grassImage.onload = () => {
    fetch('../levels.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const level = data.levels[0];
            const tileMap = level.tileMap;

            for (let row = 0; row < tileMap.length; row++) {
                for (let col = 0; col < tileMap[row].length; col++) {
                    if (tileMap[row][col] === 0) {
                        const x = col * tileWidth;
                        const y = row * tileHeight;

                        ctx.drawImage(grassImage, x, y, tileWidth, tileHeight);
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error loading levels.json:', error);
        });
};
*/