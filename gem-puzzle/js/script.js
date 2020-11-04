import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';


window.onload = () => {
    
    let gameFieldRowQuantity = 4,
        tilesSize = 100,
        tilesArr = [];


    const tiles = new Tiles(gameFieldRowQuantity, tilesSize, () => {
        infoField.updateMovesField(infoField.moves++);
    });

    tilesArr = tiles.init();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize);
    gameFieldView.init();
    gameFieldView.renderTilesToGameField(tilesArr);


    bindTileListeners();

    const infoField = new InfoField();
    infoField.init();

    const infoMenu = document.querySelector('.info__menu-button');
    const menuItems = document.querySelector('.menu__list').querySelectorAll('li');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            switch (item.id) {
                case 'save':
                    console.log('save')
                break;
                case 'new-game':
                    infoField.stopTimer();
                    infoField.moves = 1;
                    infoField.updateMovesField(0);
                    infoField.toggleMenu(infoMenu);
                    tilesArr = tiles.init();
                    gameFieldView.clearGameField()
                    gameFieldView.renderTilesToGameField(tilesArr);
                    bindTileListeners();
                    console.log('new-game');
                break;
                case 'saved-games':
                    console.log('saved-games')
                break;
                case 'settings':
                    console.log('settings')
                break;
                default:
                break;
            }
        });
    });


    function bindTileListeners() {
        const tilesElementsArr = document.querySelectorAll('[data-key]');
        tilesElementsArr.forEach(tile => {
            tiles.bindTileListeners(tile);
        });
    }
     
}

