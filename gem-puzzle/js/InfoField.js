export default class InfoField {
    constructor() {
        
    }

    init() {
        this.startTimer();
        this.updateMovesField();
    }

    updateMovesField(moves = 0) {
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