export default class Tiles {

    constructor(gameFieldRowQuantity, tilesSize, updateMovesFieldFunc) {

        this.gameFieldRowQuantity = gameFieldRowQuantity;
        this.tilesSize = tilesSize;
        this.updateMovesField = updateMovesFieldFunc;
        this.tilesArr = [];
        this.moveHistory = [];
        this.infoField = null;
    }

    init() {

        this.tilesArr = [];

        this.generateTilesArr();
        this.shuffleTilesArr();

        return this.tilesArr;

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

    generateTilesArr() {

        let numberArr = [];
        let number = 0;
        for (let i = 0; i < this.gameFieldRowQuantity; i++) {
            numberArr = [];
            for (let j = 0; j < this.gameFieldRowQuantity; j++) {
                number = j + i * this.gameFieldRowQuantity + 1;
                number = number > this.gameFieldRowQuantity ** 2 - 1 ? 0 : number;
                numberArr.push(number);
            }
            this.tilesArr.push(numberArr);
        }

    }
    
    shuffleTilesArr() {

        const shuffleSteps = 130;
        let emptyPosition = {};

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
    
            //check possibility to move
            switch (moveDirection) {
                case 1:
                    moveDirection = emptyPosition.top < 1 ? 3 : 1;
                    break;
                case 2:
                    moveDirection = emptyPosition.left >= this.gameFieldRowQuantity - 1 ? 4 : 2;
                    break;
                case 3:
                    moveDirection = emptyPosition.top >= this.gameFieldRowQuantity - 1 ? 1 : 3;
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
        }
        console.log("this.tilesArr - ", this.tilesArr);
        console.log("this.moveHistory - ", this.moveHistory);

    }
}