import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';


window.onload = () => {
    
    let gameFieldRowQuantity = 4,
        tilesSize = 100,
        tilesArr = [];


    const tiles = new Tiles(gameFieldRowQuantity, tilesSize);
    tilesArr = tiles.init();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize, tilesArr);
    gameFieldView.init();

    const infoField = new InfoField();
    infoField.init();

    const tilesElementsArr = document.querySelectorAll('[data-key]');

    tilesElementsArr.forEach(tile => {
        tiles.bindTileListeners(tile);
    });
     
}

