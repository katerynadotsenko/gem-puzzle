export default class TileView {
    constructor(size, tilesArr) {
        this.size = size;
        this.tilesArr = tilesArr;
        this.tile = '';
    }

    generateTile(left, top) {
        const value = this.tilesArr[top][left];

        this.tile = document.createElement('div');
        this.tile.classList.add('tile', `${!value ? 'tile_empty' : 'tile_number'}`);
        this.tile.draggable = true;
        this.tile.style.width = `${this.size}px`;
        this.tile.style.height = `${this.size}px`;
        this.tile.style.top = `${top * this.size}px`;
        this.tile.style.left = `${left * this.size}px`;

        if (value !== 0) {
            this.tile.textContent = value;
        }

        this.tile.dataset.key = value;
        this.tile.dataset.top = top;
        this.tile.dataset.left = left;

        return this.tile;
    }
}