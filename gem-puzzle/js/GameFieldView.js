import TileView from './TileView.js';

export default class GameFieldView {
    constructor(gameFieldRowQuantity, tilesSize, tilesArr) {
        this.gameFieldRowQuantity = gameFieldRowQuantity;
        this.tilesSize = tilesSize;
        this.tilesArr = tilesArr;
        this.gameFieldSize = this.tilesSize * this.gameFieldRowQuantity;
        this.gameField = '';
    }

    init() {
        document.body.insertBefore(this.generateGameField(), document.body.childNodes[0]);
        this.renderTilesToGameField();
    }

    generateGameField() {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${this.gameFieldSize}px`;
        this.gameField.style.height = `${this.gameFieldSize}px`;

        return this.gameField;
    }

    renderTilesToGameField() {
        const tileView = new TileView(this.tilesSize, this.tilesArr);

        for (let i = 0; i < this.gameFieldRowQuantity; i++) {
            for (let j = 0; j < this.gameFieldRowQuantity; j++) {
                this.gameField.append(tileView.generateTile(i, j));
            }
        }
    }
}