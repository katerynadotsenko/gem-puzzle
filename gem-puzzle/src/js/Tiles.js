import TileView from './TileView.js';


export default class Tiles {

    constructor(updateMovesFieldFunc, checkIsWinFunc, soundMoveTile) {

        this.tilesSize = null;
        this.updateMovesField = updateMovesFieldFunc;
        this.checkIsWin = checkIsWinFunc;
        this.soundMoveTile = soundMoveTile;
        this.tilesArr = [];
        this.moveHistory = [];
        this.infoField = null;
        this.tileView = new TileView();
    }

    init(gameFieldRowQuantity, tilesSize, isImage, imgNum=false) {
        this.tilesSize = tilesSize;
        this.tilesArr = [];

        this.generateTilesArr(gameFieldRowQuantity);
        this.shuffleTilesArr(gameFieldRowQuantity);
        this.loadTiles(gameFieldRowQuantity, this.tilesArr, tilesSize);
        if (isImage) {
            this.generateImageToTiles(gameFieldRowQuantity, imgNum);
        }

        return this.tilesArr;

    }

    loadTiles(gameFieldRowQuantity, tilesArr, tilesSize) {

        this.tilesSize = tilesSize;
        this.tileView.renderTilesToDom(gameFieldRowQuantity, tilesArr, tilesSize);
    }

    changeTilesSize(tilesSize) {
        this.tilesSize = tilesSize;
        this.tileView.changeTilesSize(tilesSize);
    }

    clearTilesFromImage() {
        const tiles = document.querySelectorAll('.tile');
        let tileNumber = 0;
        tiles.forEach((tile) => {
            tileNumber = Number(tile.dataset.key);
            if (tileNumber > 0) {
                tile.style.backgroundImage = `url('assets/tile-img.jpg')`;
                tile.style.backgroundSize = 'none';
                tile.style.color = 'rgba(48, 28, 12, 0.7)';
            }
        });
    }

    generateImageNumber() {
        return Math.floor(Math.random() * 150) + 1;
    }

    generateImageToTiles(gameFieldRowQuantity, imgNum=false) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            parts = [],
            img = new Image();

        img.onload = split;

        if (!imgNum) {
            imgNum = this.generateImageNumber();
        }

        img.src = `assets/images/${imgNum}.jpg`;

        function split() {
            let w2 = img.width / gameFieldRowQuantity,
                h2 = img.height / gameFieldRowQuantity;
    
            for (let i = 0; i < gameFieldRowQuantity*gameFieldRowQuantity; i++) {
                let x = i % gameFieldRowQuantity == 0 ? 0 : (-w2*i) % (w2*gameFieldRowQuantity),
                    y = -h2 * Math.floor(i/gameFieldRowQuantity);

                canvas.width = w2;
                canvas.height = h2;
        
                ctx.drawImage(this, x, y, w2*gameFieldRowQuantity, h2*gameFieldRowQuantity);
        
                parts.push(canvas.toDataURL());
            }
            
                
            const tiles = document.querySelectorAll('.tile');
            let tileNumber = 0;
            tiles.forEach((tile) => {
                tileNumber = Number(tile.dataset.key) - 1;
                if (tileNumber >= 0) {
                    tile.style.color = 'transparent';
                    tile.style.backgroundColor = 'transparent';
                    tile.style.backgroundImage = `url(${parts[tileNumber]})`;
                    tile.style.backgroundSize = 'cover';
                }
                
            });
        }
    }

    bindTileListeners(tile) {

        if (tile.dataset.key == 0) return; 

        tile.onmousedown = (e) => {
            if (e.which != 1) return;
            const startPosLeft = e.pageX;
            const startPosTop = e.pageY;

            let currentDroppable = null;
            let isTileNeededToMove = true;
            let shiftX = e.clientX - tile.getBoundingClientRect().left;
            let shiftY = e.clientY - tile.getBoundingClientRect().top;

            tile.style.zIndex = 5;
            document.body.append(tile);
            moveAt(e.pageX, e.pageY);

            function moveAt (pageX, pageY) {
                tile.style.left = pageX - shiftX + 'px';
                tile.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(e) {
                isTileNeededToMove = false;
                moveAt(e.pageX, e.pageY);

                tile.style.visibility = 'hidden';
                let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                tile.style.visibility = 'visible';
                
                if (!elemBelow) {
                    return;
                }

                let droppableBelow = elemBelow.closest('[data-key="0"]');

                if (currentDroppable != droppableBelow) {
                
                    if (currentDroppable) {
                        leaveDroppable(currentDroppable);
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable) {
                        enterDroppable(currentDroppable);
                    }
                } else if (currentDroppable !== null && droppableBelow !== null) {
                    isTileNeededToMove = true;
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            tile.onmouseup = (e) => {
                if (Math.abs(e.pageX - startPosLeft) < 10 && Math.abs(e.pageY - startPosTop) < 10) {
                    isTileNeededToMove = true;
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.querySelector('.game-field').append(tile);
                tile.onmouseup = null;
                this.moveTile(tile, isTileNeededToMove);
                tile.style.zIndex = 4;
            };

            function enterDroppable() {
                isTileNeededToMove = true;
            }
          
            function leaveDroppable() {
                isTileNeededToMove = false;
            }
    
            tile.ondragstart = function() {
                return false;
            };
        };

    }

    moveTile(tile, isTileNeededToMove=true, isAutocomplete=false) {

        const empty = document.querySelector('[data-key="0"]');
    
        //don't change positions
    
        if ((Math.abs(empty.dataset.top - tile.dataset.top) > 1 || Math.abs(empty.dataset.left - tile.dataset.left) > 1)
            || (Math.abs(empty.dataset.top - tile.dataset.top) !== 0 && Math.abs(empty.dataset.left - tile.dataset.left) !== 0)
            || !isTileNeededToMove) {
    
            empty.style.top = `${empty.dataset.top * this.tilesSize}px`;
            empty.style.left = `${empty.dataset.left * this.tilesSize}px`;
    
            tile.style.top = `${tile.dataset.top * this.tilesSize}px`;
            tile.style.left = `${tile.dataset.left * this.tilesSize}px`;
    
            return;
        }

        this.soundMoveTile();

    
        //change positions
    
        const tileArrPosTop = tile.dataset.top;
        const tileArrPosLeft = tile.dataset.left;
        const emptyArrPosTop = empty.dataset.top;
        const emptyArrPosLeft = empty.dataset.left;

        let moveDirection = null;

        if (isAutocomplete == false) {

        //move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
        if (tileArrPosTop - emptyArrPosTop > 0) {
            moveDirection = 3;
        } else if (tileArrPosTop - emptyArrPosTop < 0) {
            moveDirection = 1;
        } else if (tileArrPosLeft - emptyArrPosLeft > 0) {
            moveDirection = 2;
        } else if (tileArrPosLeft - emptyArrPosLeft < 0) {
            moveDirection = 4;
        }

            this.moveHistory.push(moveDirection);
        }
    
        // 1 change positions in array
    
        this.tilesArr[empty.dataset.top][empty.dataset.left] = this.tilesArr[tile.dataset.top][tile.dataset.left];
        this.tilesArr[tile.dataset.top][tile.dataset.left] = 0;

        
       // 2 change positions in DOM

       const gameFieldWithBorder = document.querySelector('.game-field-with-border');

       let tilePosX = null;
       let tilePosY = null;
       let moveAnimationTime = null;

       if (isAutocomplete == false) {
            tilePosX = `${tile.offsetTop - gameFieldWithBorder.offsetTop - 30}px`;
            tilePosY = `${tile.offsetLeft - gameFieldWithBorder.offsetLeft - 30}px`;
            moveAnimationTime = 300;
       } else {
            tilePosX = `${tile.dataset.top * this.tilesSize}px`;
            tilePosY = `${tile.dataset.left * this.tilesSize}px`;
            moveAnimationTime = 100;
       }
      

        tile.style.top = `${Number(emptyArrPosTop) * this.tilesSize}px`;
        tile.style.left = `${Number(emptyArrPosLeft) * this.tilesSize}px`;
        tile.dataset.top = emptyArrPosTop;
        tile.dataset.left = emptyArrPosLeft;

        tile.animate([
            { top: tilePosX,  left: tilePosY},
            { top: `${Number(emptyArrPosTop) * this.tilesSize}px`,  left: `${Number(emptyArrPosLeft) * this.tilesSize}px`}
            
          ], {
            duration: moveAnimationTime,
            animationFillMode: 'forward'
          });
        
        empty.style.top = `${Number(tileArrPosTop) * this.tilesSize}px`;
        empty.style.left = `${Number(tileArrPosLeft) * this.tilesSize}px`;
        empty.dataset.top = tileArrPosTop;
        empty.dataset.left = tileArrPosLeft;
    
        empty.style.background = 'transparent';
  
        this.updateMovesField();
        
        this.checkIsWin();
    
    }

    generateTilesArr(gameFieldRowQuantity) {
        let numberArr = [];
        let number = 0;
        for (let i = 0; i < gameFieldRowQuantity; i++) {
            numberArr = [];
            for (let j = 0; j < gameFieldRowQuantity; j++) {
                number = j + i * gameFieldRowQuantity + 1;
                number = number > gameFieldRowQuantity ** 2 - 1 ? 0 : number;
                numberArr.push(number);
            }
            this.tilesArr.push(numberArr);
        }

    }
    
    shuffleTilesArr(gameFieldRowQuantity) {
        
        let shuffleSteps;
        this.moveHistory = [];


        if (gameFieldRowQuantity == 3) {
            shuffleSteps = 50;
        } else if (gameFieldRowQuantity == 4) {
            shuffleSteps = 140;
        } else {
            shuffleSteps = gameFieldRowQuantity**2 * 25;
        }
    
        let emptyPosition = {};
        let prevStep = null;

       this.tilesArr.forEach((array, top) => {
            array.forEach((item, left) => {
                if (item == 0) {
                    emptyPosition.top = top;
                    emptyPosition.left = left;
                }
            });
        });

        let moveDirection = 1;
    
        for (let i = 0; i < shuffleSteps; i++) {
    
            //generate move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
            moveDirection = Math.floor(Math.random() * 4) + 1;
            
            //check direction to prevent repeated steps
            
            if ((prevStep == 1 && moveDirection == 3) || (prevStep == 3 && moveDirection == 1)) {
                moveDirection = emptyPosition.left < 1 ? 4 : 2 * (Math.floor(Math.random() * 2) + 1);
            } else if ((prevStep == 2 && moveDirection == 4) || (prevStep == 4 && moveDirection == 2)) {
                moveDirection = emptyPosition.top < 1 ? 3 : 1 + Math.floor(Math.random() * 2) * 2;
            }

            if (prevStep == moveDirection) {
                switch (moveDirection) {
                    case 1:
                        moveDirection = emptyPosition.top < 1 ? 2 : 1;
                        break;
                    case 2:
                        moveDirection = emptyPosition.left >= gameFieldRowQuantity - 1 ? 1 : 2;
                        break;
                    case 3:
                        moveDirection = emptyPosition.top >= gameFieldRowQuantity - 1 ? 2: 3;
                        break;
                    case 4:
                        moveDirection = emptyPosition.left < 1 ? 1 : 4;
                        break;
                }
            }

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
                    this.tilesArr[emptyPosition.top][emptyPosition.left] = this.tilesArr[emptyPosition.top - 1][emptyPosition.left];
                    this.tilesArr[emptyPosition.top - 1][emptyPosition.left] = 0;
                    emptyPosition.top = emptyPosition.top - 1;
                    break;
                case 2:
                    this.tilesArr[emptyPosition.top][emptyPosition.left] = this.tilesArr[emptyPosition.top][emptyPosition.left + 1];
                    this.tilesArr[emptyPosition.top][emptyPosition.left + 1] = 0;
                    emptyPosition.left = emptyPosition.left + 1;
                    break;
                case 3:
                    this.tilesArr[emptyPosition.top][emptyPosition.left] = this.tilesArr[emptyPosition.top + 1][emptyPosition.left];
                    this.tilesArr[emptyPosition.top + 1][emptyPosition.left] = 0;
                    emptyPosition.top = emptyPosition.top + 1;
                    break;
                case 4:
                    this.tilesArr[emptyPosition.top][emptyPosition.left] = this.tilesArr[emptyPosition.top][emptyPosition.left - 1];
                    this.tilesArr[emptyPosition.top][emptyPosition.left - 1] = 0;
                    emptyPosition.left = emptyPosition.left - 1;
                    break;
            }
    
            this.moveHistory.push(moveDirection);
            
            prevStep = moveDirection;
        }
    }

    async autocompleteGame(tilesArr) {
        // move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
        this.tilesArr = tilesArr;

        let emptyPosition = {
            top: null,
            left: null
        };

        let moveDirection;

        let tile;

        let activeTileTop;
        let activeTileLeft;

        this.tilesArr.forEach((rowArr, row) => {
            rowArr.forEach((num, col) => {
                if (num == 0) {
                    emptyPosition.top = row;
                    emptyPosition.left = col;
                }
            });
        });

        const info = document.querySelector('.info');

        const stepsQuantity = this.moveHistory.length-1;

        for (let step = stepsQuantity; step >= 0; step--) {
            const stopAutoComplete = info.classList.contains("active");

            if (stopAutoComplete) {
                return;
            }

            moveDirection = this.moveHistory.pop();

            switch (moveDirection) {
                case 1:
                    activeTileTop = emptyPosition.top + 1;
                    emptyPosition.top = emptyPosition.top + 1;
                    activeTileLeft = emptyPosition.left;
                    break;
                case 2:
                    activeTileLeft = emptyPosition.left - 1;
                    emptyPosition.left = emptyPosition.left - 1;
                    activeTileTop = emptyPosition.top;
                    break;
                case 3:
                    activeTileTop = emptyPosition.top - 1;
                    emptyPosition.top = emptyPosition.top - 1;
                    activeTileLeft = emptyPosition.left;
                    break;
                case 4:
                    activeTileLeft = emptyPosition.left + 1;
                    emptyPosition.left = emptyPosition.left + 1;
                    activeTileTop = emptyPosition.top;
                    break;
            }

            tile = document.querySelector(`[data-key="${this.tilesArr[activeTileTop][activeTileLeft]}"]`);

            await new Promise(resolve => {
                this.moveTile(tile, true, true);
                setTimeout(resolve, 120);
            });
            
        }
        
    }

    isHasSolution() {
        //it works correctly for the standard size
        let sum = 0;
        let array = [];
        this.tilesArr.forEach(arr => {
            array.push(...arr);
        });

        let fieldSize = this.tilesArr.length;     

        array.forEach((num, i) => {
                if (num != 0) {
                    array.slice(i).forEach(n => {
                        if (num > n && n != 0) {
                            sum += 1;
                        }
                    });
                } else {
                    let numRowOfEmpty = Math.ceil((i + 1) / fieldSize);
                    sum += numRowOfEmpty;
                }
        });

        return sum % 2 === 0
    }
}

