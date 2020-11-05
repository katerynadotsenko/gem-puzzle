import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';
import Menu from './Menu.js';
import Data from './Data.js'


window.onload = () => {

    const data = new Data();
    let savedGames = data.getSavedGames();
    console.log('savedGames - ', savedGames);
    
    let gameFieldRowQuantity = 4,
        tilesSize = 100,
        tilesArr = [],
        isWin = false;

    const tiles = new Tiles(gameFieldRowQuantity, tilesSize, () => {
        infoField.updateMovesField(infoField.moves++);
    }, () => {
        checkIsWin();
    });



    tilesArr = tiles.init();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize);
    gameFieldView.init();
    gameFieldView.renderTilesToGameField(tilesArr);


    bindTileListeners();

    const menu = new Menu(
        () => {
            saveGameCallback()
        },
        () => {
            startNewGame();
        },
        (savedGame) => {
            loadSavedGame(savedGame);
        }
    );

    menu.createMenu();

    const infoField = new InfoField();
    infoField.init();

    const infoMenu = document.querySelector('.info__menu-button');
    

    function checkIsWin() {
        isWin = '1234567891011121314150' === tiles.tilesArr.map(arr => arr.join('')).join('');
        console.log(tiles.tilesArr.map(arr => arr.join('')).join(''));
        console.log("isWin - ", isWin);
        if (isWin) {
            const winTime = document.querySelector('.info__time').lastElementChild.textContent;
            const winMoves = document.querySelector('.info__moves').lastElementChild.textContent;
            menu.showWinInfo(winTime, winMoves);
            infoField.toggleMenu(infoMenu);
        }
    }

    function saveGameCallback() {
        menu.saveGame(tiles.tilesArr, infoField.time, infoField.moves)
    }
    

    function startNewGame() {
        infoField.stopTimer();
        infoField.moves = 1;
        infoField.updateMovesField(0);
        infoField.toggleMenu(infoMenu);
        tilesArr = tiles.init();
        gameFieldView.clearGameField()
        gameFieldView.renderTilesToGameField(tilesArr);
        bindTileListeners();
        console.log('new-game');
    }

    
    function loadSavedGame(savedGame) {
        //TODO
        //infoField.stopTimer();
        infoField.moves = savedGame.moves+1;
        infoField.updateMovesField(savedGame.moves);
        infoField.toggleMenu(infoMenu);
        gameFieldView.clearGameField();
        tiles.tilesArr = JSON.parse(savedGame.field);
        gameFieldView.renderTilesToGameField(tiles.tilesArr);
        bindTileListeners();
    }


    function bindTileListeners() {
        const tilesElementsArr = document.querySelectorAll('[data-key]');
        tilesElementsArr.forEach(tile => {
            tiles.bindTileListeners(tile);
        });
    }
     
}

