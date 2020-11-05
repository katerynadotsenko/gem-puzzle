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

    saveGame(field, time, moves) {
        const savedGames = this.getSavedGames();
        let game = {
            id: savedGames.length ? savedGames.length : 0,
            field: JSON.stringify(field),
            time: time,
            moves: moves
        };

        savedGames.push(game);
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
    }
}