const express = require('express');

const router = express.Router();
const app = express();

app.use(express.json());
app.use('/api/gamesmanager', router);

const port = 3000;

router.get('/', (req, res) => {
    res.send('Ok!');
})

app.listen(port, () => {
    console.log(`Listening on https://localhost:${port}`);
})