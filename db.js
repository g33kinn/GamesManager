const mongoose = require('mongoose');

const dbName = 'GamesManagerDB';

const url = `mongodb://localhost:27017/${dbName}`;

module.exports = {
    connectToDB: async () => {
        try {
            await mongoose.connect(url);
            console.log('Connected to MongoDB');
        } catch (err) { console.log(`DB connection error: ${err}`)}
    },
    getDB: () => mongoose.connection,
} 
