const { createUser, findUserByUsername } = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function signupAuth(req, res) {
    const { username, password, email, role = 'user' } = req.body;

    try {
        if (!username || !password || !email) {
            return res.status(400).send('Todos los campos son obligatorios');
        }
        const newUser = await createUser(username, email, role, password);
        res.redirect('/');
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).send('Error en el registro');
    }
}

async function loginAuth(req, res) {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            if (user.role === "admin") {
                res.redirect("/api/movie/")
            } else {
                res.render('../views/user/dashboard.pug');
            }
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    } catch (error) {
        res.status(500).send('Error en el inicio de sesión');
    }
}

function logoutAuth(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = authController = {
    signupAuth,
    loginAuth,
    logoutAuth
};
