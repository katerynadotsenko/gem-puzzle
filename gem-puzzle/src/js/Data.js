export default class Data {
    constructor() {
        
    }

    getSavedGames() {
        const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
        return savedGames;
    }

    getSavedGame(id) {
        const savedGames = JSON.parse(localStorage.getItem('savedGames'));
        return savedGames.filter(game => game.id == id);
    }

    saveGame(field, time, moves, imgNum) {
        const savedGames = this.getSavedGames();
        let game = {
            id: savedGames.length ? savedGames.length : 0,
            field: JSON.stringify(field),
            time: time,
            moves: moves,
            imgNum: imgNum
        };

        savedGames.push(game);
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
    }

    getBestScores() {
        const bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
        return bestScores.slice(0, 10);
    }

    saveBestScore(date, moves, size, time) {
        const bestScores = this.getBestScores();
        let bestScore = {
            date: date,
            moves: moves,
            size: `${size}x${size}`,
            time: time
        };

        bestScores.push(bestScore);
        bestScores.sort((a, b) => a.time - b.time);
        bestScores.sort((a, b) => a.moves - b.moves);
        bestScores.slice(0, 10);

        localStorage.setItem('bestScores', JSON.stringify(bestScores));
    }
}