import Movie from "../models/Movie.js"
import slugify from "slugify"

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
        movie.slug = slugify(movie.title, { lower: true })

        movie.save()
            .then(() => {
                // Avoid re-caching the old cache 
                // when switching to the "/movie-screening/table-lists" page
                res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                res.setHeader("Pragma", "no-cache")
                res.setHeader("Expires", "0")
                res.redirect("/movie-screening/table-lists")
            })
            .catch(next)
    }

    tableLists(req, res, next) {
        Promise.all([Movie.find({}), Movie.countDocumentsWithDeleted({ deleted: true })])
            .then(([movies, deletedCount]) => {
                res.render("movies/read", { movies, deletedCount })
            })
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
        Movie.delete({ _id: req.params.id })
            .then(() => res.redirect("/movie-screening/table-lists"))
            .catch(next)
    }

    recycleBin(req, res, next) {
        Promise.all([Movie.findWithDeleted({ deleted: true }), Movie.countDocuments({})])
            .then(([movies, moviesCount]) => {
                res.render("movies/trash-can", { movies, moviesCount })
            })
            .catch(next)
    }

    restore(req, res, next) {
        Movie.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next)
    }

    forceDelete(req, res, next) {
        Movie.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next)
    }

    handleDeleteActionFrm(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Movie.delete({ _id: { $in: req.body.movieIds } })
                    .then(() => res.redirect("back"))
                    .catch(next)
                break
            default:
                res.json({ message: 'Action is invalid' })
        }
    }

    handleRestoreActionFrm(req, res, next) {
        switch (req.body.action) {
            case "restore":
                Movie.restore({ _id: { $in: req.body.movieIds } })
                    .then(() => res.redirect("back"))
                    .catch(next)
                break
            case "hard-delete":
                Movie.deleteMany({ _id: { $in: req.body.movieIds } })
                    .then(() => res.redirect("back"))
                    .catch(next)
                break
            default:
                res.json({ message: 'Action is invalid' })
        }
    }
}

export default new MovieScreeningController