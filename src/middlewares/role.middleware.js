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
*/
// Middleware para comprobar el rol del usuario.
function authorizeRole(role) {
    return (req, res, next) => {
        // Comprobamos que exista un usuario autenticado.
        if (!req.user) {
            return res.status(401).send("No has iniciado sesión");
        }

        // Comprobamos que el usuario tenga el rol requerido.
        if (req.user.role !== role) {
            return res.status(403).send("Acceso denegado");
        }

        next();
    };
}

module.exports = authorizeRole;

