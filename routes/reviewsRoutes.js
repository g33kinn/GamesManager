const express = require('express');
const reviewRouter = express.Router();
const { getReviewsByGameName, deleteReviewByUser, deleteReviewByRManager, addReviewByUser, updateReviewByUser, getUserReviewByGameName, getReviews } = require('../controllers/reviewController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');
const { pathJoin } = require('../utils/pathHelper.js');

reviewRouter.get('/reviewsManagement', roleMiddleware(['RMANAGER']), (req, res) => { res.sendFile(pathJoin('/client/reviewsManagement/reviewsManagement.html')); });
reviewRouter.get('/reviews', roleMiddleware(['RMANAGER']), getReviews);

reviewRouter.get('/review/:gameName', roleMiddleware(['PLAYER']), getUserReviewByGameName);
reviewRouter.get('/reviews/:gameName', getReviewsByGameName);
reviewRouter.delete('/reviews/:gameName', roleMiddleware(['PLAYER']), deleteReviewByUser);
reviewRouter.delete('/reviews/:gameName/:reviewID', roleMiddleware(['RMANAGER']), deleteReviewByRManager);
reviewRouter.post('/reviews/:gameName', roleMiddleware(['PLAYER']), addReviewByUser);
reviewRouter.patch('/reviews/:gameName', roleMiddleware(['PLAYER']), updateReviewByUser);

module.exports = reviewRouter;