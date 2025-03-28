const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'Нет токена, авторизация запрещена' });

    try {
        const decoded = jwt.verify(token, 'mysecret');
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Неверный токен' });
    }
};
