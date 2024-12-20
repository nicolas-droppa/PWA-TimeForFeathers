import { CANVAS_WIDTH, CANVAS_HEIGHT } from './_constants.js';
import { Player } from './playerMovement.js';
import { Chicken } from './chickenAI.js';
import { Timer } from './timer.js';

/*
 * Initializes the canvas elements and sets their dimensions
 * canvasIds : Ids of every canvas
 */
export function initializeCanvases(canvasIds) {
    const canvases = {};
    canvasIds.forEach((id) => {
        const canvas = document.getElementById(id);
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvases[id] = canvas;
    });
    return canvases;
}

/*
 * Fetches level data from the specified file
 * levelDataPath : path to levels.json
 */
export function fetchLevelData(levelDataPath) {
    return fetch(levelDataPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error loading levels.json:', error);
            return null;
        });
}

/*
 * Spawns entities based on the fetched level data
 * canvases : all the canvases for every needed layer
 * levelDataPath : path to levels.json
 */
export async function loadEntities(canvases, levelDataPath) {
    const levelData = await fetchLevelData(levelDataPath);

    if (!levelData) {
        console.error('Failed to load level data. Entities cannot be spawned.');
        return null;
    }

    const level = levelData.levels[0];
    const tileMap = level.tileMap;

    const player = new Player(3, 3, 8, canvases.playerLayer, levelDataPath);
    const chicken = new Chicken(0, 0, 1, canvases.chickenLayer, [[0, 0], [0, 3], [2, 3], [2, 0]]);
    const chicken2 = new Chicken(0, 3, 1, canvases.chickenLayer, [[0, 0], [0, 3], [2, 3], [2, 0]]);
    const timer = new Timer();

    return { player, chicken, chicken2, timer };
}