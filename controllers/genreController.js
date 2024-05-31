const { handleError } = require('./baseController');

const Genre = require('../models/genre');
const Game = require('../models/game');

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

const addGenre = async (req, res) => {
    const existingGenre = await Genre.findOne({ name: req.body.name });
    console.log(existingGenre);
    if (existingGenre) return res.status(409).json({ message: 'Жанр уже существует.' });

    const genre = new Genre(req.body);
    genre
        .save()
        .then((result) => {
            console.log(result);
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

    await Game.updateMany(
        { genres: req.params.genreName },
        { $set: { 'genres.$': req.body.name } }
    );
    Genre
        .findOneAndUpdate({ name: req.params.genreName }, req.body)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Жанр не найден.' });
            else res.status(200).json({ message: 'Жанр был успешно изменен.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteGenre = async (req, res) => {
    const genre = await Genre.findOne({ name: req.params.genreName });
    if (!genre) return res.status(404).json({ message: 'Жанр не найден.' });

    await Game.updateMany(
        { genres: req.params.genreName },
        { $pull: { genres: req.params.genreName } }
    );

    Genre
        .deleteOne({ name: req.params.genreName  })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Жанр не найден' });
            else res.status(200).json({ message: 'Жанр удален' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

module.exports = { getGenres, addGenre, updateGenre, deleteGenre };
