export default class TileView {
    constructor(size) {
        this.size = size;
    }

    generateTile(posX, posY) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${this.size}px`;
        tile.style.height = `${this.size}px`;
        tile.style.top = `${posX}px`;
        tile.style.left = `${posY}px`;

        return tile;
    }
}