import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';
import Menu from './Menu.js';
import Data from './Data.js'


window.onload = () => {

    const data = new Data();
    let savedGames = data.getSavedGames();
    
    let gameFieldRowQuantity = 4,
        tilesSize = 100,
        isWin = false;

    const gameFieldView = new GameFieldView();
    gameFieldView.init(gameFieldRowQuantity, tilesSize);

    const tiles = new Tiles(tilesSize, () => {
        infoField.updateMovesField(infoField.moves++);
    }, () => {
        checkIsWin();
    });


    tiles.init(gameFieldRowQuantity);


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
        },
        (fieldSize) => {
            changeFieldSize(fieldSize);
        }
    );


    menu.createMenu();

    const infoField = new InfoField();
    infoField.init();

    const infoMenu = document.querySelector('.info__menu-button');

    if (savedGames.length) {
        infoField.toggleMenu(infoMenu);
        menu.showSavedGames();
    }


    function changeFieldSize(fieldSize) {
        gameFieldRowQuantity = Number(fieldSize);
        gameFieldView.changeFieldSize(gameFieldRowQuantity, tilesSize);
        console.log("gameFieldRowQuantity changed - ", gameFieldRowQuantity);
    }


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
        gameFieldView.clearGameField();
        tiles.init(gameFieldRowQuantity);
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
        console.log('loadSavedGame - ', tiles.tilesArr);
        changeFieldSize(tiles.tilesArr.length);
        tiles.loadTiles(gameFieldRowQuantity, tiles.tilesArr);
        bindTileListeners();
    }


    function bindTileListeners() {
        const tilesElementsArr = document.querySelectorAll('[data-key]');
        tilesElementsArr.forEach(tile => {
            tiles.bindTileListeners(tile);
        });
    }
     
}

