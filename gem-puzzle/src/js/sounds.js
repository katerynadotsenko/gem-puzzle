const mainSound = new Audio('./assets/sounds/tile-move.mp3');
mainSound.dataset.sound = 'main';

const startGame = new Audio('./assets/sounds/start-game.mp3');
startGame.dataset.sound = 'start-game';

const tickSound = new Audio('./assets/sounds/tick.mp3');
tickSound.dataset.sound = 'tick';

const menuSound = new Audio('./assets/sounds/menu.mp3');
menuSound.dataset.sound = 'menu';

const winSound = new Audio('./assets/sounds/win.mp3');
winSound.dataset.sound = 'win';

const sounds = {
    mainSound: mainSound,
    startGame: startGame,
    tickSound: tickSound,
    menuSound: menuSound,
    winSound: winSound
}

export default sounds;