const jwt = require('jsonwebtoken');
const { secret } = require('../config');
module.exports = function (roles) {
    return function(req, res, next) {
        if(req.method === "OPTIONS") next();
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(403).json({message: "Пользователь не авторизован"});

            const decodedData = jwt.verify(token, secret);
            const {roles: userRoles} = decodedData;

            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) return res.status(403).json({message: "У вас нет прав доступа"});
            req.userID = decodedData.id;
            
            next();
        } catch(err) {
            console.log(err);
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
    }
}