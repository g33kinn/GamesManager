const { Schema, model } = require('mongoose');

const Game = new Schema({
    Name: { type: String, required: true },
    ReleaseDate: { type: Date, required: true },
    Genre: [String],
    Setting: { type: String, required: true },
    Review: [{ UserName: String, Text: String }],
});

module.exports = model('Game', Game);