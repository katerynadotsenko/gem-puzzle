import GameFieldView from './GameFieldView.js';
import Tiles from './Tiles.js';
import InfoField from './InfoField.js';


window.onload = () => {
    
    let gameFieldRowQuantity = 4,
        tilesSize = 100,
        tilesArr = [],
        savedGames = JSON.parse(localStorage.getItem('savedGames')) || [],
        isWin = false;

        console.log('savedGames - ', savedGames);

    const tiles = new Tiles(gameFieldRowQuantity, tilesSize, () => {
        infoField.updateMovesField(infoField.moves++);
    }, () => {
        checkIsWin();
    });

    function checkIsWin() {
        isWin = '1234567891011121314150' === tiles.tilesArr.map(arr => arr.join('')).join('');
        console.log(tiles.tilesArr.map(arr => arr.join('')).join(''));
        console.log("isWin - ", isWin);
        if (isWin) {
            document.querySelector('.win__time').textContent = document.querySelector('.info__time').lastElementChild.textContent;
            document.querySelector('.win__moves').textContent = document.querySelector('.info__moves').lastElementChild.textContent;
            
            const menuWin = document.querySelector('.menu__win');
            infoField.toggleMenu(infoMenu);
            const menu = document.querySelector('.menu');
            menu.childNodes.forEach(item => {
                item.classList.remove('menu_active');
                item.classList.add('menu_hidden');
            });
           
            menuWin.classList.toggle('menu_active');
            menuWin.classList.toggle('menu_hidden');
        }
    }

    tilesArr = tiles.init();

    const gameFieldView = new GameFieldView(gameFieldRowQuantity, tilesSize);
    gameFieldView.init();
    gameFieldView.renderTilesToGameField(tilesArr);


    bindTileListeners();

    const infoField = new InfoField();
    infoField.init();

    const infoMenu = document.querySelector('.info__menu-button');
    const menuItems = document.querySelector('.menu__list').querySelectorAll('li');

    

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            switch (item.id) {
                case 'save':
                    console.log('save');
                    console.log('tilesArr - ', tiles.tilesArr);

                    let game = {
                        id: savedGames.length ? savedGames.length : 0,
                        field: JSON.stringify(tiles.tilesArr),
                        time: infoField.time,
                        moves: infoField.moves
                    };

                    savedGames.push(game);

                    localStorage.setItem('savedGames', JSON.stringify(savedGames));

                break;
                case 'new-game':
                    infoField.stopTimer();
                    infoField.moves = 1;
                    infoField.updateMovesField(0);
                    infoField.toggleMenu(infoMenu);
                    tilesArr = tiles.init();
                    gameFieldView.clearGameField()
                    gameFieldView.renderTilesToGameField(tilesArr);
                    bindTileListeners();
                    console.log('new-game');
                break;
                case 'saved-games':
                    console.log('saved-games');
                    savedGames = JSON.parse(localStorage.getItem('savedGames'));
                    console.log('savedGames - ', savedGames);
                    const menuList = document.querySelector('.menu__list');
                    const menuSavedGames = document.querySelector('.menu__saved-games');
                    menuList.classList.toggle('menu_active');
                    menuList.classList.toggle('menu_hidden');
                    menuSavedGames.classList.toggle('menu_active');
                    menuSavedGames.classList.toggle('menu_hidden');

                    savedGames.forEach(game => {
                        let savedGame = document.createElement('div');
                        savedGame.innerHTML = `<span>Field size: </span>${JSON.parse(game.field).length}x${JSON.parse(game.field).length}</span><br>
                                                <span>${game.field}</span><br>
                                                <span>Time: </span><span>${game.time}</span><br>
                                                <span>Moves: </span><span>${game.moves}</span><br>
                                                <button class="menu__button-load" id="${game.id}">Load game</button>`;
                        menuSavedGames.append(savedGame);
                    });

                    const menuButtonsLoad = document.querySelectorAll('.menu__button-load');
                    menuButtonsLoad.forEach(button => {
                        button.addEventListener('click', () => {
                            
                            for (let i = 0; i < savedGames.length; i++) {
                              
                                if (savedGames[i].id == button.id) {
                                    //infoField.stopTimer();
                                    infoField.moves = savedGames[i].moves+1;
                                    infoField.updateMovesField(savedGames[i].moves);
                                    //infoField.toggleMenu(infoMenu);
                                    gameFieldView.clearGameField();
                                    tiles.tilesArr = JSON.parse(savedGames[i].field);
                                    gameFieldView.renderTilesToGameField(tiles.tilesArr);
                                    bindTileListeners();
                                }
                            }
                            console.log('click');
                        });
                    });


                break;
                case 'settings':
                    console.log('settings')
                break;
                default:
                break;
            }
        });
    });


    function bindTileListeners() {
        const tilesElementsArr = document.querySelectorAll('[data-key]');
        tilesElementsArr.forEach(tile => {
            tiles.bindTileListeners(tile);
        });
    }
     
}

