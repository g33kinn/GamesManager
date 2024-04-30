const { Schema, model } = require('mongoose');

const Role = new Schema({
    RoleName: { type: String, required: true },
});

module.exports = model('Game', Game);