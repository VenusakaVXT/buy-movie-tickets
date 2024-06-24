import Movie from "../models/Movie.js"

class HomeController {
    index(req, res, next) {
        Movie.find({})
            .then(movies => res.render("index", {
                title: "BMT | Admin Dashboard",
                movies
            }))
            .catch(next)
    }

    adminLogin(req, res, next) {
        const { adminAccountName, adminPassword } = req.body

        if (adminAccountName == process.env.ADMIN_ACCOUNTNAME
            && adminPassword == process.env.ADMIN_PASSWORD) {
            req.session.isLoggedIn = true
            res.redirect("/")
        } else {
            res.status(400).send("Admin account or password is incorrect...")
        }
    }
}

export default new HomeController