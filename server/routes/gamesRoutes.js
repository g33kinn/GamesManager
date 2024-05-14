const express = require('express');
const gamesRouter = express.Router();
const { getGamesByFilter, getGameByName, deleteGameByName, addGame, updateGame } = require('../controllers/gameController.js');
const roleMiddleware = require('../middleware/roleMiddleware');

//gamesRouter.use(express.static('../client/user/games/catalog'));
//gamesRouter.use(express.static('../client/user/games/gamePage'));
gamesRouter.get('/', (req, res) => res.redirect('/catalog'));
gamesRouter.get('/catalog', getGamesByFilter);
gamesRouter.get('/catalog/:gameName', getGameByName);
gamesRouter.delete('/catalog/:gameName', roleMiddleware(['CMANAGER']), deleteGameByName);
gamesRouter.post('/catalog', roleMiddleware(['ADMIN']), addGame);
gamesRouter.patch('/catalog/:gameName', roleMiddleware(['CMANAGER']), updateGame);

module.exports = gamesRouter;