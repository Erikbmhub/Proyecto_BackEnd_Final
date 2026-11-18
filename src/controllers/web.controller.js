//http://localhost:3001
async function getViewHome(req, res) { //vista inicio de la app
    res.render("../views/layouts/main.pug")
}

//http://localhost:3001/dashboard
async function getViewDashboard(req, res) { //panel de control
    res.render("../views/user/dashboard.pug")
}

//http://localhost:3001/search
async function getViewSearch(req, res) { //buscador de películass
    res.render("../views/user/search.pug")
}

//http://localhost:3001/search/:title
async function getViewSearchByDetail(req, res) { //vista detalle de la película
    res.render("../views/user/detail.pug")
}

//http://localhost:3001/movies
async function getViewMovies(req, res) { //películas favoritas del usuario
    res.render("../views/admin/movies.pug")
}

//http://localhost:3001/profile
async function getViewProfile(req, res) { //vista detalle del usuario
    res.render("../views/user/profile.pug")
}

//http://localhost:3001/users
async function getViewUsers(req, res) { //lista de usuarios
    res.render("../views/admin/users.pug")
}

//http://localhost:3001/signup
async function getViewSignUp(req, res) { //vista de formulario de registro de la app
    res.render("../views/auth/signup.pug")
}

module.exports = webControllers = {
    getViewHome,
    getViewDashboard,
    getViewSearch,
    getViewSearchByDetail,
    getViewMovies,
    getViewProfile,
    getViewUsers,
    getViewSignUp
}