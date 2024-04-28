const mongoose = require('mongoose');

const dbName = 'GamesManager';

const url = `mongodb://localhost:27017/${dbName}`;

module.exports = {
    connectToDB: () => {
        mongoose
            .connect(url)
            .then(() => console.log('Connected to MongoDB'))
            .catch((err) => console.log(`DB connection error: ${err}`));
    },
    getDB: () => mongoose.connection,
} 

