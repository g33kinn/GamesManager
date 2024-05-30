const express = require('express');
const libraryRouter = express.Router();
const { pathJoin } = require('../utils/pathHelper.js');
const { getUserLibraryWithFilters, getUserGameByName, addGameToLibrary, deleteGameFromLibrary } = require('../controllers/libraryController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

libraryRouter.get('/library', roleMiddleware(['PLAYER']), (req, res) => { res.sendFile(pathJoin('/client/library/library.html')); });

libraryRouter.get('/libraryGames', roleMiddleware(['PLAYER']), getUserLibraryWithFilters);
libraryRouter.get('/libraryGames/:gameName', roleMiddleware(['PLAYER']), getUserGameByName);
libraryRouter.delete('/libraryGames/:gameName', roleMiddleware(['PLAYER']), deleteGameFromLibrary);
libraryRouter.post('/libraryGames', roleMiddleware(['PLAYER']), addGameToLibrary);

module.exports = libraryRouter;