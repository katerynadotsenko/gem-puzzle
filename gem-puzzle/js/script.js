import GameFieldView from './GameFieldView.js';

let gameFieldRowQuantity = 4;
let tilesSize = 100;
let tilesArr = [];
let moveHistory = [];
//const tilesQuantity = gameFieldRowQuantity ** 2 - 1;

window.onload = () => {
    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize);

    generateTilesArr();
    shuffleTilesArr();

    gameFieldView.init(tilesArr);
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
    let emptyPlacePosition = {
        posI: gameFieldRowQuantity - 1, 
        posJ: gameFieldRowQuantity - 1
    };
    let moveDirection = 1;

    for (let i = 0; i < shuffleSteps; i++) {

        //generate move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
        moveDirection = Math.floor(Math.random() * 4) + 1;

        //check possibility to move
        switch (moveDirection) {
            case 1:
                moveDirection = emptyPlacePosition.posI < 1 ? 3 : 1;
                break;
            case 2:
                moveDirection = emptyPlacePosition.posJ >= gameFieldRowQuantity - 1 ? 4 : 2;
                break;
            case 3:
                moveDirection = emptyPlacePosition.posI >= gameFieldRowQuantity - 1 ? 1 : 3;
                break;
            case 4:
                moveDirection = emptyPlacePosition.posJ < 1 ? 2 : 4;
                break;
        }

        //move
        switch (moveDirection) {
            case 1:
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ] = tilesArr[emptyPlacePosition.posI - 1][emptyPlacePosition.posJ];
                tilesArr[emptyPlacePosition.posI - 1][emptyPlacePosition.posJ] = 0;
                emptyPlacePosition.posI = emptyPlacePosition.posI - 1;
                break;
            case 2:
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ] = tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ + 1];
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ + 1] = 0;
                emptyPlacePosition.posJ = emptyPlacePosition.posJ + 1;
                break;
            case 3:
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ] = tilesArr[emptyPlacePosition.posI + 1][emptyPlacePosition.posJ];
                tilesArr[emptyPlacePosition.posI + 1][emptyPlacePosition.posJ] = 0;
                emptyPlacePosition.posI = emptyPlacePosition.posI + 1;
                break;
            case 4:
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ] = tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ - 1];
                tilesArr[emptyPlacePosition.posI][emptyPlacePosition.posJ - 1] = 0;
                emptyPlacePosition.posJ = emptyPlacePosition.posJ - 1;
                break;
        }

        moveHistory.push(moveDirection);
    }
    console.log("tilesArr - ", tilesArr);
    console.log("moveHistory - ", moveHistory);
}

