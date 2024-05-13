const { handleError } = require('./baseController');
const Game = require('../models/game');
const path = require('path');

const getGamesByFilter = (req, res) => {
    const filters = req.query;

    const queryFilters = {};
    if (filters.genres) queryFilters.genres = { $all: Array.isArray(filters.genres) ? filters.genres : [filters.genres]};
    if (filters.themes) queryFilters.themes = { $all: Array.isArray(filters.themes) ? filters.themes : [filters.themes]}
    if (filters.developer) queryFilters.developer = { $regex: filters.developer, $options: 'i'};

    Game
        .find(queryFilters)
        .sort({ gameName: 1 })
        .then((games) => {
            if (games.length === 0)  res.status(200).json({ message: 'Каталог пуст.'})
            else res.status(200).json(games);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
    //res.sendFile(path.join(__dirname, '../../client/user/games/catalog/catalog.html'));
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

const deleteGameByName = (req, res) => {
    Game
        .findOneAndDelete({ gameName: req.params.gameName })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Игра не найдена.' });
            else res.status(200).json({ message: 'Игра была успешно удалена.' });
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

const updateGame = (req, res) => {
    Game
        .findOneAndUpdate({ gameName: req.params.gameName }, req.body)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Игра не найдена.' });
            else res.status(200).json({ message: 'Игра была успешно изменена.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

module.exports = { getGamesByFilter, getGameByName, deleteGameByName, addGame, updateGame };