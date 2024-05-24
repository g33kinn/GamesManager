const express = require('express');
const userRouter = express.Router();
const { getUser, updateUser, getUsers, toggleUserAccountStatus, addManager } = require('../controllers/userController.js');
const roleMiddleware = require('../middleware/roleMiddleware');


userRouter.get('/profile', roleMiddleware(['PLAYER']), getUser);
userRouter.patch('/profile', roleMiddleware(['PLAYER']), updateUser);
userRouter.get('/users', roleMiddleware(['ADMIN']), getUsers);
userRouter.patch('/users/:userName', roleMiddleware(['ADMIN']), toggleUserAccountStatus);
userRouter.post('/users', roleMiddleware(['ADMIN']), addManager);

module.exports = userRouter;