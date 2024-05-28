const path = require('path');

const pathJoin = (relativePath) => {
    return path.join(__dirname, '..', relativePath);
}

module.exports = { pathJoin };