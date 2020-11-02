import GameFieldView from './GameFieldView.js';

let gameFieldRowQuantity = 4;
let tilesSize = 100;
//const tilesQuantity = gameFieldRowQuantity ** 2 - 1;

window.onload = () => {
    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize);
    gameFieldView.init();
}

