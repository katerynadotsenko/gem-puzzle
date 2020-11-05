import TileView from './TileView.js';
import InfoFieldView from './InfoFieldView.js';

export default class GameFieldView {
    constructor() {
        this.gameField = '';
    }

    init(gameFieldRowQuantity, tilesSize) {
        const gameFieldSize = tilesSize * gameFieldRowQuantity;

        const infoFieldView = new InfoFieldView(gameFieldSize);
        infoFieldView.init();

        document.body.insertBefore(this.generateGameField(gameFieldSize), document.body.childNodes[1]);
        
    }

    generateGameField(gameFieldSize) {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${gameFieldSize}px`;
        this.gameField.style.height = `${gameFieldSize}px`;

        return this.gameField;
    }

    changeFieldSize(gameFieldRowQuantity, tilesSize) {
        const gameFieldSize = tilesSize * gameFieldRowQuantity;
        this.gameField.style.width = `${gameFieldSize}px`;
        this.gameField.style.height = `${gameFieldSize}px`;
    }

    clearGameField() {
        this.gameField.querySelectorAll('[data-key]').forEach(item => {
            item.remove();
        });
    }
}