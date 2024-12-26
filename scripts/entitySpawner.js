import { CANVAS_WIDTH, CANVAS_HEIGHT } from './_constants.js';
import { Player } from './playerMovement.js';
import { Chicken } from './chickenAI.js';
import { Dog } from './dogAI.js';
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
export async function fetchLevelData(levelDataPath) {
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
export async function loadEntities(canvases, levelDataPath, currentLevel) {
    const levelData = await fetchLevelData(levelDataPath);

    if (!levelData) {
        console.error('Failed to load level data. Entities cannot be spawned.');
        return null;
    }

    const level = levelData.levels[currentLevel];

    const playerConfig = level.fox;
    const player = new Player(
        playerConfig.spawn.x,
        playerConfig.spawn.y,
        playerConfig.speed,
        canvases.playerLayer,
        levelDataPath,
        currentLevel
    );

    const chickens = level.chickens.map((chickenConfig) => {
        return new Chicken(
            chickenConfig.spawn.x,
            chickenConfig.spawn.y,
            chickenConfig.speed,
            canvases.chickenLayer,
            chickenConfig.path.map((p) => [p.x, p.y])
        );
    });

    const dogs = level.dogs.map((dogConfig) => {
        return new Dog(
            dogConfig.spawn.x,
            dogConfig.spawn.y,
            dogConfig.speed,
            canvases.dogLayer,
            dogConfig.path.map((p) => [p.x, p.y])
        );
    });

    const timer = new Timer();

    return { player, chickens, dogs, timer };
}