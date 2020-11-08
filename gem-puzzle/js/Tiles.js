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

    init(gameFieldRowQuantity, tilesSize, isImage) {
        this.tilesSize = tilesSize;
        this.tilesArr = [];

        this.generateTilesArr(gameFieldRowQuantity);
        this.shuffleTilesArr(gameFieldRowQuantity);
        this.loadTiles(gameFieldRowQuantity, this.tilesArr, tilesSize);
        if (isImage) {
            this.generateImageToTiles(gameFieldRowQuantity);
        };

        return this.tilesArr;

    }

    loadTiles(gameFieldRowQuantity, tilesArr, tilesSize) {
        console.log(tilesArr);
        this.tileView.renderTilesToDom(gameFieldRowQuantity, tilesArr, tilesSize);
    }

   /* async autocompleteGame(tilesArr) {
        this.tilesArr = tilesArr;

        const tilesQuantity = this.tilesArr.length ** 2 ;
        console.log('tilesQuantity - ', tilesQuantity);

        let emptyTilePos = {
            top: null,
            left: null
        };

        let activeTilePos = {
            top: null,
            left: null
        };

        

        
        this.tilesArr.forEach((rowArr, row) => {
            rowArr.forEach((num, col) => {
                if (num == 0) {
                    emptyTilePos.top = row;
                    emptyTilePos.left = col;
                };
            });
        });


        for (let i = 1; i < tilesQuantity; i++) {
            for (let j = 0; j < this.tilesArr.length; j++) {
                for (let k = 0; k < this.tilesArr[j].length; k++) {
                    if (this.tilesArr[j][k] == i) {
                        activeTilePos.top = j;
                        activeTilePos.left = k;

                        if (this.tilesArr[j][k] == 1) {
                            await this.moveTileToItPosition(activeTilePos, emptyTilePos);
                            console.log("next");
                        }
                    };
                }
            }
        }

    }

    async moveTileToItPosition(activeTilePos, emptyTilePos) {
        console.log("start");
        let tileCompletePosition = {
            top: 0,
            left: 0
        };

        let tileToExchPos = {
            top: null,
            left: null
        };


        console.log('activeTilePos.top - ', activeTilePos.top);
        console.log('activeTilePos.left - ', activeTilePos.left);
            while (activeTilePos.top != tileCompletePosition.top && activeTilePos.left != tileCompletePosition.left) {

                console.log('vertical movement');
                while (emptyTilePos.top != activeTilePos.top - 1) {
                    if (emptyTilePos.top > activeTilePos.top - 1) {
                        if (emptyTilePos.top - 1 < 0) {
                            break;
                        }
                        tileToExchPos.top = emptyTilePos.top - 1;
                        tileToExchPos.left = emptyTilePos.left;
                        emptyTilePos.top = emptyTilePos.top - 1;
                    } else {
                        tileToExchPos.top = emptyTilePos.top + 1;
                        tileToExchPos.left = emptyTilePos.left;
                        emptyTilePos.top = emptyTilePos.top + 1;
                    };
                    console.log('tileToExchPos.top - ', tileToExchPos.top);
                    console.log('tileToExchPos.left - ', tileToExchPos.left);

                    if (tileToExchPos.top == activeTilePos.top && tileToExchPos.left == activeTilePos.left) break;

                    const tile = document.querySelector(`[data-key="${this.tilesArr[tileToExchPos.top][tileToExchPos.left]}"]`);
                    console.log("tile to exch - ", tile);
                
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.moveTile(tile, true, true);
                            resolve();
                        }, 500);
                    });  
                };
            
                console.log('activeTilePos.top - ', activeTilePos.top);
                console.log('activeTilePos.left - ', activeTilePos.left);

            console.log('horizontal movement');
            console.log(`${activeTilePos.top}==${tileCompletePosition.top}`);
            console.log(`${emptyTilePos.top}==${activeTilePos.top - 1}`);
            console.log('horizontal movement');
                if (activeTilePos.top == tileCompletePosition.top && emptyTilePos.top == activeTilePos.top - 1) {
                    //move empty to left
                    console.log("works!!!");
                    while (emptyTilePos.left != tileCompletePosition.left) {
                        if (emptyTilePos.left > tileCompletePosition.left) {
                            tileToExchPos.top = emptyTilePos.top;
                            tileToExchPos.left = emptyTilePos.left - 1;
                            emptyTilePos.left = emptyTilePos.left - 1;
                        } else {
                            tileToExchPos.top = emptyTilePos.top;
                            tileToExchPos.left = emptyTilePos.left + 1;
                            emptyTilePos.left = emptyTilePos.left + 1;
                        };

                        const tile = document.querySelector(`[data-key="${this.tilesArr[tileToExchPos.top][tileToExchPos.left]}"]`);
                        console.log("tile to exch - ", tile);
                    
                        await new Promise(resolve => {
                            setTimeout(() => {
                                this.moveTile(tile, true, true);
                                resolve();
                            }, 500);
                        }); 
                    }
                }

                while (emptyTilePos.left != activeTilePos.left) {
                    if (emptyTilePos.left > activeTilePos.left) {
                        tileToExchPos.top = emptyTilePos.top;
                        tileToExchPos.left = emptyTilePos.left - 1;
                        emptyTilePos.left = emptyTilePos.left - 1;
                    } else {
                        tileToExchPos.top = emptyTilePos.top;
                        tileToExchPos.left = emptyTilePos.left + 1;
                        emptyTilePos.left = emptyTilePos.left + 1;
                    };
                    console.log('tileToExchPos.top - ', tileToExchPos.top);
                    console.log('tileToExchPos.left - ', tileToExchPos.left);

                    if (tileToExchPos.top == activeTilePos.top && tileToExchPos.left == activeTilePos.left) {
                        console.log('exit');
                        break;
                    };

                    const tile = document.querySelector(`[data-key="${this.tilesArr[tileToExchPos.top][tileToExchPos.left]}"]`);
                    console.log("tile to exch - ", tile);
                
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.moveTile(tile, true, true);
                            resolve();
                        }, 500);
                    });  
                };

                if (emptyTilePos.top + 1 == activeTilePos.top && emptyTilePos.left == activeTilePos.left) {
                    console.log("its ok");
                } else {
                    console.log("check");
                };
                console.log(`${activeTilePos.top} --- ${emptyTilePos.top + 1}`);

                //move tile to top
                if (tileCompletePosition.top < activeTilePos.top && activeTilePos.top == emptyTilePos.top + 1) {
                    const tile = document.querySelector(`[data-key="${this.tilesArr[activeTilePos.top][activeTilePos.left]}"]`);
                    let activeTop = activeTilePos.top;
                    let activeLeft = activeTilePos.left;
                    activeTilePos.top = emptyTilePos.top;
                    activeTilePos.left = emptyTilePos.left;
                    emptyTilePos.top = activeTop;
                    emptyTilePos.left = activeLeft;
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.moveTile(tile, true, true);
                            resolve();
                        }, 500);
                    }); 
                };

                //move tile to left
                if (tileCompletePosition.left < activeTilePos.left && activeTilePos.left == emptyTilePos.left + 1) {
                    const tile = document.querySelector(`[data-key="${this.tilesArr[activeTilePos.top][activeTilePos.left]}"]`);
                    let activeTop = activeTilePos.top;
                    let activeLeft = activeTilePos.left;
                    activeTilePos.top = emptyTilePos.top;
                    activeTilePos.left = emptyTilePos.left;
                    emptyTilePos.top = activeTop;
                    emptyTilePos.left = activeLeft;
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.moveTile(tile, true, true);
                            resolve();
                        }, 500);
                    }); 
                }

            }
            
            
    }*/



    clearTilesFromImage() {
        const tiles = document.querySelectorAll('.tile');
        let tileNumber = 0;
        tiles.forEach((tile) => {
            tileNumber = Number(tile.dataset.key);
            if (tileNumber > 0) {
                tile.style.backgroundImage = `url('../images/tile-img.jpg')`;
                tile.style.backgroundSize = 'none';
                tile.style.color = 'rgba(48, 28, 12, 0.7)';
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
                tile.style.zIndex = 4;
            };

            function enterDroppable(elem) {
                //elem.style.background = 'pink';
                isTileNeededToMove = true;
            }
          
            function leaveDroppable(elem) {
                //elem.style.background = 'transparent';
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

        //TODO check bugs if use drag & drop
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
            shuffleSteps = 130;
        } else {
            shuffleSteps = gameFieldRowQuantity ** 2 * 70;
        }
    
        console.log("shuffleSteps - ", shuffleSteps);
        let emptyPosition = {};
        let prevStep = null;

       this.tilesArr.forEach((array, top) => {
            array.forEach((item, left) => {
                if (item == 0) {
                    emptyPosition.top = top;
                    emptyPosition.left = left;
                };
            });
        });

        let moveDirection = 1;
    
        for (let i = 0; i < shuffleSteps; i++) {
    
            //generate move direction: 1 - top, 2 - right, 3 - bottom, 4 - left
            moveDirection = Math.floor(Math.random() * 4) + 1;
            
            //check direction to prevent repeated steps
            
            if ((prevStep == 1 && moveDirection == 3) || (prevStep == 3 && moveDirection == 1)) {
                moveDirection = emptyPosition.left < 1 ? 4 : 2;
            } else if ((prevStep == 2 && moveDirection == 4) || (prevStep == 4 && moveDirection == 2)) {
                moveDirection = emptyPosition.top < 1 ? 3 : 1;
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
        
        
        console.log("this.tilesArr - ", this.tilesArr);
        console.log("this.moveHistory - ", this.moveHistory);

        //console.log('isHasSolution - ', this.isHasSolution());

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
                };
            });
        });

//this.moveHistory.length - 1
        for (let step = this.moveHistory.length-1; step >= -1; step--) {
            
            moveDirection = this.moveHistory[step];

            activeTileTop = emptyPosition.top;
            activeTileLeft = emptyPosition.left;


            switch (moveDirection) {
                case 1:
                    emptyPosition.top = emptyPosition.top + 1;
                    break;
                case 2:
                    
                    emptyPosition.left = emptyPosition.left - 1;
                    break;
                case 3:
                    
                    emptyPosition.top = emptyPosition.top - 1;
                    break;
                case 4:
                   
                    emptyPosition.left = emptyPosition.left + 1;
                    break;
            }

            console.log(`${step} --- ${activeTileTop}-${activeTileLeft}`);

            if (step === -1) {
                tile = document.querySelector(`[data-key="${this.tilesArr[this.tilesArr.length-1][this.tilesArr.length-1]}"]`);
            } else {
                tile = document.querySelector(`[data-key="${this.tilesArr[activeTileTop][activeTileLeft]}"]`);
            }

            await new Promise(resolve => {
                setTimeout(async () => {
                    await this.moveTile(tile, true, true);
                    resolve();
                }, 120);
            });
            
        }

        console.log("autocomplete -> ", this.tilesArr);

        
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

