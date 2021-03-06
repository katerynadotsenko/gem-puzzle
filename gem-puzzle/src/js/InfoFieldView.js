export default class InfoFieldView {
    constructor(gameFieldSize) {
        this.gameFieldSize = gameFieldSize;
    }

    init() {
        this.generateInfoField();
        this.renderInfoFieldToDom();
    }

    generateInfoField() {
        const infoField = document.createElement('div');
        infoField.classList.add('info');
        infoField.style.width = `${this.gameFieldSize + 60}px`;
        infoField.innerHTML = `<div class="info__time">
                                    <span>Time</span>
                                    <span>00:00:00</span>
                                </div>
                                <div class="info__moves">
                                    <span>Moves</span>
                                    <span>0</span>
                                </div>
                                <button class="info__menu-button">Pause game</button>`;
        return infoField;
    }

    renderInfoFieldToDom(){
        const gameContainer = document.querySelector('.game-container');
        gameContainer.insertBefore(this.generateInfoField(this.gameFieldSize), gameContainer.childNodes[0]);
    }
}