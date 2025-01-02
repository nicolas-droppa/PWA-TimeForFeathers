export function renderTiles(ctx, grassImage, tileMap, tileWidth, tileHeight) {
    /**
    * Loops through the tileMap and renders the tiles onto the provided canvas context.
    * @param { CanvasRenderingContext2D } ctx : context of canvas
    * @param { string } grassImage : Path to image
    * @param { array } tileMap : Tile-Map used for specific level
    * @param { number } tileWidth : ...
    * @param { number } tileHeight : ...
    */
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            if (tileMap[row][col] == 0) {
                const x = col * tileWidth;
                const y = row * tileHeight;

                ctx.drawImage(grassImage, x, y, tileWidth, tileHeight);
            }
        }
    }
}

export function loadTiles(levelData, currentLevel, tileWidth, tileHeight, ctx, grassImage) {
    /**
    * Fetches level data.
    * Loads the tiles and renders them.
    * @param { string } levelData : Path to stored levels
    * @param { number } tileWidth : ...
    * @param { number } tileHeight : ...
    * @param { CanvasRenderingContext2D } ctx : context of canvas
    * @param { string } grassImage : Path to image 
    */
    fetch(levelData)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const level = data.levels[currentLevel];
            const tileMap = level.tileMap;
            renderTiles(ctx, grassImage, tileMap, tileWidth, tileHeight);
        })
        .catch((error) => {
            console.error('Error loading levels.json:', error);
        });
}