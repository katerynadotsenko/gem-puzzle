import GameFieldView from './GameFieldView.js';

let gameFieldRowQuantity = 4;
let tilesSize = 100;
let tilesArr = [];
let moveHistory = [];
let emptyPosition = {};

//const tilesQuantity = gameFieldRowQuantity ** 2 - 1;

window.onload = () => {
    generateTilesArr();
    shuffleTilesArr();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize, tilesArr);
    gameFieldView.init();

    const tiles = document.querySelectorAll('[data-key]');

    tiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            moveTile(e.target);
        })
    })
     
}

function moveTile(tile) {
    
    if (Math.abs(emptyPosition.top - tile.dataset.top) > 1 || Math.abs(emptyPosition.left - tile.dataset.left) > 1) {
        console.log('emptyPosition.top - ', emptyPosition.top);
        console.log("emptyPosition.left - ", emptyPosition.left);
        console.log("tile.dataset.top - ", tile.dataset.top);
        console.log("tile.dataset.left - ", tile.dataset.left);
        console.log("so far");
        return;
    } else if (Math.abs(emptyPosition.top - tile.dataset.top) !== 0 && Math.abs(emptyPosition.left - tile.dataset.left) !== 0) {
        console.log('emptyPosition.top - ', emptyPosition.top);
        console.log("emptyPosition.left - ", emptyPosition.left);
        console.log("tile.dataset.top - ", tile.dataset.top);
        console.log("tile.dataset.left - ", tile.dataset.left);
        console.log("so far too");
        return;
    }

    const tileArrPosTop = emptyPosition.top;
    const tileArrPosLeft = emptyPosition.left;

    //change positions in array

    tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[tile.dataset.top][tile.dataset.left];
    tilesArr[tile.dataset.top][tile.dataset.left] = 0;
    emptyPosition.top = tile.dataset.top;
    emptyPosition.left = tile.dataset.left;
    
   //change positions in DOM

    const empty = document.querySelector('[data-key="0"]');
    const emptyTop = tile.style.top;
    const emptyLeft = tile.style.left;

    tile.style.top = empty.style.top;
    tile.style.left = empty.style.left;
    tile.dataset.top = tileArrPosTop;
    tile.dataset.left = tileArrPosLeft;
    
    empty.style.top = emptyTop;
    empty.style.left = emptyLeft;
    empty.dataset.top = emptyPosition.top;
    empty.dataset.left = emptyPosition.left;

    console.log("tilesArr - ", tilesArr);

}

function generateTilesArr() {
    let numberArr = [];
    let number = 0;
    for (let i = 0; i < gameFieldRowQuantity; i++) {
        numberArr = [];
        for (let j = 0; j < gameFieldRowQuantity; j++) {
            number = j + i * gameFieldRowQuantity + 1;
            number = number > gameFieldRowQuantity ** 2 - 1 ? 0 : number;
            numberArr.push(number);
        }
        tilesArr.push(numberArr);
    }
    //console.log("tilesArr - ", tilesArr);
}

function shuffleTilesArr() {
    const shuffleSteps = 130;
    emptyPosition = {
        top: gameFieldRowQuantity - 1, 
        left: gameFieldRowQuantity - 1
    };
    let moveDirection = 1;

    for (let i = 0; i < shuffleSteps; i++) {

        //generate move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
        moveDirection = Math.floor(Math.random() * 4) + 1;

        //check possibility to move
        switch (moveDirection) {
            case 1:
                moveDirection = emptyPosition.top < 1 ? 3 : 1;
                break;
            case 2:
                moveDirection = emptyPosition.left >= gameFieldRowQuantity - 1 ? 4 : 2;
                break;
            case 3:
                moveDirection = emptyPosition.top >= gameFieldRowQuantity - 1 ? 1 : 3;
                break;
            case 4:
                moveDirection = emptyPosition.left < 1 ? 2 : 4;
                break;
        }

        //move
        switch (moveDirection) {
            case 1:
                tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[emptyPosition.top - 1][emptyPosition.left];
                tilesArr[emptyPosition.top - 1][emptyPosition.left] = 0;
                emptyPosition.top = emptyPosition.top - 1;
                break;
            case 2:
                tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[emptyPosition.top][emptyPosition.left + 1];
                tilesArr[emptyPosition.top][emptyPosition.left + 1] = 0;
                emptyPosition.left = emptyPosition.left + 1;
                break;
            case 3:
                tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[emptyPosition.top + 1][emptyPosition.left];
                tilesArr[emptyPosition.top + 1][emptyPosition.left] = 0;
                emptyPosition.top = emptyPosition.top + 1;
                break;
            case 4:
                tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[emptyPosition.top][emptyPosition.left - 1];
                tilesArr[emptyPosition.top][emptyPosition.left - 1] = 0;
                emptyPosition.left = emptyPosition.left - 1;
                break;
        }

        moveHistory.push(moveDirection);
    }
    console.log("tilesArr - ", tilesArr);
    console.log("moveHistory - ", moveHistory);
}

