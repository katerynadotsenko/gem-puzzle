import TileView from './TileView.js';
import InfoFieldView from './InfoFieldView.js';

export default class GameFieldView {
    constructor() {
        this.gameField = '';
    }

    init(fieldSize) {

        const infoFieldView = new InfoFieldView(fieldSize);
        infoFieldView.init();

        document.body.insertBefore(this.generateGameField(fieldSize), document.body.childNodes[1]);
        
    }

    generateGameField(fieldSize) {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${fieldSize}px`;
        this.gameField.style.height = `${fieldSize}px`;

        return this.gameField;
    }

    /*changeFieldSize(fieldSize) {
        this.gameField.style.width = `${fieldSize}px`;
        this.gameField.style.height = `${fieldSize}px`;
    }*/

    clearGameField() {
        this.gameField.querySelectorAll('[data-key]').forEach(item => {
            item.remove();
        });
    }
}