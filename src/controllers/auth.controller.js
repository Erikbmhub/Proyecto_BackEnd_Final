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
        await createUser(username, email, role, password);
        res.redirect('/login');
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).send('Error en el registro');
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        const result = await findUserByEmail(email);
        const user = Array.isArray(result) ? result[0] : result;

        if (user && user.password && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.cookie('token', token, { httpOnly: true });
            if (user.role === "admin") {
                res.redirect("/admin/movies")
            } else {
                res.redirect("/user/dashboard");
            }
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).send('Error en el inicio de sesión');
    }
}

function logoutAuth(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = authController = {
    register,
    login,
    logoutAuth
};
