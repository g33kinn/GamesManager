const express = require('express');
const libraryRouter = express.Router();
const { getUserLibraryWithFilters, addGameToLibrary, deleteGameFromLibrary } = require('../controllers/libraryController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

//authRouter.use(express.static('../client/user/account/login'));
//authRouter.use(express.static('../client/user/account/register'));
libraryRouter.get('/library', roleMiddleware(['PLAYER']), getUserLibraryWithFilters);
libraryRouter.delete('/library/:gameName', roleMiddleware(['PLAYER']), deleteGameFromLibrary);
libraryRouter.post('/library', roleMiddleware(['PLAYER']), addGameToLibrary);

module.exports = libraryRouter;