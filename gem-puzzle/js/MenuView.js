export default class MenuView {
    constructor(gameField) {
        this.gameField = gameField;
    }

    init() {
        this.renderMenuToDom();
    }

    generateMenuView() {
        let menu = document.createElement('div');
        menu.classList.add('menu');
        menu.innerHTML = `<ul class="menu__list menu_active">
                                <li id="save">Save Game</li>
                                <li id="new-game">New Game</li>
                                <li id="saved-games">Saved Games</li>
                                <li id="settings">Settings</li>
                              </ul>`;
        return menu;
    }

    generateSaveGamesView() {
        let savedGames = document.createElement('div');
        savedGames.classList.add('menu__saved-games', 'menu_hidden');
        savedGames.innerHTML = `saved games`;
        return savedGames;
    }

    generateWinView() {
        let win = document.createElement('div');
        win.classList.add('menu__win', 'menu_hidden');
        win.innerHTML = `<div>Hurray! You solved the puzzle for<br><span class="win__time"></span> and <span class="win__moves"></span> moves</div>`;
        return win;
    }

    renderMenuToDom() {
        let menu = this.generateMenuView();
        menu.append(this.generateSaveGamesView());
        menu.append(this.generateWinView());
        this.gameField.append(menu);
    }
}