const { Schema, model } = require('mongoose');

const User = new Schema({
    Login: { type: String, required: true },
    Password: { type: String, required: true },
    Role: { type: Role, required},
    Email: { type}
});

module.exports = model('Game', Game);