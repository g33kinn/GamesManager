const { Schema, model } = require('mongoose');

const Game = new Schema({
    gameName: { type: String, required: true, unique: true},
    imageCat: { 
        type: String
        //, required: true 
    },
    imagePage: { type: String
        //, required: true 
    },
    imageLib: { type: String
        //, required: true 
    },
    description: { type: String, required: true },
    genres: [ { type: String, ref: 'Genre' } ],
    themes: [ { type: String, ref: 'Theme' } ],
    developer: { type: String, default: "Unknown" },
    releaseDate: { type: String, default: "Unknown" }
});

module.exports = model('Game', Game);