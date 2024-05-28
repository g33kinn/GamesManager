const { Schema, model } = require('mongoose');

const User = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role'}],
    email: { type: String, required: true, unique: true},
    phoneNumber: { type: String, required: true, unique: true },
    behaviourIndex: { type: Number, default: 5 },
    accountStatus: { type: String, default: "Active" }
});

module.exports = model('User', User);