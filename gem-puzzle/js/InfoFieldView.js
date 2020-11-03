export default class InfoFieldView {
    constructor() {

    }

    generateInfoField(gameFieldSize) {
        const infoField = document.createElement('div');
        infoField.classList.add('info');
        infoField.style.width = `${gameFieldSize}px`;
        infoField.innerHTML = `<div class="info__time">
                                    <span>Time</span>
                                    <span>00:00:00</span>
                                </div>
                                <div class="info__moves">
                                    <span>Moves</span>
                                    <span></span>
                                </div>
                                <div class="info__menu"></div>`;
        return infoField;
    }

    renderInfoFieldToDom(gameFieldSize){
        document.body.insertBefore(this.generateInfoField(gameFieldSize), document.body.childNodes[0]);
    }
}