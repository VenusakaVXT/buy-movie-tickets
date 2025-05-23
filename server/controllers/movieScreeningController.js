import Movie from "../models/Movie.js"
import Categorty from "../models/Category.js"
import Producer from "../models/Producer.js"
import slugify from "slugify"
import { isValidObjectId } from "mongoose"
import Screening from "../models/Screening.js"

class MovieScreeningController {
    detail = async (req, res, next) => {
        await Movie.findOne({ slug: req.params.slug })
            .then(async (movie) => {
                const category = await Categorty.findById(movie.category)
                const categoryName = category ? category.category : "Undefined"
                const producer = await Producer.findById(movie.producer)
                const producerName = producer ? producer.producerName : "Undefined"
                res.render("movies/movie-detail", { movie, categoryName, producerName })
            })
            .catch(next)
    }

    create(req, res, next) {
        Promise.all([Categorty.find({}), Producer.find({})])
            .then(([categories, producers]) => {
                res.render("movies/create", { categories, producers })
            })
            .catch(next)
    }

    store = async (req, res, next) => {
        try {
            const {
                title,
                description,
                director,
                contentWritter,
                actors,
                category,
                releaseDate,
                time,
                trailerId,
                wasReleased,
                producer
            } = req.body

            const categoryObj = await Categorty.findOne({ _id: category })
            const producerObj = await Producer.findOne({ _id: producer })

            const movie = new Movie({
                title,
                description,
                director,
                contentWritter,
                actors,
                category: categoryObj._id,
                releaseDate,
                time,
                trailerId,
                wasReleased,
                producer: producerObj._id
            })

            movie.slug = slugify(movie.title.replace(/:/g, ""), { lower: true })
            await movie.save()

            producerObj.movies.push(movie._id)
            await producerObj.save()

            // Avoid re-caching the old cache 
            // when switching to the "/movie-screening/table-lists" page
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            res.setHeader("Pragma", "no-cache")
            res.setHeader("Expires", "0")
            res.redirect("/movie-screening/table-lists")
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).send(`The movie title ${title} is available on the system`)
            } else {
                next(err)
            }
        }
    }

    tableLists(req, res, next) {
        Promise.all([Movie.find({}), Movie.countDocumentsWithDeleted({ deleted: true })])
            .then(([movies, deletedCount]) => {
                res.render("movies/read", { movies, deletedCount })
            })
            .catch(next)
    }

    edit(req, res, next) {
        Promise.all([Categorty.find({}), Producer.find({}), Movie.findById(req.params.id)])
            .then(([categories, producers, movie]) => {
                if (!movie.category || !isValidObjectId(movie.category)) {
                    movie.category = ""
                }
                if (!movie.producer || !isValidObjectId(movie.producer)) {
                    movie.producer = ""
                }
                res.render("movies/edit", { categories, producers, movie })
            })
            .catch(next)
    }

    update = async (req, res, next) => {
        try {
            const [category, producer] = await Promise.all([
                Categorty.findById({ _id: req.body.category }),
                Producer.findById({ _id: req.body.producer })
            ])

            const movieId = req.params.id
            const slug = slugify(req.body.title.replace(/:/g, ""), { lower: true })

            await Movie.updateOne({ _id: movieId }, {
                title: req.body.title,
                description: req.body.description,
                director: req.body.director,
                contentWritter: req.body.contentWritter,
                actors: req.body.actors,
                category: category._id,
                releaseDate: req.body.releaseDate,
                time: req.body.time,
                trailerId: req.body.trailerId,
                producer: producer._id,
                wasReleased: req.body.wasReleased,
                slug
            })

            const foundMovie = producer.movies.indexOf(movieId)

            if (foundMovie == -1) {
                producer.movies.push(movieId)
                producer.save()
            }

            await Screening.updateMany(
                { movie: req.params.id },
                { wasReleased: req.body.wasReleased }
            )

            res.redirect(`/movie-screening/${slug}/detail`)
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).send("The movie is available on the system")
            } else {
                next(err)
            }
        }
    }

    delete = async (req, res, next) => {
        try {
            const movieId = req.params.id
            await Screening.deleteMany({ movie: movieId })
            await Movie.delete({ _id: movieId })
            res.redirect("/movie-screening/table-lists")
        } catch (err) {
            next(err)
        }
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

    forceDelete = async (req, res, next) => {
        try {
            const movieId = req.params.id
            await Screening.deleteMany({ movie: movieId })
            await Movie.deleteOne({ _id: movieId })
            res.redirect("back")
        } catch (err) {
            next(err)
        }
    }

    handleDeleteActionFrm = async (req, res, next) => {
        try {
            if (req.body.action === "delete") {
                const movieIds = req.body.movieIds
                await Screening.deleteMany({ movie: { $in: movieIds } })
                await Movie.delete({ _id: { $in: movieIds } })
                res.redirect("back")
            } else {
                res.json({ message: "Action is invalid" })
            }
        } catch (err) {
            next(err)
        }
    }

    handleRestoreActionFrm = async (req, res, next) => {
        try {
            const movieIds = req.body.movieIds
            switch (req.body.action) {
                case "restore":
                    await Movie.restore({ _id: { $in: movieIds } })
                    res.redirect("back")
                    break
                case "hard-delete":
                    await Screening.deleteMany({ movie: { $in: movieIds } })
                    await Movie.deleteMany({ _id: { $in: movieIds } })
                    res.redirect("back")
                    break
                default:
                    res.json({ message: "Action is invalid" })
            }
        } catch (err) {
            next(err)
        }
    }
}

export default new MovieScreeningController