const { Schema, model } = require('mongoose');

const UserGame = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameID: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
});

module.exports = model('UserGame', UserGame);