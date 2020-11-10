import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';
import Menu from './Menu.js';
import Data from './Data.js';

//TODO notification when the game is saved
//todo implement autocomplete game for saved games
//TODO fix time in score and saved games
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
        console.log(document.body.clientWidth);
        if (document.body.clientWidth < 465) {
            console.log("< ", 465);
            fieldSizePX = document.body.clientWidth - 65;
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
        tiles.changeTilesSize(gameFieldRowQuantity, tilesSize);
        infoField.changeInfoFieldSize(fieldSizePX);
    }

    function toggleTilesImageBg(isImg) {
        isImage = isImg;
        console.log("isImage - ", isImage);
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
        console.log("script toggle sound - ", isSound);
    }

    function soundMenu() {
        if (!isSound) return;
        const sound = document.querySelector(`audio[data-sound="menu`);
        sound.currentTime = 0;
        sound.play();
    }

    function soundTick() {
        if (!isSound) return;
        const sound = document.querySelector(`audio[data-sound="tick`);
        sound.currentTime = 0;
        sound.play();
    }

    function soundStartGame() {
        if (!isSound) return;
        const sound = document.querySelector(`audio[data-sound="start-game`);
        sound.currentTime = 0;
        sound.play();
    }

    function soundMoveTile() {
        if (!isSound) return;
        const sound = document.querySelector(`audio[data-sound="main`);
        sound.currentTime = 0;
        sound.play();
    }

    function soundWin() {
        if (!isSound) return;
        const sound = document.querySelector(`audio[data-sound="win`);
        sound.currentTime = 0;
        sound.play();
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
        console.log(tiles.tilesArr.map(arr => arr.join('-')).join('-'));
        console.log("winCombination - ", winCombination);
        console.log("isWin - ", isWin);
        if (isWin) {
            const winTime = document.querySelector('.info__time').lastElementChild.textContent;
            const winMoves = document.querySelector('.info__moves').lastElementChild.textContent;
            menu.showWinInfo(winTime, winMoves);
            soundWin();
            setTimeout(() => {
                infoField.toggleMenu(infoMenu);
            }, 500);
            addResultsToBestScores();
            bestScores = data.getBestScores();
            menu.updateBestScores(bestScores);
        }

        return isWin;
    }

    function addResultsToBestScores() {
        const date = new Date();
        let day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();

        day = day > 9 ? day : '0' + day;
        month = month > 9 ? month : '0' + month;

        data.saveBestScore(`${day}/${month}/${year}`, infoField.moves, tiles.tilesArr.length, infoField.time)
    }


    function saveGameCallback() {
        menu.saveGame(tiles.tilesArr, infoField.time, infoField.moves, imgNum);
    }


    function startNewGame() {
        tilesSize = fieldSizePX/gameFieldRowQuantity;
        infoField.stopTimer();
        infoField.moves = 1;
        infoField.updateMovesField(0);
        gameFieldView.clearGameField();
        imgNum = tiles.generateImageNumber();
        tiles.init(gameFieldRowQuantity, tilesSize, isImage, imgNum);
        bindTileListeners();
    }

    function toggleMenu() {
        infoField.toggleMenu(infoMenu);
    }

    function loadSavedGame(savedGame) {
        infoField.stopTimer(Number(savedGame.time));
        infoField.moves = savedGame.moves+1;
        infoField.updateMovesField(savedGame.moves);
        infoField.toggleMenu(infoMenu);
        gameFieldView.clearGameField();
        tiles.tilesArr = JSON.parse(savedGame.field);
        gameFieldRowQuantity = tiles.tilesArr.length;
        tilesSize = fieldSizePX/gameFieldRowQuantity;
        tiles.loadTiles(gameFieldRowQuantity, tiles.tilesArr, tilesSize);
        if (savedGame.imgNum) {
            imgNum = savedGame.imgNum;
            tiles.generateImageToTiles(gameFieldRowQuantity, imgNum);
            console.log("savedGame.imgNum --- ", imgNum);
        } else {
            imgNum = false;
        }
        bindTileListeners();
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

