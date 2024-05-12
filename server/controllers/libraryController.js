const { handleError } = require('./baseController');
const UserGame = require('../models/userGame');
const Game = require('../models/game');

const getUserLibraryWithFilters = async (req, res) => {
    const library = await UserGame.find({ userID: req.userID }).populate('gameID');
    
    if(library.length === 0) return res.status(200).json({ message: 'Библиотека пуста.'});
    else return res.status(200).json(library.map(elem => elem.gameID));
};

const deleteGameFromLibrary = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена` });

    UserGame
        .findOneAndDelete({ userID: req.userID, gameID: game._id })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Игра в библиотеке не найдена.' });
            else res.status(200).json({ message: 'Игра из библиотеки была успешно удалена.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}

const addGameToLibrary = async (req, res) => {
    const game = await Game.findOne({ gameName: req.body.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.body.gameName} не найдена` });

    const existingUserGame = await UserGame.findOne({ userID: req.userID, gameID: game._id });
    if (existingUserGame) return res.status(409).json({ message: `Игра уже в библиотеке.` });

    const userGame = new UserGame({
        "userID": req.userID,
        "gameID": game._id
    });
    userGame
        .save()
        .then((_) => {
            res.status(201).json({ message: 'Игра был успешна добавлена в библиотеку.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}

module.exports = { getUserLibraryWithFilters, addGameToLibrary, deleteGameFromLibrary };