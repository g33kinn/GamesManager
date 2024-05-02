const Game = require('../models/game');
const path = require('path');

const getGames = (req, res) => {
    // Game
    //     .find()
    //     .sort({ Name: 1 })
    //     .then((Games) => {
    //         res
    //             .status(200)
    //             .json()
    //     })
    res.sendFile(path.join(__dirname, '../../client/user/games/catalog/catalog.html'));
};

const getGameByName = (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/user/games/gamePage/gamePage.html'));
}

module.exports = { getGames, getGameByName };