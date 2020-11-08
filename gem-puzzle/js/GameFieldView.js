import InfoFieldView from './InfoFieldView.js';

export default class GameFieldView {
    constructor() {
        this.gameField = '';
    }

    init(fieldSize) {

        const infoFieldView = new InfoFieldView(fieldSize);
        infoFieldView.init();

        const gameContainer = document.querySelector('.game-container');
        gameContainer.insertBefore(this.generateGameField(fieldSize),gameContainer.childNodes[1]);
        
    }

    generateGameField(fieldSize) {
        this.gameField = document.createElement('div');
        this.gameField.classList.add('game-field');
        this.gameField.style.width = `${fieldSize}px`;
        this.gameField.style.height = `${fieldSize}px`;

        const gameFieldWithBorder = document.createElement('div');
        gameFieldWithBorder.classList.add('game-field-with-border');
        gameFieldWithBorder.style.width = `${fieldSize + 60}px`;
        gameFieldWithBorder.style.height = `${fieldSize + 60}px`;

        gameFieldWithBorder.append(this.gameField);

        return gameFieldWithBorder;
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