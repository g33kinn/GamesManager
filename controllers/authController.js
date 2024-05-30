const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { handleError, checkAuth } = require('./baseController');
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
        const { userName, password, email, phoneNumber } = req.body;

        let candidate =  await User.findOne({ userName: userName });
        if (candidate) return res.status(409).json({message: 'Пользователь с таким логином уже существует. Повторите попытку.'});

        candidate = await User.findOne({ email: email });
        if (candidate) return res.status(409).json({message: 'Email занят. Повторите попытку.'});

        candidate = await User.findOne({ phoneNumber: phoneNumber });
        if (candidate) return res.status(409).json({message: 'Номером телефона занят. Повторите попытку.'});

        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({ name: 'PLAYER' });
        const user = new User( { userName: userName, password: hashPassword, email: email, phoneNumber: phoneNumber, roles: [userRole.name]} );

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

        res.status(200).cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        })
        .cookie("isAuth", true, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: false,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        })
        .json({ message: "Вы успешно вошли в аккаунт." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Ошибка аутентификации.'});
    }
}

const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 }).cookie("isAuth", false, { maxAge: 0 });
		res.redirect('/login');
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Ошибка сервера" });
	}
};

module.exports = { registration, login, logout, checkAuth};