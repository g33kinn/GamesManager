const Game = require('../models/game');
const { pathJoin } = require('../utils/pathHelper');

const uploadFile = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) 
        return res.status(400).json({ message: 'Файл для загрузки не найден.' });

    const game = await Game.findOne({ gameName: req.body.gameName });
    if (!game) return res.status(409).json({ message: 'Игра не найдена.' });

    let uploadedFile = req.files.uploadedFile;

    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = uploadedFile.name.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Недопустимое расширение файла.' });
    }

    uploadedFile.name = `${req.body.gameName.replace(' ', '_')}${req.body.type}.png`


    const uploadPath = pathJoin(`/client/assets/gameImg/${uploadedFile.name}`);

    await uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Ошибка при сохранении файла.'});
        }

        const filePath = `${req.body.gameName.replace(' ', '_')}${req.body.type}.png`;

        let newGameInfo = {};

        if (req.body.type === 'Cat') newGameInfo.imageCat = filePath;
        if (req.body.type === 'Lib') newGameInfo.imageLib = filePath;
        if (req.body.type === 'Page') newGameInfo.imagePage = filePath;

        Game
            .findOneAndUpdate({ gameName: req.body.gameName }, newGameInfo)
            .then((result) => {
                if (!result) res.status(404).json({ message: 'Игра не найдена.' });
                else res.status(200).json({ message: 'Файл был добавлен.'});
            })
            .catch((err) => {
                console.log(err);
                handleError(res, 'Что-то пошло не так...');
            });
    });
}

module.exports = { uploadFile };