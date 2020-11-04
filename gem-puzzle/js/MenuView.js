export default class MenuView {
    constructor(gameField) {
        this.menu = '';
        this.gameField = gameField;
    }

    init() {
        this.generateMenuView();
        this.renderMenuToDom();
    }

    generateMenuView() {
        this.menu = document.createElement('div');
        this.menu.classList.add('menu');
        this.menu.innerHTML = `<ul class="menu__list">
                                <li id="save">Save Game</li>
                                <li id="new-game">New Game</li>
                                <li id="saved-games">Saved Games</li>
                                <li id="settings">Settings</li>
                              </ul>`;
        return this.menu;
    }

    renderMenuToDom() {
        this.gameField.append(this.menu);
    }
}