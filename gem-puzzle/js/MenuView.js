export default class MenuView {
    constructor() {

    }

    init() {
        this.renderMenuToDom();
    }


    changeActiveMenu(menu) {
        const gameMenu = document.querySelector('.menu');
        gameMenu.childNodes.forEach(item => {
            item.classList.remove('menu_active');
            item.classList.add('menu_hidden');
        });

        const menuElement = document.querySelector(menu);
        menuElement.classList.toggle('menu_active');
        menuElement.classList.toggle('menu_hidden');
    }

    generateGoBackButton() {
        let goBackButton = document.createElement('button');
        goBackButton.innerText = 'go back';

        goBackButton.addEventListener('click', () => {
            this.changeActiveMenu('.menu__list');
        });

        return goBackButton;
    }


    generateMenuView() {
        let menu = document.createElement('div');
        menu.classList.add('menu');
        
        return menu;
    }

    generateMenuListView() {
        const menuList = document.createElement('ul');
        menuList.classList.add('menu__list', 'menu_active');
        menuList.innerHTML = `<li id="save">Save Game</li>
                                <li id="new-game">New Game</li>
                                <li id="saved-games">Saved Games</li>
                                <li id="settings">Settings</li>`;
        return menuList;
    }


    generateSavedGamesView() {
        const menuSavedGames = document.createElement('div');
        menuSavedGames.classList.add('menu__saved-games', 'menu_hidden');
        
        return menuSavedGames;
    }

    updateSavedGamesView(savedGames) {
        const menuSavedGames = document.querySelector('.menu__saved-games');
        let savedGamesList = '';
        savedGames.forEach(game => {
            savedGamesList += `<div>${this.generateSavedGameView(game)}</div>`;
        });
        menuSavedGames.innerHTML = `${savedGamesList}`;
        menuSavedGames.append(this.generateGoBackButton());
    }

    generateSavedGameView(game) {
        let savedGame = `<span>Field size: </span>${JSON.parse(game.field).length}x${JSON.parse(game.field).length}</span><br>
                                <span>${game.field}</span><br>
                                <span>Time: </span><span>${game.time}</span><br>
                                <span>Moves: </span><span>${game.moves}</span><br>
                                <button class="menu__button-load" id="${game.id}">Load game</button>`;
        return savedGame;
    }

    generateWinView() {
        let win = document.createElement('div');
        win.classList.add('menu__win', 'menu_hidden');
        return win;
    }

    updateWinView(winTime='', winMoves='') {
        const win = document.querySelector('.menu__win');
        win.innerHTML = `<div>Hurray! You solved the puzzle for<br><span>${winTime}</span> and <span>${winMoves}</span> moves</div>`;
        win.append(this.generateGoBackButton());
    }

    generateSettingsView() {
        let settings = document.createElement('div');
        settings.classList.add('menu__settings', 'menu_hidden');
        settings.innerHTML = `<label for="field-size">Choose field size:</label>
                                <select name="field-size" id="field-size">
                                    <option value="3">3х3</option>
                                    <option value="4">4х4</option>
                                    <option value="5">5х5</option>
                                    <option value="6">6х6</option>
                                    <option value="7">7х7</option>
                                    <option value="8">8х8</option>
                                </select><br>`;
        settings.append(this.generateGoBackButton());

        return settings;
    }

    renderMenuToDom(menuList, menuSavedGames, win, menuSettings) {
        const gameField = document.querySelector('.game-field');
        const menu = this.generateMenuView();

        menu.append(menuList);
        menu.append(menuSavedGames);
        menu.append(win);
        menu.append(menuSettings);

        gameField.append(menu);
    }
}