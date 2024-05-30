const express = require('express');
const gamesRouter = express.Router();
const { getGamesByFilter, getGameByName, deleteGameByName, addGame, updateGame } = require('../controllers/gameController.js');
const { checkIfGuestOrRole } = require('../controllers/baseController.js');
const { pathJoin } = require('../utils/pathHelper.js');
const roleMiddleware = require('../middleware/roleMiddleware');

gamesRouter.get('/catalog', checkIfGuestOrRole(['PLAYER']), (req, res) => { res.sendFile(pathJoin('/client/catalog/catalog.html')); });
gamesRouter.get('/catalog/:gameName', checkIfGuestOrRole(['PLAYER']), (req, res) => { res.sendFile(pathJoin('/client/gamePage/gamePage.html')); });

gamesRouter.get('/catalogManagement', roleMiddleware(['CMANAGER']), (req, res) => { res.sendFile(pathJoin('/client/catalogManagement/catalogManagement.html')); });

gamesRouter.get('/games', checkIfGuestOrRole(['PLAYER','CMANAGER']), getGamesByFilter);
gamesRouter.get('/games/:gameName', checkIfGuestOrRole(['PLAYER','CMANAGER']), getGameByName);
gamesRouter.delete('/games/:gameName', roleMiddleware(['CMANAGER']), deleteGameByName);
gamesRouter.post('/games', roleMiddleware(['CMANAGER']), addGame);
gamesRouter.patch('/games/:gameName', roleMiddleware(['CMANAGER']), updateGame);

module.exports = gamesRouter;