export default class MenuView {
    constructor(soundTick) {
        this.soundTick = soundTick;
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
            this.soundTick();
            this.changeActiveMenu('.menu__list');
        });

        return goBackButton;
    }

    generateSavedGameNotification() {
        const notification = document.createElement('div');
        notification.classList.add('menu__notification', 'hide');
        notification.innerText = "The game was successfully saved!";
        
        return notification;
    }

    showSavedGameNotification() {
        const notification = document.querySelector('.menu__notification');
        notification.classList.remove('hide');

        setTimeout(() => {
            notification.classList.add('hide');
        }, 2500);

        const saveMenuItem = document.getElementById('save');
        saveMenuItem.classList.add('disabled');
    }


    generateMenuView() {
        let menu = document.createElement('div');
        menu.classList.add('menu');
        
        return menu;
    }

    generateMenuListView() {
        const menuList = document.createElement('ul');
        menuList.classList.add('menu__list', 'menu_active');
        menuList.append(this.generateSavedGameNotification());
        menuList.innerHTML += `<li id="save">Save Game</li>
                                <li id="new-game">New Game</li>
                                <li id="saved-games">Saved Games</li>
                                <li id="best-scores">Best scores</li>
                                <li id="settings">Settings</li>
                                <li id="autocomplete">Autocomplete Game</li>`;
        return menuList;
    }


    generateSavedGamesView() {
        const menuSavedGames = document.createElement('div');
        menuSavedGames.classList.add('saved-games', 'menu_hidden');

        menuSavedGames.innerHTML = `<div class="saved-games__header">
                                        <div class="carousel__arrow carousel__arrow_left">
                                            <span class="material-icons">arrow_back_ios</span>
                                        </div>
                                        <h2>Saved games</h2>
                                        <div class="carousel__arrow carousel__arrow_right">
                                            <span class="material-icons">arrow_forward_ios</span>
                                        </div>
                                    </div>
                                    <div class="carousel"></div>`

        const notification = document.createElement('div');
        notification.classList.add('saved-games__notification');
        notification.innerText = 'You don\'t have any saved games yet';
        
        menuSavedGames.append(notification);
        menuSavedGames.append(this.generateGoBackButton());
        
        return menuSavedGames;
    }

    updateSavedGamesView(savedGames, notification=false) {
        let savedGamesList = '';
        const leftArrowButton = document.querySelector('.carousel__arrow_left');
        const rightArrowButton = document.querySelector('.carousel__arrow_right');

        if (notification) {
            const notification = document.querySelector('.saved-games__notification');
            notification.style.display = 'block';

            leftArrowButton.style.display = 'none';
            rightArrowButton.style.display = 'none';
  
        } else {
            const notification = document.querySelector('.saved-games__notification');

            notification.style.display = 'none';

            const savedGamesCarousel = document.querySelector('.carousel');
            savedGamesCarousel.style.left = '0';
            savedGamesCarousel.style.width = `${savedGames.length * 100}%`;
            
            savedGames.forEach(game => {
                savedGamesList += `<div class="carousel__item">${this.generateSavedGameView(game)}</div>`;
            });

            savedGamesCarousel.innerHTML = `${savedGamesList}`;
        }
    }

    generateSavedGameView(game) {
        let savedGameField = '';

        if (game.imgNum) {
            savedGameField = `<img width='120px' src='assets/images/${game.imgNum}.jpg'>`;
        } else {
            JSON.parse(game.field).forEach((arr, i) => {
                let row = '';
                arr.forEach(num => {
                    row += `<div class="carousel__field__row-item">${num}</div>`;
                });
                savedGameField += `<div class="carousel__field__row">${row}</div>`;
            });
        }

        let savedGame = `<div class="carousel__field">${savedGameField}</div>
                            <div class="carousel__info">
                                <div><span>Field size: </span>${JSON.parse(game.field).length}x${JSON.parse(game.field).length}</span></div>
                                <div><span>Time:</span> <span>${game.time}</span></div>
                                <div>Moves:</span> <span>${game.moves}</span></div>
                                <button class="menu__button-load" id="${game.id}">Load game</button>
                            </div>`;
        return savedGame;
    }

    generateBestScoresView() {
        const bestScores = document.createElement('div');
        bestScores.classList.add('menu__best-scores', 'menu_hidden');
        bestScores.innerHTML = `<h2>Best Scores</h2>`;
        bestScores.append(this.generateGoBackButton());
        return bestScores;
    }

    updateBestScoresView(bestScores) {
        let bestScoresDOM = document.querySelector('.best-scores');
        if (bestScoresDOM) {
            bestScoresDOM.remove();
        }
        document.querySelector('.menu__best-scores').append(this.generateBestScoresList());
        if (bestScores) {
            bestScoresDOM = document.querySelector('.best-scores');
            bestScores.forEach(bestScore => {
                this.generateBestScoreItemView(bestScore).forEach((item, i) => {
                    bestScoresDOM.children[i].append(item);
                });
            });
        }
    }

    generateBestScoresList() {
        const bestScoresList = document.createElement('div');
        bestScoresList.classList.add('best-scores');
        bestScoresList.innerHTML = `<div class="best-scores__date">
                                            <div class="best-scores__title">Date</div>
                                    </div>
                                    <div class="best-scores__moves">
                                        <div class="best-scores__title">Moves</div>
                                    </div>
                                    <div class="best-scores__size">
                                        <div class="best-scores__title">Size</div>
                                    </div>
                                    <div class="best-scores__time">
                                        <div class="best-scores__title">Time</div>
                                    </div>`;
        return bestScoresList;
    }

    generateBestScoreItemView(item) {
        const bestScoresDate = document.createElement('div');
        bestScoresDate.classList.add('best-scores__item');
        bestScoresDate.innerText = `${item.date}`;

        const bestScoresMoves = document.createElement('div');
        bestScoresMoves.classList.add('best-scores__item');
        bestScoresMoves.innerText = `${item.moves}`;

        const bestScoresSize = document.createElement('div');
        bestScoresSize.classList.add('best-scores__item');
        bestScoresSize.innerText = `${item.size}`;

        const bestScoresTime = document.createElement('div');
        bestScoresTime.classList.add('best-scores__item');
        bestScoresTime.innerText = `${item.time}`;

        return new Array(bestScoresDate, bestScoresMoves, bestScoresSize, bestScoresTime);
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
        settings.classList.add('settings', 'menu_hidden');
        
        settings.innerHTML = `<div class="settings__container">
                                    <div class="settings__size">
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
                                    </div>
                                    <span class="material-icons settings__sound">
                                        volume_up
                                    </span>
                                </div>`;
        settings.append(this.generateGoBackButton());

        return settings;
    }

    renderMenuToDom(menuList, menuSavedGames, menuBestScores, win, menuSettings) {
        const gameFieldWithBorder = document.querySelector('.game-field-with-border');
        const menu = this.generateMenuView();

        menu.append(menuList);
        menu.append(menuSavedGames);
        menu.append(menuBestScores);
        menu.append(win);
        menu.append(menuSettings);

        gameFieldWithBorder.append(menu);
    }
}