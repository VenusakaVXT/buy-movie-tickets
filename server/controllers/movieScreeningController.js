import mongoose from "mongoose"
import Movie from "../models/Movie.js"

class MovieScreeningController {
    detail(req, res, next) {
        Movie.findOne({ slug: req.params.slug })
            .then((movie) => { res.render("movies/movie-detail", { movie }) })
            .catch(next)
    }

    create(req, res, next) {
        res.render("movies/create")
    }

    store(req, res, next) {
        const movie = new Movie(req.body)

        movie.save()
            .then(res.redirect("/"))
            .catch(next)
    }

    tableLists(req, res, next) {
        Movie.find({})
            .then(movies => res.render("movies/read", { movies }))
            .catch(next)
    }

    edit(req, res, next) {
        Movie.findById(req.params.id)
            .then(movie => res.render("movies/edit", { movie }))
            .catch(next)
    }

    update(req, res, next) {
        Movie.updateOne({ _id: req.params.id }, {
            title: req.body.title,
            description: req.body.description,
            director: req.body.director,
            contentWritter: req.body.contentWritter,
            actors: req.body.actors,
            category: req.body.category,
            releaseDate: req.body.releaseDate,
            time: req.body.time,
            trailerId: req.body.trailerId,
            wasReleased: req.body.wasReleased
        })
            .then(() => res.redirect("/movie-screening/table-lists"))
            .catch(next)
    }

    delete(req, res, next) {
        Movie.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/movie-screening/table-lists"))
            .catch(next)
    }
}

export default new MovieScreeningController