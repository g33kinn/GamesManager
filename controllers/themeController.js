const { handleError } = require('./baseController');

const Theme = require('../models/theme');

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

module.exports = { getThemes };