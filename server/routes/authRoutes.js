const express = require('express');
const authRouter = express.Router();
const { register, login } = require('../controllers/authController.js')

authRouter.use(express.static('../client/user/account/login'));
authRouter.use(express.static('../client/user/account/register'));
authRouter.get('/register', register);
authRouter.get('/login', login);

module.exports = authRouter;