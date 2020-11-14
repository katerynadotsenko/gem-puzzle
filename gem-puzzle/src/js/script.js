import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';
import Menu from './Menu.js';
import Data from './Data.js';

import sounds from './sounds';


window.onload = () => {

    const data = new Data();
    let savedGames = data.getSavedGames();
    let bestScores = data.getBestScores();
    
    let gameFieldRowQuantity = 4,
        fieldSizePX = 400,
        tilesSize = fieldSizePX/gameFieldRowQuantity,
        isImage = false,
        isWin = false,
        isSound = true,
        imgNum = false;

    let winCombination = generateWinCombination();

    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    document.body.insertBefore(gameContainer, document.body.childNodes[0]);

    const gameFieldView = new GameFieldView();
    gameFieldView.init(fieldSizePX);

    const tiles = new Tiles(() => {
        infoField.updateMovesField(infoField.moves++);
    }, () => {
        checkIsWin();
    },
    () => {
        soundMoveTile();
    });


    tiles.init(gameFieldRowQuantity, tilesSize, isImage);

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
            changeTilesQuantity(fieldSize);
        },
        (isImg) => {
            toggleTilesImageBg(isImg);
        },
        () => {
            toggleMenu();
        },
        () => {
            autocompleteGame();
        },
        () => {
            toggleSound();
        },
        () => {
            soundTick();
        },
        () => {
            soundStartGame();
        }
    );


    menu.createMenu();
    if(bestScores) {
        menu.updateBestScores(bestScores);
    }

    const infoField = new InfoField(() => {
        soundMenu();
    });
    infoField.init();

    const infoMenu = document.querySelector('.info__menu-button');

    if (savedGames.length) {
        infoField.toggleMenu(infoMenu);
        menu.showSavedGames();
    }

    checkWindowSize();

    window.onresize = () => {
        checkWindowSize();
    }

    function checkWindowSize() {
        if (document.body.clientWidth < 485) {
            fieldSizePX = document.body.clientWidth - 85;
            changeGameFieldSize();
        } else {
            if (fieldSizePX !== 400) {
                fieldSizePX = 400;
                changeGameFieldSize();
            }
        }
    }

    function changeGameFieldSize() {
        tilesSize = fieldSizePX/gameFieldRowQuantity;
        gameFieldView.changeGameFieldSize(fieldSizePX);
        tiles.changeTilesSize(tilesSize);
        infoField.changeInfoFieldSize(fieldSizePX);
    }

    function toggleTilesImageBg(isImg) {
        isImage = isImg;
        if (isImage) {
            imgNum = tiles.generateImageNumber();
            tiles.generateImageToTiles(gameFieldRowQuantity, imgNum);
        } else {
            tiles.clearTilesFromImage();
            imgNum = false;
        }
    }


    /* sounds*/

    function toggleSound() {
        isSound = !isSound;
    }

    function soundMenu() {
        if (!isSound) return;
        sounds.menuSound.currentTime = 0;
        sounds.menuSound.play();
    }

    function soundTick() {
        if (!isSound) return;
        sounds.tickSound.currentTime = 0;
        sounds.tickSound.play();
    }

    function soundStartGame() {
        if (!isSound) return;
        sounds.startGame.currentTime = 0;
        sounds.startGame.play();
    }

    function soundMoveTile() {
        if (!isSound) return;
        sounds.mainSound.currentTime = 0;
        sounds.mainSound.play();
    }

    function soundWin() {
        if (!isSound) return;
        sounds.winSound.currentTime = 0;
        sounds.winSound.play();
    }


    function changeTilesQuantity(fieldSize) {
        gameFieldRowQuantity = Number(fieldSize);
        tilesSize = fieldSizePX / gameFieldRowQuantity;
        winCombination = generateWinCombination();
    }

    function generateWinCombination() {
        let winCombination = '';
        for (let i = 1; i <= gameFieldRowQuantity*gameFieldRowQuantity - 1; i++) {
            winCombination += `${i}-`;
        }
        winCombination += '0';
        return winCombination;
    }

    function checkIsWin() {
        isWin = winCombination === tiles.tilesArr.map(arr => arr.join('-')).join('-');
        if (isWin) {
            const winTime = document.querySelector('.info__time').lastElementChild.textContent;
            const winMoves = document.querySelector('.info__moves').lastElementChild.textContent;
            menu.showWinInfo(winTime, winMoves);
            soundWin();
            setTimeout(() => {
                infoField.toggleMenu(infoMenu);
            }, 500);
            addResultsToBestScores(winTime, winMoves);
            bestScores = data.getBestScores();
            menu.updateBestScores(bestScores);
        }

        return isWin;
    }

    function addResultsToBestScores(winTime, winMoves) {
        const date = new Date();
        let day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();

        day = day > 9 ? day : '0' + day;
        month = month > 9 ? month : '0' + month;

        data.saveBestScore(`${day}/${month}/${year}`, winMoves, tiles.tilesArr.length, winTime)
    }


    function saveGameCallback() {
        const time = document.querySelector('.info__time').lastElementChild.textContent;
        const moves = document.querySelector('.info__moves').lastElementChild.textContent;
        menu.saveGame(tiles.tilesArr, time, moves, imgNum, tiles.moveHistory);
    }


    function startNewGame() {
        tilesSize = fieldSizePX/gameFieldRowQuantity;
        infoField.stopTimer();
        infoField.moves = 1;
        infoField.updateMovesField(0);
        gameFieldView.clearGameField();
        if (isImage) {
            imgNum = tiles.generateImageNumber();
        }
        tiles.init(gameFieldRowQuantity, tilesSize, isImage, imgNum);
        bindTileListeners();
    }

    function toggleMenu() {
        infoField.toggleMenu(infoMenu);
    }

    function loadSavedGame(savedGame) {
        infoField.startSavedTimer(savedGame.time);
        infoField.moves = savedGame.moves+1;
        infoField.updateMovesField(savedGame.moves);
        infoField.toggleMenu(infoMenu);
        gameFieldView.clearGameField();
        tiles.tilesArr = JSON.parse(savedGame.field);
        gameFieldRowQuantity = tiles.tilesArr.length;
        tilesSize = fieldSizePX/gameFieldRowQuantity;
        tiles.moveHistory = JSON.parse(savedGame.moveHistory);
        tiles.loadTiles(gameFieldRowQuantity, tiles.tilesArr, tilesSize);

        if (savedGame.imgNum) {
            imgNum = savedGame.imgNum;
            isImage = true;
            tiles.generateImageToTiles(gameFieldRowQuantity, imgNum);
        } else {
            isImage = false;
            imgNum = false;
        }

        bindTileListeners();

        menu.changeSettings(gameFieldRowQuantity, isImage);

        winCombination = generateWinCombination();
    }

    function autocompleteGame() {
        tiles.autocompleteGame(tiles.tilesArr);
    }


    function bindTileListeners() {
        const tilesElementsArr = document.querySelectorAll('[data-key]');
        tilesElementsArr.forEach(tile => {
            tiles.bindTileListeners(tile);
        });
    }


}

