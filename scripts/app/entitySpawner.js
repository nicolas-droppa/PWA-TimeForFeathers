import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../_constants/_constants.js';
import { Player } from '../entities/player.js';
import { Chicken } from '../entities/chicken.js';
import { Dog } from '../entities/dog.js';
import { Timer } from './timer.js';

export function initializeCanvases(canvasIds) {
    /*
     * Initializes the canvas elements and sets their dimensions
     * @param canvasIds : Ids of every canvas
     * @returns : all the canvases
     */
    const canvases = {};
    canvasIds.forEach((id) => {
        const canvas = document.getElementById(id);
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvases[id] = canvas;
    });
    return canvases;
}

export async function fetchLevelData(levelDataPath) {
    /*
     * Fetches level data from the specified file
     * @param levelDataPath : path to levels.json
     * @returns : fetched data
     */
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

export async function loadEntities(canvases, levelDataPath, currentLevel) {
    /*
     * Spawns entities based on the fetched level data
     * @param canvases : all the canvases for every needed layer
     * @param levelDataPath : path to levels.json
     * @returns : all the entities
     */
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
            dogConfig.path.map((p) => [p.x, p.y]),
            levelDataPath,
            currentLevel
        );
    });

    const timer = new Timer();

    return { player, chickens, dogs, timer };
}