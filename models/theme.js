const { Schema, model } = require('mongoose');

const Theme = new Schema({
    name: { type: String, unique: true },
});

module.exports = model('Theme', Theme);