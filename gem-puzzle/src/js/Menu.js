import Data from './Data.js'
import MenuView from './MenuView.js'

export default class Menu {

    constructor(saveGameCallback, startNewGame, loadSavedGame, changeTilesQuantity, toggleTilesImageBg, toggleMenu, autocompleteGame, toggleSound, soundTick, soundStartGame) {
        this.data = new Data();
        this.startNewGame = startNewGame;
        this.saveGameCallback = saveGameCallback;
        this.toggleTilesImageBg = toggleTilesImageBg;
        this.toggleMenu = toggleMenu;
        this.autocompleteGame = autocompleteGame;
        this.toggleSound = toggleSound;
        this.loadSavedGame = loadSavedGame;
        this.soundTick = soundTick;
        this.soundStartGame =soundStartGame;
        this.changeTilesQuantity = changeTilesQuantity;
        this.menuView = new MenuView(() => this.soundTick());
    }

    saveGame(field, time, moves, imgNum, moveHistory) {
        this.data.saveGame(field, time, moves, imgNum, moveHistory);
        this.menuView.showSavedGameNotification();
    }

    getSavedGames() {
        return this.data.getSavedGames();
    }

    showSavedGames() {
        const savedGames = this.getSavedGames();
        this.menuView.changeActiveMenu('.saved-games');
        if (!savedGames.length) {
            this.menuView.updateSavedGamesView(null, true);
        } else {
            this.menuView.updateSavedGamesView(savedGames);

            //Carousel
            const savedGamesCarousel = document.querySelector('.carousel');
            
            const carouselItem = document.querySelector('.carousel__item');

            const itemsQuantity = savedGames.length;
        
            let activeItem = 0;

            const leftArrowButton = document.querySelector('.carousel__arrow_left');
            const rightArrowButton = document.querySelector('.carousel__arrow_right');

            leftArrowButton.addEventListener('click', () => {
                if (activeItem < 0) {
                    activeItem++;
                    const carouselItemWidth = carouselItem.offsetWidth;
                    savedGamesCarousel.style.left = `${activeItem * carouselItemWidth}px`;
                    this.soundTick();
                }
            });

            rightArrowButton.addEventListener('click', () => {
                if (activeItem > -(itemsQuantity - 1)) {
                    activeItem--;
                    const carouselItemWidth = carouselItem.offsetWidth;
                    savedGamesCarousel.style.left = `${activeItem * carouselItemWidth}px`;
                    this.soundTick();
                }
            });
        }
        
        //Go back button
        const menuButtonsLoad = document.querySelectorAll('.menu__button-load');
        menuButtonsLoad.forEach(button => {
            button.addEventListener('click', () => {
                for (let i = 0; i < savedGames.length; i++) {
                    if (savedGames[i].id == button.id) {
                        this.soundStartGame();
                        this.loadSavedGame(savedGames[i]);
                    }
                }
            });
        });
    }

    showBestScores() {
        this.menuView.changeActiveMenu('.menu__best-scores'); 
    }

    updateBestScores(bestScores) {
        this.menuView.updateBestScoresView(bestScores);
    }

    showWinInfo(winTime, winMoves) {
        this.menuView.updateWinView(winTime, winMoves);
        this.menuView.changeActiveMenu('.menu__win');
    }

    createMenu() {
        const menuList = this.menuView.generateMenuListView();
        menuList.childNodes.forEach(item => {
            this.bindMenuItemListeners(item);
        });

        const menuSavedGames = this.menuView.generateSavedGamesView();
        const menuBestScores = this.menuView.generateBestScoresView();
        const win = this.menuView.generateWinView();
        const menuSettings = this.menuView.generateSettingsView();

        menuSettings.firstChild.children[0].children[1].addEventListener('change', (e) => {
            this.changeTilesQuantity(e.target.value);
            this.startNewGame();
        });

        menuSettings.firstChild.children[1].children[1].addEventListener('change', (e) => {
            this.toggleTilesImageBg(e.target.value === 'yes' ? true : false);
        });

        menuSettings.firstChild.children[2].addEventListener('click', (e) => {
            this.toggleSound();
            if (e.target.innerText == `volume_off`) {
                e.target.innerText = `volume_up`;
            } else {
                e.target.innerText = `volume_off`;
            }
        });

        this.menuView.renderMenuToDom(menuList, menuSavedGames, menuBestScores, win, menuSettings);
    }

    showSettings() {
        this.menuView.changeActiveMenu('.settings');
    }

    changeSettings(gameFieldRowQuantity, isImage) {
        const fieldSize = document.getElementById('field-size');
        fieldSize.selectedIndex = `${gameFieldRowQuantity-3}`;
        const mode = document.getElementById('mode');
        if (isImage) {
            mode.selectedIndex = '1';
        } else {
            mode.selectedIndex = '0';
        }
    }


    bindMenuItemListeners(item) {
        item.addEventListener('click', () => {
            switch (item.id) {
                case 'save':
                    this.soundTick();
                    this.saveGameCallback();
                break;
                case 'new-game':
                    this.soundStartGame();
                    this.startNewGame();
                    this.toggleMenu();
                break;
                case 'saved-games':
                    this.soundTick();
                    this.showSavedGames();
                break;
                case 'best-scores':
                    this.soundTick();
                    this.showBestScores();
                break;
                case 'settings':
                    this.soundTick();
                    this.showSettings();
                break;
                case 'autocomplete':
                    this.soundTick();
                    this.toggleMenu();
                    this.autocompleteGame();
                break;
                default:
                break;
            }
        });
    }
    
}