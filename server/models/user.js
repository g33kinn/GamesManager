const { Schema, model } = require('mongoose');

const User = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role'}
});

module.exports = model('User', User);