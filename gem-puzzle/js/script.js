import GameFieldView from './GameFieldView.js';

let gameFieldRowQuantity = 4;
let tilesSize = 100;
let tilesArr = [];
let moveHistory = [];
let emptyPosition = {};
let moves = 0;

//const tilesQuantity = gameFieldRowQuantity ** 2 - 1;

class InfoField {
    constructor() {

    }

    init() {
        this.startTimer();
        this.updateMovesField();
    }

    updateMovesField() {
        const movesField = document.querySelector('.info__moves').lastElementChild;
        movesField.innerText = moves;
    }
    startTimer() {
        const timer = document.querySelector('.info__time').lastElementChild;

        let time = 0,
            hours = 0,
            minutes = 0,
            seconds = 0;

        setInterval(() => {
            hours = Math.trunc(time/60/60%60);
            minutes = Math.trunc(time/60%60);
            seconds = time%60;
            timer.innerText = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
            time++;
        }, 1000);
    }
}

window.onload = () => {
    generateTilesArr();
    shuffleTilesArr();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize, tilesArr);
    gameFieldView.init();

    const infoField = new InfoField();
    infoField.init();

    const tiles = document.querySelectorAll('[data-key]');

    tiles.forEach(tile => {

        if (tile.dataset.key == 0) return;

        tile.addEventListener('click', (e) => {
            moveTile(e.target);
        });

        tile.onmousedown = (e) => {
            //return;
            let currentDroppable = null;
            let shiftX = e.clientX - tile.getBoundingClientRect().left;
            let shiftY = e.clientY - tile.getBoundingClientRect().top;

            tile.style.zIndex = 1000;
            document.body.append(tile);
            moveAt(e.pageX, e.pageY);

            function moveAt (pageX, pageY) {
                tile.style.left = pageX - shiftX + 'px';
                tile.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
                tile.hidden = true;
                let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                tile.hidden = false;
                
                if (!elemBelow) return;

                let droppableBelow = document.querySelector('[data-key="0"]');

                if (currentDroppable != droppableBelow) {
                
                    if (currentDroppable) {
                      leaveDroppable(currentDroppable);
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable) {
                      enterDroppable(currentDroppable);
                    }
                  }
            }

            document.addEventListener('mousemove', onMouseMove);

            tile.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                //TODO if ton in place
                document.querySelector('.game-field').append(tile);
                moveTile(tile);
                tile.onmouseup = null;
            };

            function enterDroppable(elem) {
                elem.style.background = 'pink';
            }
          
            function leaveDroppable(elem) {
                elem.style.background = 'transparent';
            }
    
            tile.ondragstart = function() {
                return false;
            };
        };
    });
     
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

    const empty = document.querySelector('[data-key="0"]');

    const tileArrPosTop = tile.dataset.top;
    const tileArrPosLeft = tile.dataset.left;
    const emptyArrPosTop = empty.dataset.top;
    const emptyArrPosLeft = empty.dataset.left;

    //change positions in array

    tilesArr[emptyPosition.top][emptyPosition.left] = tilesArr[tile.dataset.top][tile.dataset.left];
    tilesArr[tile.dataset.top][tile.dataset.left] = 0;
    emptyPosition.top = tile.dataset.top;
    emptyPosition.left = tile.dataset.left;
    
   //change positions in DOM
    tile.style.top = `${Number(emptyArrPosTop) * tilesSize}px`;
    tile.style.left = `${Number(emptyArrPosLeft) * tilesSize}px`;
    tile.dataset.top = emptyArrPosTop;
    tile.dataset.left = emptyArrPosLeft;
    
    empty.style.top = `${Number(tileArrPosTop) * tilesSize}px`;
    empty.style.left = `${Number(tileArrPosLeft) * tilesSize}px`;
    empty.dataset.top = tileArrPosTop;
    empty.dataset.left = tileArrPosLeft;

    moves++;

    const infoField = new InfoField();
    infoField.updateMovesField();
    console.log("moves - ", moves);

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

