const express = require('express');
const { pathJoin } = require('./utils/pathHelper.js');
const { redirectUser } = require('./controllers/baseController.js');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fileRouter = require('./routes/fileRoutes.js');
const gamesRouter = require('./routes/gamesRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const reviewRouter = require('./routes/reviewsRoutes.js');
const libraryRouter = require('./routes/libraryRouter.js');
const userRouter = require('./routes/userRoutes.js');
const genresRouter = require('./routes/genresRouter.js');
const themesRouter = require('./routes/themeRouter.js');

const PORT = 3000;
const { connectToDB } = require('./db.js');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use((req, res, next) => {
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    next();
});
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        return res.status(403).send('Forbidden');
    }
    next();
});
app.use((req, res, next) => {
    if (!req.cookies.isAuth) {
        res.cookie('isAuth', false, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: false,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });
    }
    next();
})


app.use(express.static(pathJoin('/client')));
app.get('/', redirectUser);
app.use(fileRouter)
app.use(gamesRouter);
app.use(authRouter);
app.use(reviewRouter);
app.use(libraryRouter);
app.use(userRouter);
app.use(genresRouter);
app.use(themesRouter);

app.use((req, res) => {
    res.send('Page not found');
});

(async () => {
    try {
        await connectToDB();
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
})();
