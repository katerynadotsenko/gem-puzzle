import TileView from './TileView.js';

export default class GameFieldView {
    constructor(gameFieldRowQuantity, tilesSize) {
        this.gameFieldRowQuantity = gameFieldRowQuantity;
        this.tilesSize = tilesSize;
        this.gameFieldSize = this.tilesSize * this.gameFieldRowQuantity;
        this.gameField = '';
    }

    init(tilesArr) {
        document.body.insertBefore(this.generateGameField(), document.body.childNodes[0]);
        this.renderTilesToGameField(tilesArr);
    }

    generateGameField() {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${this.gameFieldSize}px`;
        this.gameField.style.height = `${this.gameFieldSize}px`;

        return this.gameField;
    }

    renderTilesToGameField(tilesArr) {
        const tileView = new TileView(this.tilesSize);

        for (let i = 0; i < this.gameFieldRowQuantity; i++) {
            for (let j = 0; j < this.gameFieldRowQuantity; j++) {
                this.gameField.append(tileView.generateTile(this.tilesSize * i, this.tilesSize * j, tilesArr[i][j]));
            }
        }
    }
}