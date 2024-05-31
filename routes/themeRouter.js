const express = require('express');
const themesRouter = express.Router();
const { getThemes, addTheme, updateTheme, deleteTheme} = require('../controllers/themeController.js');
const roleMiddleware = require('../middleware/roleMiddleware');

themesRouter.get('/themes',  getThemes);
themesRouter.post('/themes', roleMiddleware(['CMANAGER']), addTheme);
themesRouter.patch('/themes/:themeName', roleMiddleware(['CMANAGER']), updateTheme);
themesRouter.delete('/themes/:themeName', roleMiddleware(['CMANAGER']), deleteTheme);

module.exports = themesRouter;