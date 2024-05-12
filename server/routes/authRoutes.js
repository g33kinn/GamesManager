const express = require('express');
const authRouter = express.Router();
const { registration, login, getUsers } = require('../controllers/authController.js');
const roleMiddleware = require('../middleware/roleMiddleware');

authRouter.use(express.static('../client/user/account/login'));
authRouter.use(express.static('../client/user/account/register'));
authRouter.post('/registration', registration);
authRouter.post('/login', login);
authRouter.get('/users', roleMiddleware(['ADMIN']), getUsers);

module.exports = authRouter;