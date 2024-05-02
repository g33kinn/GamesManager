const { Schema, model } = require('mongoose');

const Review = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    text: { type: String, required: true },
    publicationDate: Date = new Date()
});

module.exports = model('Review', Review);