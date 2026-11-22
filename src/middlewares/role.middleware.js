/*function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next();
        } else {
            return res.status(403).send('Acceso denegado');
        }
    };
}

module.exports = authorizeRole;
*/
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role == "admin" || req.user.role == "user") {
             next();
        }else {
            return res.status(403).send('Acceso denegado');
        }
    };
}

module.exports = authorizeRole;

