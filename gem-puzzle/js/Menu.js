import Data from './Data.js'
import MenuView from './MenuView.js'

export default class Menu {

    MenuView;

    constructor(saveGameCallback, startNewGame, loadSavedGame, changeFieldSize) {
        this.data = new Data();
        this.startNewGame = startNewGame;
        this.saveGameCallback = saveGameCallback;
        this.loadSavedGame = loadSavedGame;
        this.changeFieldSize = changeFieldSize;
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
            this.changeFieldSize(e.target.value);
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