const express = require('express');
const fileRouter = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const { uploadFile } = require('../controllers/fileController');


fileRouter.post('/upload', roleMiddleware(['CMANAGER']), uploadFile);

module.exports = fileRouter;