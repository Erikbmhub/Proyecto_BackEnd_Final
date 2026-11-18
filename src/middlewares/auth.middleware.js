const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = (req.headers.cookie || "")
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.slice("token=".length);

    if (!token) return res.redirect('/');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.redirect('/');
        req.user = decoded;
        res.locals.user = decoded;
        next();
    });
}

module.exports = authMiddleware;
