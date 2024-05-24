const express = require('express');
const authRouter = express.Router();
const { registration, login, logout } = require('../controllers/authController.js');

authRouter.post('/registration', registration);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

module.exports = authRouter;