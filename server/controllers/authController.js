const User = require('../models/game');
const path = require('path');

const register = (req, res) => {
    // Game
    //     .find()
    //     .sort({ Name: 1 })
    //     .then((Games) => {
    //         res
    //             .status(200)
    //             .json()
    //     })
    res.sendFile(path.join(__dirname, '../../client/user/account/register/register.html'));
};

const login = (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/user/account/login/login.html'));
}

module.exports = { register, login };