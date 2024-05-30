const { handleError } = require('./baseController');
const Game = require('../models/game');
const Review = require('../models/review');
const UserGame = require('../models/userGame');


const getGamesByFilter = (req, res) => {
    const filters = req.query;
    const queryFilters = {};
    if (filters.gameName) queryFilters.gameName = { $regex: filters.gameName, $options: 'i' };
    if (filters.genres) queryFilters.genres = { $all: Array.isArray(filters.genres) ? filters.genres : [filters.genres]};
    if (filters.themes) queryFilters.themes = { $all: Array.isArray(filters.themes) ? filters.themes : [filters.themes]}
    if (filters.developer) queryFilters.developer = { $regex: filters.developer, $options: 'i'};
    
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    Game
        .find(queryFilters)
        .skip(skip)
        .limit(limit)
        .sort({ gameName: 1 })
        .then((games) => {
            if (games.length === 0)  res.status(200).json({ message: 'Нет результатов.'})
            else res.status(200).json(games);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const getGameByName = (req, res) => {
    Game
        .findOne({ gameName: req.params.gameName })
        .then((game) => {
            if (!game) res.status(404).json({ message: 'Игра не найдена.' })
            else res.status(200).json(game);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteGameByName = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: 'Игра не найдена.' });

    let deleteGameMessage = '';

    const reviewResult = await Review.deleteMany({ gameID: game._id })
    if (!reviewResult) deleteGameMessage += 'Отзывы не найдены.';
    else deleteGameMessage += 'Отзывы были успешно удалены.';

    const userGameResult = await UserGame.deleteMany({ gameID: game._id })
    if (!userGameResult) deleteGameMessage += 'Игры из библиотек не найдены.';
    else deleteGameMessage += 'Игры из библиотек были успешно удалены.';

    Game
        .findOneAndDelete({ gameName: req.params.gameName  })
        .then((result) => {
            if (!result) res.status(404).json({ message: deleteGameMessage + 'Игра не найдена.' });
            else res.status(200).json({ message: deleteGameMessage + 'Игра была успешно удалена.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const addGame = async (req, res) => {
    const existingGame = await Game.findOne({ gameName: req.body.gameName });
    if (existingGame) return res.status(409).json({ message: 'Игра уже существует.' });
    
    const game = new Game(req.body);
    game
        .save()
        .then((_) => {
            res.status(201).json({ message: 'Игра была успешно добавлена.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const updateGame = async (req, res) => {
    const existingGame = await Game.findOne({ gameName: req.body.gameName });
    if (existingGame) return res.status(409).json({ message: 'Игра уже существует.' });

    Game
        .findOneAndUpdate({ gameName: req.params.gameName }, req.body)
        .then((result) => {
            console.log(result);
            if (!result) res.status(404).json({ message: 'Игра не найдена.' });
            else res.status(200).json({ message: 'Игра была успешно изменена.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

module.exports = { getGamesByFilter, getGameByName, deleteGameByName, addGame, updateGame };
