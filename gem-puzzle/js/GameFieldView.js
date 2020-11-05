import TileView from './TileView.js';
import InfoFieldView from './InfoFieldView.js';
import MenuView from './MenuView.js';

export default class GameFieldView {
    constructor(gameFieldRowQuantity, tilesSize) {
        this.gameFieldRowQuantity = gameFieldRowQuantity;
        this.tilesSize = tilesSize;
        this.gameFieldSize = this.tilesSize * this.gameFieldRowQuantity;
        this.gameField = '';
    }

    init() {
        const infoFieldView = new InfoFieldView(this.gameFieldSize);
        infoFieldView.init();

        document.body.insertBefore(this.generateGameField(), document.body.childNodes[1]);
        
        //const menuView = new MenuView(this.gameField);
        //menuView.init();
    }

    generateGameField() {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${this.gameFieldSize}px`;
        this.gameField.style.height = `${this.gameFieldSize}px`;

        return this.gameField;
    }

    clearGameField() {
        //const menu = document.querySelector('.menu');
        this.gameField.querySelectorAll('[data-key]').forEach(item => {
            item.remove();
        });
    }

    renderTilesToGameField(tilesArr) {
        const tileView = new TileView(this.tilesSize, tilesArr);

        for (let i = 0; i < this.gameFieldRowQuantity; i++) {
            for (let j = 0; j < this.gameFieldRowQuantity; j++) {
                this.gameField.append(tileView.generateTile(i, j));
            }
        }
    }
}