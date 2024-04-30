const express = require('express');

const router = express.Router();
const { connectToDB } = require('./db.js');
const app = express();

app.use(express.json());
app.use('/', router);

const PORT = 3000;


router.get('/', (req, res) => {
    res.send("Ok!");
})

connectToDB();
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Listening on http://localhost:${PORT}`);
})