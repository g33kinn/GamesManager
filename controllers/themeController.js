const { handleError } = require('./baseController');

const Theme = require('../models/theme');
const Game = require('../models/game');

const getThemes = (req, res) => {
    Theme
        .find()
        .sort({ name: 1 })
        .then((themes) => {
            if (themes.length === 0) res.status(200).json({ message: 'Нет результатов.'})
            else res.status(200).json(themes);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};


const addTheme = async (req, res) => {
    const existingTheme = await Theme.findOne({ name: req.body.name });
    if (existingTheme) return res.status(409).json({ message: 'Тематика уже существует.' });

    const theme = new Theme(req.body);
    theme
        .save()
        .then((result) => {
            res.status(201).json({ message: 'Тематика была успешно добавлена.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const updateTheme = async (req, res) => {
    const existingTheme = await Theme.findOne({ name: req.body.name });
    if (existingTheme) return res.status(409).json({ message: 'Тематика уже существует.' });

    await Game.updateMany(
        { themes: req.params.themeName },
        { $set: { 'themes.$': req.body.name } }
    );
    Theme
        .findOneAndUpdate({ name: req.params.themeName }, req.body)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Тематика не найдена.' });
            else res.status(200).json({ message: 'Тематика была успешно изменена.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteTheme = async (req, res) => {
    const theme = await Theme.findOne({ name: req.params.themeName });
    if (!theme) return res.status(404).json({ message: 'Тематика не найдена.' });

    await Game.updateMany(
        { themes: req.params.themeName },
        { $pull: { themeName: req.params.themeName } }
    );

    Theme
        .deleteOne({ name: req.params.themeName  })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Тематика не найдена' });
            else res.status(200).json({ message: 'Тематика удалена' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

module.exports = { getThemes, addTheme, updateTheme, deleteTheme };
