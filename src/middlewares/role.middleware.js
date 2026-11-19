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

        // Comprobamos qué usuario llega al middleware.
        console.log("Usuario recibido:", req.user);

        // Comprobamos el rol del usuario.
        console.log("Rol recibido:", req.user?.role);

        // Comprobamos qué rol exige la ruta.
        console.log("Rol requerido:", role);

        if (req.user.role === role) {
            return next();
        } else {
            return res.status(403).send('Acceso denegado');
        }
    };
}

module.exports = authorizeRole;

