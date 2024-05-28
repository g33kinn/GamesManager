const express = require('express');
const userRouter = express.Router();
const { pathJoin } = require('../utils/pathHelper.js');
const { checkIfNotAuth } = require('../controllers/baseController.js');
const { getUser, updateUser, getUsers, toggleUserAccountStatus, addManager } = require('../controllers/userController.js');
const roleMiddleware = require('../middleware/roleMiddleware');


userRouter.get('/profile', checkIfNotAuth,  (req, res) => { res.sendFile(pathJoin('/client/profile/profile.html')); });
userRouter.get('/user', roleMiddleware(['PLAYER']), getUser);
userRouter.patch('/user', roleMiddleware(['PLAYER']), updateUser);
userRouter.get('/users', roleMiddleware(['ADMIN']), getUsers);
userRouter.patch('/users/:userName', roleMiddleware(['ADMIN']), toggleUserAccountStatus);
userRouter.post('/users', roleMiddleware(['ADMIN']), addManager);

module.exports = userRouter;