const { Schema, model } = require('mongoose');

const Genre = new Schema({
    name: { 
        type: String, 
        unique: true,  
        maxLength: [15, 'Название жанра должно содержать не более 15 символов.'],
        minLength: [3, 'Название жанра должно содержать не менее 3 символов.'],
    },
});

module.exports = model('Genre', Genre);