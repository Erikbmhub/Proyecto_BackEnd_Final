//http://localhost:3001
async function getHome(req, res) { //1º página principal HOME
    res.render("src/views/layouts/main.pug")
}

async function getlogin(req, res) { //1º página principal HOME
    res.render("src/views/auth/login.pug")
}

module.exports = webControllers = {
    getHome,
    getlogin
}