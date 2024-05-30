const express = require('express');
const { pathJoin } = require('../utils/pathHelper.js');
const genresRouter = express.Router();
const { getGenres, addGenres, updateGenres, deleteGenres } = require('../controllers/genreController.js');
const roleMiddleware = require('../middleware/roleMiddleware');

genresRouter.get('/genresThemesManagement', roleMiddleware(['CMANAGER']), (req, res) => { res.sendFile(pathJoin('/client/genresThemesManagement/genresThemesManagement.html')); });

genresRouter.get('/genres',  getGenres);
// genresRouter.post('/genres', roleMiddleware(['CMANAGER']), addGenres);
// genresRouter.patch('/genres', roleMiddleware(['CMANAGER']), updateGenres);
// genresRouter.delete('/genres', roleMiddleware(['CMANAGER']), deleteGenres);

module.exports = genresRouter;