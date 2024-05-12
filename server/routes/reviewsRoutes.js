const express = require('express');
const reviewRouter = express.Router();
const { getReviewsByGameName, deleteReviewByUser, deleteReviewByRManager, addReviewByUser, updateReviewByUser } = require('../controllers/reviewController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

//authRouter.use(express.static('../client/user/account/login'));
//authRouter.use(express.static('../client/user/account/register'));
reviewRouter.get('/reviews/:gameName', getReviewsByGameName);
reviewRouter.delete('/reviews/:gameName', roleMiddleware(['PLAYER']), deleteReviewByUser);
reviewRouter.delete('/reviews/:gameName/:reviewID', roleMiddleware(['RMANAGER']), deleteReviewByRManager);
reviewRouter.post('/reviews/:gameName', roleMiddleware(['PLAYER']), addReviewByUser);
reviewRouter.patch('/reviews/:gameName', roleMiddleware(['PLAYER']), updateReviewByUser);

module.exports = reviewRouter;