const express = require('express');
const router = express.Router();
const { register, login, logoutAuth } = require('../controllers/auth.controller');
const { signupValidation, loginValidation } = require('../validation/auth.validation');
const passport = require('passport');

// Rutas de Autentificacion Local - Registro + Login clasico
router.post('/signup', signupValidation, register);
router.post('/login', loginValidation, login);
//***Rutas de google OAuth ( Iniciar sesion con Google )***
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' }));

// Callback de Google
router.get("/google/callback",
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.cookie('token', req.user.token, { httpOnly: true });
        const redirectUrl = req.user.user.role === 'admin' ? '/admin/movies' : '/user/dashboard';
        const redirectUrl1 = req.user.user.role === 'admin' ? '/movies' : '/dashboard';
        res.redirect(redirectUrl);
    }
);

//Ruta de cierre de sesion

router.get('/logout', (req, res,next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
            res.clearCookie('token'); // Eliminar el token JWT
            res.redirect('/login');
        });
    });
}, logoutAuth);

module.exports = router;