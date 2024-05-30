const express = require('express');
const userRouter = express.Router();
const { pathJoin } = require('../utils/pathHelper.js');
const { getUser, updateUser, toggleUserAccountStatus, addManager, getManagers, deleteManager, updateManager } = require('../controllers/userController.js');
const roleMiddleware = require('../middleware/roleMiddleware');


userRouter.get('/profile', roleMiddleware(['PLAYER']),  (req, res) => { res.sendFile(pathJoin('/client/profile/profile.html')); });
userRouter.get('/admin', roleMiddleware(['ADMIN']), (req, res) => { res.sendFile(pathJoin('/client/admin/admin.html')); });


userRouter.get('/managers', roleMiddleware(['ADMIN']), getManagers);
userRouter.post('/managers', roleMiddleware(['ADMIN']), addManager);
userRouter.delete('/managers/:userName', roleMiddleware(['ADMIN']), deleteManager);
userRouter.patch('/managers/:userName', roleMiddleware(['ADMIN']), updateManager);


userRouter.get('/user', roleMiddleware(['PLAYER']), getUser);
userRouter.patch('/user', roleMiddleware(['PLAYER']), updateUser);
//userRouter.get('/users', roleMiddleware(['ADMIN']), getUsers);
userRouter.patch('/users/:userName', roleMiddleware(['ADMIN']), toggleUserAccountStatus);
userRouter.post('/users', roleMiddleware(['ADMIN']), addManager);

module.exports = userRouter;