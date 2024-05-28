const express = require('express');
const gamesRouter = express.Router();
const { getGamesByFilter, getGameByName, deleteGameByName, addGame, updateGame } = require('../controllers/gameController.js');
const { pathJoin } = require('../utils/pathHelper.js');
const roleMiddleware = require('../middleware/roleMiddleware');

gamesRouter.get('/', (req, res) => res.redirect('/catalog'));
gamesRouter.get('/catalog', (req, res) => { res.sendFile(pathJoin('/client/catalog/catalog.html')); });
gamesRouter.get('/catalog/:gameName', (req, res) => { res.sendFile(pathJoin('/client/gamePage/gamePage.html')); });

gamesRouter.get('/games', getGamesByFilter);
gamesRouter.get('/games/:gameName', getGameByName);
gamesRouter.delete('/games/:gameName', roleMiddleware(['CMANAGER']), deleteGameByName);
gamesRouter.post('/games', roleMiddleware(['ADMIN']), addGame);
gamesRouter.patch('/games/:gameName', roleMiddleware(['CMANAGER']), updateGame);

module.exports = gamesRouter;