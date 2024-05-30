const { handleError } = require('./baseController');

const Genre = require('../models/genre');

const getGenres = (req, res) => {
    Genre
        .find()
        .sort({ name: 1 })
        .then((genres) => {
            if (genres.length === 0) res.status(200).json({ message: 'Нет результатов.'});
            else res.status(200).json(genres);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const addGenres = async (req, res) => {
    const existingGenre = await Genre.findOne({ name: req.body.name });
    if (existingGenre) return res.status(409).json({ message: 'Жанр уже существует.' });

    const genre = new Genre(req.body);
    genre
        .save()
        .then((_) => {
            res.status(201).json({ message: 'Жанр был успешно добавлен.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const updateGenre = async (req, res) => {
    const existingGenre = await Genre.findOne({ name: req.body.name });
    if (existingGenre) return res.status(409).json({ message: 'Жанр уже существует.' });

    

    Genre
        .findOneAndUpdate({ name: req.params.name }, req.body)
        .then((result) => {
            console.log(result);
            if (!result) res.status(404).json({ message: 'Жанр не найден.' });
            else res.status(200).json({ message: 'Жанр был успешно изменен.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteGenre = async (req, res) => {
    const genre = await Genre.findOne({ gameName: req.params.name });
    if (!genre) return res.status(404).json({ message: 'Жанр не найден.' });

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

module.exports = { getGenres, addGenres, updateGenre, deleteGenre };
