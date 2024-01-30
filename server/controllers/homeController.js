import mongoose from "mongoose"
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
}

export default new HomeController