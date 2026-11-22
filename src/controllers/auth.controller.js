const { createUser, findUserByUsername, findUserByEmail } = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(req, res) {
    const { username, password, confirmPassword, email, role = 'user' } = req.body;

    try {
        if (!username || !password || !email) {
            return res.status(400).send('Todos los campos son obligatorios');
        }
        if (confirmPassword !== undefined && password !== confirmPassword) {
            return res.status(400).send('Las contraseñas no coinciden');
        }

        // Evitar duplicados si no lo valida ya createUser
        const existingEmail = await findUserByEmail(email);
        const foundByEmail = Array.isArray(existingEmail) ? existingEmail[0] : existingEmail;
        if (foundByEmail) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }

        const existingUsername = await findUserByUsername(username);
        const foundByUsername = Array.isArray(existingUsername) ? existingUsername[0] : existingUsername;
        if (foundByUsername) {
            return res.status(400).send('El nombre de usuario ya está en uso');
        }

        const created = await createUser(username, email, role, password);
        const newUser = Array.isArray(created) ? created[0] : created;

        // Si createUser no devuelve el usuario, lo buscamos por email
        const userRecord = newUser || (await findUserByEmail(email));
        const userId = userRecord?.id || userRecord?._id;
        const userRole = userRecord?.role || role;

        if (userId) {
            const token = jwt.sign(
                { id: userId, role: userRole },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.cookie('token', token, { httpOnly: true });
        }

        if (userRole === 'admin') {
            return res.redirect('/movies');
        }
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).send('Error en el registro');
    }
}

function wantsJsonResponse(req) {
    return Boolean(
        req.xhr ||
        req.headers["x-requested-with"] === "XMLHttpRequest" ||
        req.is("application/json") ||
        (req.headers.accept && req.headers.accept.includes("application/json"))
    );
}

async function login(req, res) {
    const { email, password } = req.body;
    const wantsJson = wantsJsonResponse(req);

    try {
        // Si ya pasaste por loginValidation, esto actúa como red de seguridad
        if (!email || !password) {
            if (wantsJson) {
                return res.status(400).json({
                    message: "Todos los campos son obligatorios",
                    errors: [
                        !email && { field: "email", message: "El correo electrónico es obligatorio" },
                        !password && { field: "password", message: "La contraseña es obligatoria" },
                    ].filter(Boolean),
                });
            }
            return res.status(400).send("Todos los campos son obligatorios");
        }

        const result = await findUserByEmail(email);
        const user = Array.isArray(result) ? result[0] : result;

        if (user && user.password && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("token", token, { httpOnly: true });

            const redirectTo = user.role === "admin" ? "/movies" : "/dashboard";

            if (wantsJson) {
                return res.status(200).json({ redirectTo });
            }

            return res.redirect(redirectTo);
        }

        if (wantsJson) {
            return res.status(401).json({
                message: "Credenciales inválidas",
                errors: [
                    { field: "password", message: "Correo electrónico o contraseña incorrectos" },
                ],
            });
        }

        return res.status(401).send("Credenciales inválidas");
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);

        if (wantsJson) {
            return res.status(500).json({
                message: "Error en el inicio de sesión",
            });
        }

        return res.status(500).send("Error en el inicio de sesión");
    }
}

function logoutAuth(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = authController = {
    register,
    login,
    logoutAuth,
    wantsJsonResponse
};
