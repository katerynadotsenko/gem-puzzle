import Data from './Data.js'
import MenuView from './MenuView.js'

export default class Menu {

    MenuView;

    constructor(saveGameCallback, startNewGame, loadSavedGame, changeTilesQuantity) {
        this.data = new Data();
        this.startNewGame = startNewGame;
        this.saveGameCallback = saveGameCallback;
        this.loadSavedGame = loadSavedGame;
        this.changeTilesQuantity = changeTilesQuantity;
        this.menuView = new MenuView();
    }

    saveGame(field, time, moves) {
        this.data.saveGame(field, time, moves)
    }

    getSavedGames() {
        return this.data.getSavedGames();
    }

    showSavedGames() {
        console.log('saved-games');
        const savedGames = this.getSavedGames();
        this.menuView.updateSavedGamesView(savedGames);
        this.menuView.changeActiveMenu('.menu__saved-games');


        //Carousel
        const savedGamesCarousel = document.querySelector('.saved-games__carousel');
        const carouselItem = document.querySelector('.carousel__item');

        const carouselItemWidth = carouselItem.offsetWidth;
        const itemsQuantity = savedGames.length;
       
        let activeItem = 0;

        const leftArrowButton = document.querySelector('.carousel__left-arrow-button');
        const rightArrowButton = document.querySelector('.carousel__right-arrow-button');

        leftArrowButton.addEventListener('click', () => {
            if (activeItem < 0) {
                activeItem++;
                savedGamesCarousel.style.left = `${activeItem * carouselItemWidth}px`;
            }
        });

        rightArrowButton.addEventListener('click', () => {
            if (activeItem > -(itemsQuantity - 1)) {
                activeItem--;
                savedGamesCarousel.style.left = `${activeItem * carouselItemWidth}px`;
            }
        });
        
        //Go back button
        const menuButtonsLoad = document.querySelectorAll('.menu__button-load');
        menuButtonsLoad.forEach(button => {
            button.addEventListener('click', () => {
                for (let i = 0; i < savedGames.length; i++) {
                    if (savedGames[i].id == button.id) {
                        this.loadSavedGame(savedGames[i]);
                    }
                }
            });
        });
    };



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
        const win = this.menuView.generateWinView();
        const menuSettings = this.menuView.generateSettingsView();
        menuSettings.children[1].addEventListener('change', (e) => {
            this.changeTilesQuantity(e.target.value);
            this.startNewGame();
        })

        this.menuView.renderMenuToDom(menuList, menuSavedGames, win, menuSettings);
    }

    showSettings() {
        this.menuView.changeActiveMenu('.menu__settings');
    }

    bindMenuItemListeners(item) {
        item.addEventListener('click', () => {
            switch (item.id) {
                case 'save':
                    this.saveGameCallback();
                    console.log('save');
                break;
                case 'new-game':
                    this.startNewGame();
                break;
                case 'saved-games':
                    this.showSavedGames();
                break;
                case 'settings':
                    this.showSettings();
                break;
                default:
                break;
            }
        });
    }
    
}