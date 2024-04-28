const express = require('express');

const router = express.Router();
const { connectToDB } = require('./db.js');
const app = express();

app.use(express.json());
app.use('/', router);

const PORT = 3000;


router.get('/', (req, res) => {
    res.sendFile("D:\\Programming\\Web\\GamesManager\\GamesManager\\client\\catalog.html");
})

connectToDB();
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Listening on http://localhost:${PORT}`);
})