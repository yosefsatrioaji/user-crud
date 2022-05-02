const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if(!req.headers.authorization) return res.status(401).send('Unauthorized request');
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}