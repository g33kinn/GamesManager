const express = require('express');
const path = require('path');
const gamesRouter = require('./routes/gamesRoutes.js');
const authRouter = require('./routes/authRoutes.js');

const PORT = 3000;
const { connectToDB } = require('./db.js');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    next();
});

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static('D:/Programming/Web/GamesManager/GamesManager/client/user/games/library'));
app.use(express.static('D:/Programming/Web/GamesManager/GamesManager/client/user/account/profile'));
app.use(express.static('D:/Programming/Web/GamesManager/GamesManager/client/user'));
app.use(gamesRouter);
app.use(authRouter);

app.get('/library', (req, res) => {
    res.sendFile('D:/Programming/Web/GamesManager/GamesManager/client/user/games/library/library.html');
});

app.get('/profile', (req, res) => {
    res.sendFile('D:/Programming/Web/GamesManager/GamesManager/client/user/account/profile/profile.html');
});

app.use((req, res) => {
    res.send('Error: 404<br>Page not found');
});

(async () => {
    try {
        await connectToDB();
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
})();
