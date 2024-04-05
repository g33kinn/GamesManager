const express = require('express');

const router = express.Router();
const app = express();

app.use(express.json());
app.use('/api/gamesmanager', router);

const port = 3000;