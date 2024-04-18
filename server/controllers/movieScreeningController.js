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
        const categoryObj = await Categorty.findOne({ _id: req.body.category })
        const producerObj = await Producer.findOne({ _id: req.body.producer })

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
        movie.slug = slugify(movie.title, { lower: true })

        await movie.save()
            .then(async () => {
                producerObj.movies.push(movie._id)
                await producerObj.save()

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

            const slug = slugify(req.body.title, { lower: true })

            await Movie.updateOne({ _id: req.params.id }, {
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

            await Screening.updateMany(
                { movie: req.params.id },
                { wasReleased: req.body.wasReleased }
            )

            res.redirect(`/movie-screening/${slug}/detail`)
        } catch (err) {
            next(err)
        }
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