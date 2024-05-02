const express = require('express');
const gamesRouter = express.Router();
const { getGames, getGameByName } = require('../controllers/gameController.js')

gamesRouter.use(express.static('../client/user/games/catalog'));
gamesRouter.use(express.static('../client/user/games/gamePage'));
gamesRouter.get('/', (req, res) => res.redirect('/catalog'));
gamesRouter.get('/catalog', getGames);
gamesRouter.get('/catalog/gamePage', getGameByName);

module.exports = gamesRouter;