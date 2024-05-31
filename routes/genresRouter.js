const express = require('express');
const { pathJoin } = require('../utils/pathHelper.js');
const genresRouter = express.Router();
const { getGenres, addGenre, updateGenre, deleteGenre } = require('../controllers/genreController.js');
const roleMiddleware = require('../middleware/roleMiddleware');

genresRouter.get('/genresThemesManagement', roleMiddleware(['CMANAGER']), (req, res) => { res.sendFile(pathJoin('/client/genresThemesManagement/genresThemesManagement.html')); });

genresRouter.get('/genres',  getGenres);
genresRouter.post('/genres', roleMiddleware(['CMANAGER']), addGenre);
genresRouter.patch('/genres/:genreName', roleMiddleware(['CMANAGER']), updateGenre);
genresRouter.delete('/genres/:genreName', roleMiddleware(['CMANAGER']), deleteGenre);

module.exports = genresRouter;