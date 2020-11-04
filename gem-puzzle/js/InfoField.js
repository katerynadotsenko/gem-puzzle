export default class InfoField {
    constructor() {
        this.time = 1;
        this.timer = null;
    }

    init() {
        this.startTimer();
        this.updateMovesField();

        const infoMenu = document.querySelector('.info__menu-button');
        infoMenu.addEventListener('click', (e) => {
            this.toggleMenu(e.target);
        })
    }

    toggleMenu(infoMenu) {
        const info = document.querySelector('.info');
        info.classList.toggle('active');
        if (/active/.test(info.classList)) {
            infoMenu.innerText = 'Resume game';
            this.pauseTimer();
        } else {
            infoMenu.innerText = 'Pause game';
            this.startTimer()
        }
    }

    updateMovesField(moves = 0) {
        const movesField = document.querySelector('.info__moves').lastElementChild;
        movesField.innerText = moves;
    }

    startTimer() {
        const timerElement = document.querySelector('.info__time').lastElementChild;

        let hours = 0,
            minutes = 0,
            seconds = 0;

        this.timer = setInterval(() => {
            hours = Math.trunc(this.time/60/60%60);
            minutes = Math.trunc(this.time/60%60);
            seconds = this.time%60;
            timerElement.innerText = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
            this.time++;
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timer);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.time = 1;
    }

}