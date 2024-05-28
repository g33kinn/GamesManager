const { handleError } = require('./baseController');
const Review = require('../models/review');
const Game = require('../models/game');
const UserGame = require('../models/userGame');

const getReviewsByGameName = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    Review
        .find({ gameID: game._id })
        .skip(skip)
        .limit(limit)
        .sort({ publicationDate: 1 })
        .populate('userID')
        .then((reviews) => {
            if (reviews.length === 0) res.status(200).json({ message: 'Отзывов пока нет.' })
            else res.status(200).json(reviews);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const getUserReviewByGameName = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    Review
        .find({ gameID: game._id, userID: req.userID })
        .populate('userID')
        .then((review) => {
            if (review.length === 0) res.status(200).json({ message: 'Отзыва пока нет.' })
            else res.status(200).json(review[0]);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteReviewByUser = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    Review
        .findOneAndDelete({ userID: req.userID, gameID: game._id })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Отзыв не найден.' });
            else res.status(200).json({ message: 'Отзыв был успешно удален.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}

const deleteReviewByRManager = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    const review = await Review.findOne({ _id: req.params.reviewID }).populate('UserID');
    if (!review) return res.status(404).json({ message: `Отзыв с ID ${req.params.reviewID} не найден.` });

    const behIndex = review.userID.behaviourIndex - 1;

    const newUserInfo = {   
        "behaviourIndex": behIndex,
        "accountStatus": behIndex === 1 ? 'Blocked' : 'Active'
    }

    const message = '';

    User
        .findOneAndUpdate({ _id: review.userID._id }, newUserInfo)
        .then((result) => {
            if (!result) message += 'Пользователь, который оставил отзыв, не найден.';
            else message += 'Информация о пользователе, который оставил отзыв, изменена.';
        })
        .catch((err) => {
            console.log(err);
            message += 'При попытке изменить информацию о пользователе что-то пошло не так.';
        });

    Review
        .findOneAndDelete({ _id: req.params.reviewID })
        .then((result) => {
            if (!result) res.status(404).json({ message: `${message} Отзыв не найден.` });
            else res.status(200).json({ message: `${message} Отзыв был успешно удален.` });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'При попытке удалить отзывы что-то пошло не так...');
        });
}

const addReviewByUser = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    const userGame = await UserGame.findOne({ userID: req.userID, gameID: game._id });
    if (!userGame) return res.status(404).json({ message: 'Игра не найдена в вашей библиотеке. Добавьте игру в свою библиотеку перед тем, как оставить отзыв.' });

    const existingReview = await Review.findOne({ userID: req.userID, gameID: game._id});
    if (existingReview) return res.status(409).json({ message: 'Отзыв на игру уже существует.' });

    const review = new Review({
        "text": req.body.text,
        "publicationDate": new Date(),
        "editDate": null,
        "isPositive": req.body.isPositive,
        "userID": req.userID,
        "gameID": game._id
    });

    review
        .save()
        .then((_) => {
            res.status(201).json({ message: 'Отзыв был успешно добавлен.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}

const updateReviewByUser = async (req, res) => {
    const game = await Game.findOne({ gameName: req.params.gameName });
    if (!game) return res.status(404).json({ message: `Игра ${req.params.gameName} не найдена.` });

    const userGame = await UserGame.findOne({ userID: req.userID, gameID: game._id });
    if (!userGame) return res.status(404).json({ message: 'Игра не найдена в вашей библиотеке. Добавьте игру в свою библиотеку перед тем, как изменить отзыв.' });

    const newReview = {
        "text": req.body.text,
        "editDate": new Date(),
        "isPositive": req.body.isPositive
    };
    Review
        .findOneAndUpdate({ userID: req.userID, gameID: game._id }, newReview)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Отзыв не найден.' });
            else res.status(200).json({ message: 'Отзыв был успешно изменен.'});
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}


module.exports = { getReviewsByGameName, deleteReviewByUser, deleteReviewByRManager, addReviewByUser, updateReviewByUser, getUserReviewByGameName };