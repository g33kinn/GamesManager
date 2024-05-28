const express = require('express');
const { pathJoin } = require('../utils/pathHelper.js');
const authRouter = express.Router();
const { checkIfAuth } = require('../controllers/baseController.js');
const { registration, login, logout} = require('../controllers/authController.js');

authRouter.post('/registration', registration);
authRouter.get('/registration', checkIfAuth, (req, res) => { res.sendFile(pathJoin('/client/registration/registration.html')); });
authRouter.post('/login', login);
authRouter.get('/login', checkIfAuth, (req, res) => { res.sendFile(pathJoin('/client/login/login.html')); });
authRouter.get('/logout', logout);

module.exports = authRouter;