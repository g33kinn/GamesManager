const express = require('express');
const libraryRouter = express.Router();
const { pathJoin } = require('../utils/pathHelper.js');
const { checkIfNotAuth } = require('../controllers/baseController.js');
const { getUserLibraryWithFilters, addGameToLibrary, deleteGameFromLibrary } = require('../controllers/libraryController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

libraryRouter.get('/library', checkIfNotAuth, (req, res) => { res.sendFile(pathJoin('/client/library/library.html')); });

libraryRouter.get('/libraryGames', roleMiddleware(['PLAYER']), getUserLibraryWithFilters);
libraryRouter.delete('/libraryGames/:gameName', roleMiddleware(['PLAYER']), deleteGameFromLibrary);
libraryRouter.post('/libraryGames', roleMiddleware(['PLAYER']), addGameToLibrary);

module.exports = libraryRouter;