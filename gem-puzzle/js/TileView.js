export default class TileView {

    generateTile(tilesSize, value, left, top) {

        this.tile = document.createElement('div');
        this.tile.classList.add('tile', `${!value ? 'tile_empty' : 'tile_number'}`);
        //this.tile.draggable = true;
        this.tile.style.width = `${tilesSize}px`;
        this.tile.style.height = `${tilesSize}px`;
        this.tile.style.top = `${top * tilesSize}px`;
        this.tile.style.left = `${left * tilesSize}px`;

        if (value !== 0) {
            this.tile.textContent = value;
        }

        this.tile.dataset.key = value;
        this.tile.dataset.top = top;
        this.tile.dataset.left = left;

        return this.tile;
    }

    renderTilesToDom(gameFieldRowQuantity, tilesArr, tilesSize) {
        const gameField = document.querySelector('.game-field');
        for (let i = 0; i < gameFieldRowQuantity; i++) {
            for (let j = 0; j < gameFieldRowQuantity; j++) {
                gameField.append(this.generateTile(tilesSize, tilesArr[j][i], i, j));
            }
        }
    }
}