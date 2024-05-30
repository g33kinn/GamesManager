const express = require('express');
const { pathJoin } = require('../utils/pathHelper.js');
const themesRouter = express.Router();
const { getThemes } = require('../controllers/themeController.js');

//genresRouter.post('/registration', registration);
themesRouter.get('/themes',  getThemes);
// genresRouter.post('/login', login);
// authRouter.get('/login', checkIfAuth, (req, res) => { res.sendFile(pathJoin('/client/login/login.html')); });
// authRouter.get('/logout', logout);

module.exports = themesRouter;