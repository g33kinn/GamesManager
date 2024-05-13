const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const { handleError } = require('./baseController');
const { secret } = require('../config');

const User = require('../models/user');
const Role = require('../models/role');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
}

const registration = async (req, res) => {
    try {
        const { userName, password } = req.body;
    
        const candidate =  await User.findOne({ userName: userName });
        if (candidate) return res.status(409).json({message: 'Пользователь с таким логином уже существует. Повторите попытку.'});
    
        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({ name: 'PLAYER' });
        const user = new User( { userName: userName, password: hashPassword, roles: [userRole.name]} );
    
        //console.log(user);
        user
            .save()
            .then((_) => {
                res.status(201).json({ message: 'Пользователь успешно зарегистрирован.'});
            })
            .catch((err) => {
                console.log(err);
                handleError(res, 'Что-то пошло не так...');
            });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Ошибка регистрации.'});
    }
};

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user =  await User.findOne({ userName: userName });
        if(!user) return res.status(404).json({ message: `Пользователь ${userName} не найден.` });

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: `Неверный пароль.` })

        if (user.accountStatus !== 'Active') return res.status(403).json({ message: `Доступ к системе запрещен.` });

        const token = generateAccessToken(user._id, user.roles);

        return res.status(200).json({ token });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Ошибка аутентификации.'});
    }
}

module.exports = { registration, login };