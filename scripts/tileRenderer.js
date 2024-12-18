export function renderTiles(ctx, grassImage, tileMap, tileWidth, tileHeight) {
    /*
    Loops through the tileMap and renders the tiles onto the provided canvas context.
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

export function loadTiles(levelData, tileWidth, tileHeight, ctx, grassImage) {
    /*
    Fetches level data.
    Loads the tiles and renders them.
    */
    fetch(levelData)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const level = data.levels[0];
            const tileMap = level.tileMap;
            renderTiles(ctx, grassImage, tileMap, tileWidth, tileHeight);
        })
        .catch((error) => {
            console.error('Error loading levels.json:', error);
        });
}