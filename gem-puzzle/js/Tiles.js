import TileView from './TileView.js';


export default class Tiles {

    constructor(updateMovesFieldFunc, checkIsWinFunc) {

        this.tilesSize = null;
        this.updateMovesField = updateMovesFieldFunc;
        this.checkIsWin = checkIsWinFunc;
        this.tilesArr = [];
        this.moveHistory = [];
        this.infoField = null;
        this.tileView = new TileView();
    }

    init(gameFieldRowQuantity, tilesSize, isImage) {
        this.tilesSize = tilesSize;
        this.tilesArr = [];

        this.generateTilesArr(gameFieldRowQuantity);
        console.log("tiles init - ", this.tilesArr);
        this.shuffleTilesArr(gameFieldRowQuantity);
        this.loadTiles(gameFieldRowQuantity, this.tilesArr, tilesSize);
        if (isImage) {
            this.generateImageToTiles(gameFieldRowQuantity);
        }

        return this.tilesArr;

    }

    loadTiles(gameFieldRowQuantity, tilesArr, tilesSize) {
        console.log(tilesArr);
        this.tileView.renderTilesToDom(gameFieldRowQuantity, tilesArr, tilesSize);
    }

    clearTilesFromImage() {
        const tiles = document.querySelectorAll('.tile');
        let tileNumber = 0;
        tiles.forEach((tile) => {
            tileNumber = Number(tile.dataset.key);
            if (tileNumber > 0) {
                tile.style.backgroundColor = 'rgb(109, 128, 168)';
                tile.style.backgroundImage = 'none';
                tile.style.backgroundSize = 'none';
            }
        });
    }

    generateImageToTiles(gameFieldRowQuantity) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            parts = [],
            img = new Image();

        img.onload = split;

        img.src = '../images/10.jpg';

        function split() {
            let w2 = img.width / gameFieldRowQuantity,
                h2 = img.height / gameFieldRowQuantity;
    
            for (let i = 0; i < gameFieldRowQuantity*gameFieldRowQuantity; i++) {
                let x = (-w2*i) % (w2*gameFieldRowQuantity),
                    y = -h2 * Math.floor(i/gameFieldRowQuantity);

                canvas.width = w2;
                canvas.height = h2;
        
                ctx.drawImage(this, x, y, w2*gameFieldRowQuantity, h2*gameFieldRowQuantity);
        
                parts.push(canvas.toDataURL());
            }

            /*for (let i = 0; i < gameFieldRowQuantity; i++) {
                for (let j = 0; j < gameFieldRowQuantity ; j++) {
                    newParts.push(parts[i + j * gameFieldRowQuantity]);
                }
            }*/
            
                
            const tiles = document.querySelectorAll('.tile');
            let tileNumber = 0;
            tiles.forEach((tile) => {
                tileNumber = Number(tile.dataset.key) - 1;
                if (tileNumber >= 0) {
                    tile.style.backgroundColor = 'transparent';
                    tile.style.backgroundImage = `url(${parts[tileNumber]})`;
                    tile.style.backgroundSize = 'cover';
                }
                
            });
        } 
    }



    bindTileListeners(tile) {

        if (tile.dataset.key == 0) return;

        /*const handleDragEnd = (e) => {
            e.preventDefault();
            let data = e.dataTransfer.getData("tile");
            this.moveTile(document.querySelector(`[data-key="${data}"]`));
        }

        const handleDragStart = (e) => {
            e.dataTransfer.setData("tile", e.target.dataset.key);
        }

        if (tile.dataset.key == 0) {
            tile.draggable = false;
            tile.addEventListener('drop', handleDragEnd, false);
            tile.addEventListener('dragover', (e) => e.preventDefault());
            return;
        };

        tile.addEventListener('click', (e) => {
            this.moveTile(e.target);
        });

        tile.addEventListener('dragstart', handleDragStart, false);*/

        

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
                    console.log("elemBelow outside");
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
                this.checkIsWin();
                tile.style.zIndex = 4;
            };

            function enterDroppable(elem) {
                elem.style.background = 'pink';
                isTileNeededToMove = true;
            }
          
            function leaveDroppable(elem) {
                elem.style.background = 'transparent';
                isTileNeededToMove = false;
            }
    
            tile.ondragstart = function() {
                return false;
            };
        };

    }

    moveTile(tile, isTileNeededToMove=true) {

        const empty = document.querySelector('[data-key="0"]');
    
        //don't change positions
    
        if ((Math.abs(empty.dataset.top - tile.dataset.top) > 1 || Math.abs(empty.dataset.left - tile.dataset.left) > 1)
            || (Math.abs(empty.dataset.top - tile.dataset.top) !== 0 && Math.abs(empty.dataset.left - tile.dataset.left) !== 0)
            || !isTileNeededToMove) {
            console.log('emptyPosition.top - ', empty.dataset.top);
            console.log("emptyPosition.left - ", empty.dataset.left);
            console.log("tile.dataset.top - ", tile.dataset.top);
            console.log("tile.dataset.left - ", tile.dataset.left);
            console.log("so far");
    
            empty.style.top = `${empty.dataset.top * this.tilesSize}px`;
            empty.style.left = `${empty.dataset.left * this.tilesSize}px`;
    
            tile.style.top = `${tile.dataset.top * this.tilesSize}px`;
            tile.style.left = `${tile.dataset.left * this.tilesSize}px`;
    
            return;
        }


        const sound = document.querySelector(`audio[data-sound="main`);
        sound.currentTime = 0;
        sound.play();
        /*if (sound) {
        }*/

    
        //change positions
    
        const tileArrPosTop = tile.dataset.top;
        const tileArrPosLeft = tile.dataset.left;
        const emptyArrPosTop = empty.dataset.top;
        const emptyArrPosLeft = empty.dataset.left;
    
        // 1 change positions in array
    
        this.tilesArr[empty.dataset.top][empty.dataset.left] = this.tilesArr[tile.dataset.top][tile.dataset.left];
        this.tilesArr[tile.dataset.top][tile.dataset.left] = 0;

        
       // 2 change positions in DOM

       const gameField = document.querySelector('.game-field');
       const tilePosX = `${tile.offsetTop - gameField.offsetTop}px`;
       const tilePosY = `${tile.offsetLeft - gameField.offsetLeft}px`;

        tile.style.top = `${Number(emptyArrPosTop) * this.tilesSize}px`;
        tile.style.left = `${Number(emptyArrPosLeft) * this.tilesSize}px`;
        tile.dataset.top = emptyArrPosTop;
        tile.dataset.left = emptyArrPosLeft;
        //TODO check bugs if use drag & drop
        tile.animate([
            { top: tilePosX,  left: tilePosY},
            { top: `${Number(emptyArrPosTop) * this.tilesSize}px`,  left: `${Number(emptyArrPosLeft) * this.tilesSize}px`}
            
          ], {
            duration: 300,
            animationFillMode: 'forward'
          });
        
        empty.style.top = `${Number(tileArrPosTop) * this.tilesSize}px`;
        empty.style.left = `${Number(tileArrPosLeft) * this.tilesSize}px`;
        empty.dataset.top = tileArrPosTop;
        empty.dataset.left = tileArrPosLeft;
    
        empty.style.background = 'transparent';
  
        this.updateMovesField();
    
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
        
        const shuffleSteps = gameFieldRowQuantity ** 2 * 70;
    
        console.log("shuffleSteps - ", shuffleSteps);
        let emptyPosition = {};
        let prevStep = null;
        let prevPrevStep = null;

       this.tilesArr.forEach((array, top) => {
            array.forEach((item, left) => {
                if (item == 0) {
                    emptyPosition.top = top;
                    emptyPosition.left = left;
                };
            });
        });
        console.log("emptyPosition - ", emptyPosition);

        let moveDirection = 1;
    
        for (let i = 0; i < shuffleSteps; i++) {
    
            //generate move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
            moveDirection = Math.floor(Math.random() * 4) + 1;
            
            //check direction to prevent repeated steps
            if (prevPrevStep === moveDirection) {
                if (prevStep%2 && prevPrevStep%2) {
                    moveDirection = 1;
                } else if (!prevStep%2 && !prevPrevStep%2) {
                    moveDirection = 2;
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
            prevPrevStep = prevStep;
            prevStep = moveDirection;
        }
        
        
        console.log("this.tilesArr - ", this.tilesArr);
        console.log("this.moveHistory - ", this.moveHistory);

        //console.log('isHasSolution - ', this.isHasSolution());

    }

    isHasSolution() {
        //it works correctly for the standard size
        let sum = 0;
        let array = [];
        this.tilesArr.forEach(arr => {
            array.push(...arr);
        });

        let fieldSize = this.tilesArr.length;
        console.log("fieldSize - ", fieldSize);
        console.log("array - ", array);


        //false
        //array = [1,2,3,4,5,6,7,8,9,10,11,12,13,15,14,0];

        //?
        //array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 0, 29, 30, 31, 32, 35, 41, 36, 37, 38, 39, 33, 48, 34, 43, 44, 45, 46, 40, 47, 42];
        //fieldSize = 7;
        //true
        //array = [5, 20, 28, 4, 18, 23, 7, 1, 25, 11, 22, 21, 37, 9, 8, 33, 19, 14, 39, 3, 24, 46, 13, 40, 2, 31, 0, 30, 32, 10, 16, 42, 48, 6, 38, 12, 29, 45, 15, 27, 41, 35, 44, 47, 43, 36, 34, 17, 26];
        //fieldSize = 7;
        

        array.forEach((num, i) => {
            console.log(array.slice(i));
                if (num != 0) {
                    array.slice(i).forEach((n, j) => {
                        if (num > n && n != 0) {
                            sum += 1;
                        }
                    });
                } else {
                    let numRowOfEmpty = Math.ceil((i + 1) / fieldSize);
                    sum += numRowOfEmpty;
                    console.log("numRowOfEmpty ---", numRowOfEmpty);
                };
                console.log("sum ---", sum);
        });

        console.log(sum);

        return sum % 2 === 0
    }
}

function split() {
    let w2 = img.width / 4,
        h2 = img.height / 4;

    for(let i = 0; i < 16; i++) {
      let x = (-w2*i) % (w2*4),
          y = -h2 * Math.floor(i/4);
          console.log('i - ', i);
          console.log('x - ', x);
          console.log('y - ', y);

      canvas.width = w2;
      canvas.height = h2;

      ctx.drawImage(this, x, y, w2*4, h2*4);

      parts.push(canvas.toDataURL());
      

      // for test div
      //let slicedImage = document.createElement('img')
      //slicedImage.src = parts[i];
      //document.body.appendChild( slicedImage );
    }

    for (let i = 0; i < 4; i++) {
        newParts.push(parts[i]);
        newParts.push(parts[i+4]);
        newParts.push(parts[i+8]);
        newParts.push(parts[i+12]);
  }
    
    
  let tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile, i) => {
    console.log( tile );
    //console.log( parts[i] );
    tile.style.backgroundColor = 'transparent';
    tile.style.backgroundImage = `url(${newParts[i]})`;
    tile.style.backgroundSize = 'cover';
  });

 //console.log(parts);

}