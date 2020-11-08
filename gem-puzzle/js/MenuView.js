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
        goBackButton.classList.add('menu__go-back-button')
        goBackButton.innerText = 'go back';

        goBackButton.addEventListener('click', () => {
            const sound = document.querySelector(`audio[data-sound="tick`);
            sound.currentTime = 0;
            sound.play();
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
                                <li id="settings">Settings</li>
                                <li id="autocomplete">Autocomplete Game</li>`;
        return menuList;
    }


    generateSavedGamesView() {
        const menuSavedGames = document.createElement('div');
        menuSavedGames.classList.add('menu__saved-games', 'menu_hidden');

        const savedGamesCarousel = document.createElement('div');
        savedGamesCarousel.classList.add('saved-games__carousel');

        const leftArrowButton = document.createElement('button');
        leftArrowButton.classList.add('carousel__left-arrow-button');
        leftArrowButton.innerText = 'prev';

        const rightArrowButton = document.createElement('button');
        rightArrowButton.classList.add('carousel__right-arrow-button');
        rightArrowButton.innerText = 'next';

        const notification = document.createElement('div');
        notification.classList.add('saved-games__notification');
        notification.innerText = 'You don\'t have any saved games yet';
        
        menuSavedGames.append(savedGamesCarousel);
        menuSavedGames.append(leftArrowButton);
        menuSavedGames.append(rightArrowButton);
        menuSavedGames.append(notification);
        menuSavedGames.append(this.generateGoBackButton());
        
        return menuSavedGames;
    }

    updateSavedGamesView(savedGames, notification=false) {
        let savedGamesList = '';
        const leftArrowButton = document.querySelector('.carousel__left-arrow-button');
        const rightArrowButton = document.querySelector('.carousel__right-arrow-button');

        if (notification) {
            const notification = document.querySelector('.saved-games__notification');
            notification.style.display = 'block';

            leftArrowButton.style.display = 'none';
            rightArrowButton.style.display = 'none';
  
        } else {
            const notification = document.querySelector('.saved-games__notification');

            notification.style.display = 'none';

            leftArrowButton.style.display = 'inline-block';
            rightArrowButton.style.display = 'inline-block';

            const savedGamesCarousel = document.querySelector('.saved-games__carousel');
            savedGamesCarousel.style.width = `${savedGames.length * 100}%`;
            
            savedGames.forEach(game => {
                savedGamesList += `<div class="carousel__item">${this.generateSavedGameView(game)}</div>`;
            });

            savedGamesCarousel.innerHTML = `${savedGamesList}`;
        }
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
        
        settings.innerHTML = `<div class="settings__size">
                                <label for="field-size">Choose the field size:</label>
                                    <select name="field-size" id="field-size">
                                        <option value="3">3х3</option>
                                        <option selected="selected" value="4">4х4</option>
                                        <option value="5">5х5</option>
                                        <option value="6">6х6</option>
                                        <option value="7">7х7</option>
                                        <option value="8">8х8</option>
                                    </select>
                                </div>
                                <div class="settings__mode">
                                    <label for="mode">Set the game mode:</label>
                                    <select name="mode" id="mode">
                                        <option selected="selected" value="no">numbers</option>
                                        <option value="yes">image</option>
                                    </select>
                                </div>`;
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