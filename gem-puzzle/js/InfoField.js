export default class InfoField {
    constructor() {
        this.time = 1;
        this.timer = null;
        this.moves = 1;
    }

    init() {
        this.startTimer();
        this.updateMovesField();

        const infoMenu = document.querySelector('.info__menu-button');
        infoMenu.addEventListener('click', (e) => {
            this.toggleMenu(e.target);
        });


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

    updateTimerField(time) {
        const timerElement = document.querySelector('.info__time').lastElementChild;
        timerElement.innerText = this.createTime(time);
    }

    createTime(time) {
        const hours = Math.trunc(time/60/60%60),
            minutes = Math.trunc(time/60%60),
            seconds = time%60;

        return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
        
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.updateTimerField(this.time);
            this.time++;
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timer);
    }

    stopTimer(time = 1) {
        clearInterval(this.timer);
        this.time = time;
        this.updateTimerField(time);
    }

}