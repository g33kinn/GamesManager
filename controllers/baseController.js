const roleMiddleware = require('../middleware/roleMiddleware');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const { secret } = require('../config');

const handleError = (res, error) => {
    res.status(500).json({ message: error })
}

const checkIfAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) res.redirect('/profile');
    else next();
}

const checkIfGuestOrRole = function(roles) {
    return (req, res, next) => {
        const token = req.cookies.jwt;
        if (!token) next();
        else roleMiddleware(roles)(req, res, next);
    }
}

const redirectUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/catalog');

    const decodedData = jwt.verify(token, secret);
    if (!decodedData) return res.send("Токен не валидный");
    const {roles: userRoles} = decodedData;

    const dbRoles = await Role.find();

    userRoles.forEach(role => {
        if(role === dbRoles[0].name) // PLAYER
            res.redirect('/catalog');
        if(role === dbRoles[1].name) // ADMIN
            res.redirect('/admin');
        if(role === dbRoles[2].name) // CMANAGER
            res.redirect('/catalogManagement');
        if(role === dbRoles[3].name) // RMANAGER
            res.redirect('/reviewsManagement');
    });
}

module.exports = { handleError, checkIfAuth, checkIfGuestOrRole, redirectUser };