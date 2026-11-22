const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const passport = require('passport');

// Rutas de Autentificacion Local - Registro + Login clasico

router.get('/signup', (req, res) => res.render('auth/signup'));
router.post('/signup', register);

router.post('/login', login);

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
});

//Rutas protegidas por Roles

router.get('/dashboard', authMiddleware, authorizeRole('user'), (req, res) => {
    res.render('user/dashboard.pug', { user: req.user });
});

/*router.get('/movies', authMiddleware, authorizeRole('admin'), (req, res) => {
    res.render('admin/movies.pug', { user: req.user });
});  */

module.exports = router;