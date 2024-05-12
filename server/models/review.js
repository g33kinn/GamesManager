const { Schema, model } = require('mongoose');

const Review = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameID: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    text: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    editDate: { type: Date },
    isPositive: { type: Boolean, required: true },
});

module.exports = model('Review', Review);