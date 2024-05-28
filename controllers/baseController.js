const handleError = (res, error) => {
    res.status(500).json({ error })
}

const checkIfAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) res.redirect('/profile');
    else next();
}

const checkIfNotAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) res.redirect('/login');
    else next();
}

module.exports = { handleError, checkIfAuth, checkIfNotAuth };