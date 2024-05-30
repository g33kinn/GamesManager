const jwt = require('jsonwebtoken');
const { secret } = require('../config');
module.exports = function (roles) {
    return function(req, res, next) {
        if(req.method === "OPTIONS") next();
        try {
            const token = req.cookies.jwt;
            if (!token) return res.send("Пользователь не авторизован");

            const decodedData = jwt.verify(token, secret);
            if (!decodedData) return res.send("Токен не валидный");
            const {roles: userRoles} = decodedData;

            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) return res.send("У вас нет прав доступа");
            req.userID = decodedData.id;
            
            next();
        } catch(err) {
            console.log(err);
            return res.cookie("jwt", "", { maxAge: 0 }).cookie("isAuth", false, { maxAge: 0 }).redirect('/');
        }
    }
}