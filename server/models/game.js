const { Schema, model } = require('mongoose');

const Game = new Schema({
    name: { type: String, required: true, unique: true},
    releaseDate: { type: Date, required: true },
    genres: [String],
    setting: { type: String, required: true },
    requirements: { type: String }
});

module.exports = model('Game', Game);