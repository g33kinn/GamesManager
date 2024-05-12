const { Schema, model } = require('mongoose');

const Game = new Schema({
    gameName: { type: String, required: true, unique: true},
    genres: [String],
    themes: [String],
    developer: { type: String, default: "Unknown" },
    releaseDate: { type: String, required: true },
    minRequirements: {
        OS: { type: String },
        CPU: { type: String },
        RAM: { type: String },
        GPU: { type: String },
        Storage: { type: String },
    }
});

module.exports = model('Game', Game);