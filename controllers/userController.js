const bcrypt = require('bcryptjs');
const { handleError } = require('./baseController');

const User = require('../models/user');
const Role = require('../models/role');

const getUser = async (req, res) => {
    User
        .findOne({ _id: req.userID })
        .then((user) => {
            if (!user) res.status(404).json({ message: 'Пользователь не найден.' });
            else res.status(200).json(user);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const updateUser = async (req, res) => {
    let newUserInfo = {};
    if (req.body.password) {
        newUserInfo = {
            password: bcrypt.hashSync(req.body.password, 7)
        }
    }
    if (req.body.email) {
        newUserInfo = {
            email: req.body.email
        }
    }
    if (req.body.phoneNumber) {
        newUserInfo = {
            phoneNumber: req.body.phoneNumber
        }
    }

    User
        .findOneAndUpdate({ _id: req.userID }, newUserInfo)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Пользователь не найден.' });
            else res.status(200).json({ message: 'Информация о пользователе была успешно изменена.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const toggleUserAccountStatus = async (req, res) => {
    if (req.params.userName === "admin") res.status(403).json({ message: 'Невозможно заблокировать администратора.' })

    const user = await User.findOne({ userName: req.params.userName })
    if (!user) res.status(404).json({ message: 'Пользователь не найден.' });

    const newUserInfo = {
        behaviourIndex: 5,
        accountStatus: user.accountStatus === "Active" ? "Blocked" : "Active"
    }

    User
        .findOneAndUpdate({ _id: user._id }, newUserInfo)
        .then((result) => {
            console.log(result);
            if (!result) res.status(404).json({ message: 'Пользователь не найден.' });
            else res.status(200).json({ message: 'Информация о пользователе была успешно изменена.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const getManagers = async (req, res) => {
    User
        .find({ roles: { $in: ['CMANAGER', 'RMANAGER'] } })
        .sort({ userName: 1 })
        .then((users) => {
            if (users.length === 0) res.status(200).json({ message: 'Список менеджеров пуст.' })
            else res.status(200).json(users);
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const addManager = async (req, res) => {
    const { userName, pass, role, email, phoneNumber } = req.body;
    const candidate = await User.findOne({ userName: userName });
    if (candidate) return res.status(409).json({ message: 'Пользователь с таким логином уже существует. Повторите попытку.' });

    const hashPassword = bcrypt.hashSync(pass, 7);
    const userRole = await Role.findOne({ name: role });
    const user = new User({ 
        userName: userName,
        password: hashPassword, 
        roles: [userRole.name], 
        email: email, 
        phoneNumber: phoneNumber, 
        accountStatus: "Active",  
        behaviourIndex: 5 
    });
    user
        .save()
        .then((_) => {
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const deleteManager = async (req, res) => {
    User
        .deleteOne({ userName: req.params.userName })
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Пользователь не найден.' });
            else res.status(200).json({ message: 'Пользователь был успешно удален.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
};

const updateManager = async (req, res) => {
    const candidate = await User.findOne({ userName: req.body.userName });
    if (candidate) return res.status(409).json({ message: 'Пользователь с таким логином уже существует. Повторите попытку.' });

    let newManagerInfo = {};
    if (req.body.userName) {
        newManagerInfo.userName = req.body.userName;
    }
    if (req.body.pass) { 
        newManagerInfo.pass = bcrypt.hashSync(pass, 7);
    }
    if (req.body.email) {
        newManagerInfo.email = req.body.email;
    }
    if (req.body.phoneNumber) {
        newManagerInfo.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.role) {
        const userRole = await Role.findOne({ name: req.body.role });
        newManagerInfo.roles = [userRole.name];
    }
    await User
        .findOneAndUpdate({ userName: req.params.userName }, newManagerInfo)
        .then((result) => {
            if (!result) res.status(404).json({ message: 'Пользователь не найден.' });
            else res.status(200).json({ message: 'Информация о пользователе была успешно изменена.' });
        })
        .catch((err) => {
            console.log(err);
            handleError(res, 'Что-то пошло не так...');
        });
}

module.exports = { getUser, updateUser, addManager, getManagers, deleteManager, updateManager };