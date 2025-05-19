import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Movie from "../models/Movie.js"
import Manager from "../models/Employee.js"
import Producer from "../models/Producer.js"
import slugify from "slugify"
import Screening from "../models/Screening.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Comment from "../models/Comment.js"
import { MovieFilter } from "../util/constants/movie.js"
import { ScreeningFilter } from "../util/constants/screening.js"
import { OrderBy } from "../util/constants/order.js"

export const getAllMovies = async (req, res, next) => {
    const { groupCode, order } = req.query
    let sortOption = {}

    if (!groupCode) {
        try {
            const movies = await Movie.find()
            if (!movies || movies.length === 0) {
                return res.status(404).json({ message: "Movies not found..." })
            }
            return res.status(200).json({ movies })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Request failed..." })
        }
    }

    if (groupCode === MovieFilter.MOVIE_TITLE) {
        sortOption.title = order === OrderBy.DESC ? -1 : 1
    } else if (groupCode === MovieFilter.MOVIE_TIME) {
        sortOption.time = order === OrderBy.DESC ? -1 : 1
    } else {
        return res.status(400).json({ message: "Invalid groupCode" })
    }

    try {
        const movies = await Movie.find().sort(sortOption)
        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: "Movies not found..." })
        }
        return res.status(200).json({ movies })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Request failed..." })
    }
}

export const getMovieById = async (req, res, next) => {
    const id = req.params.id
    try {
        const movie = await Movie.findById(id)
        if (!movie) {
            return res.status(404).json({ message: "Invalid movie id..." })
        }
        return res.status(200).json({ movie })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Request failed..." })
    }
}

export const getMovieBySlug = async (req, res, next) => {
    try {
        const movie = await Movie.findOne({ slug: req.params.slug })
            .populate("category", "category")
            .populate("producer", "producerName")

        if (!movie) {
            return res.status(404).json({ message: "Invalid movie slug..." })
        }

        return res.status(200).json({ movie })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Request failed..." })
    }
}

export const addMovie = async (req, res, next) => {
    // omit the word "Bearer" and just take the string <token>
    const extractedToken = req.headers.authorization?.split(" ")[1]

    if (!extractedToken && extractedToken.trim() === "") {
        return res.status(404).json({ message: "token not found..." })
    }

    let managerId

    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: `${err.message}` })
        } else {
            managerId = decrypted.id
            return
        }
    })

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

    if (
        !title &&
        title.trim() === "" &&
        !description &&
        description.trim() === "" &&
        !trailerId &&
        trailerId.trim() === ""
    ) {
        return res.status(422).json({ message: "Invalid inputs..." })
    }

    let movie

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        movie = new Movie({
            title,
            description,
            director,
            contentWritter,
            actors,
            category,
            releaseDate,
            time,
            wasReleased,
            producer,
            trailerId,
            manager: managerId,
        })

        movie.slug = slugify(movie.title.replace(/:/g, ""), { lower: true })
        await movie.save({ session })

        const producerMovie = await Producer.findById(movie.producer)
        producerMovie.movies.push(movie._id)
        await producerMovie.save({ session })

        const managerUser = await Manager.findById(managerId)
        managerUser.addedMovies.push(movie._id)
        await managerUser.save({ session })

        await session.commitTransaction()
        res.status(200).json({ movie, message: "Add movie successfully..." })
    } catch (err) {
        await session.abortTransaction()
        console.error(err)
        if (err.code === 11000) {
            return res.status(409).json({ message: `The movie title ${title} is available on the system` })
        }
        return res.status(500).json({ message: "Request failed..." })
    } finally {
        session.endSession()
    }
}

export const deleteMovie = async (req, res, next) => {
    const id = req.params.id
    let movie

    try {
        await Screening.deleteMany({ movie: id })
        movie = await Movie.findByIdAndRemove(id)
    } catch (err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(500).json({ message: "Unable to delete..." })
    }

    return res.status(200).json({ message: "Successfully delete!!!" })
}

export const updateMovie = async (req, res, next) => {
    const id = req.params.id
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

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(id, {
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
            producer,
            slug: slugify(title.replace(/:/g, ""), { lower: true })
        }, { new: true })

        if (!updatedMovie) {
            res.status(404).json({ message: "Invalid movie id..." })
        }

        res.status(200).json(updatedMovie)
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: `The movie title ${title} is available on the system` })
        }
        res.status(500).json({ error: err.message })
    }
}

export const getScreeningsByMovieSlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const { groupCode, order } = req.query
        let sortOption = {}

        if (groupCode) {
            if (groupCode === ScreeningFilter.SCREENING_DATE) {
                sortOption.movieDate = order === OrderBy.DESC ? -1 : 1
            } else if (groupCode === ScreeningFilter.SCREENING_PRICE) {
                sortOption.price = order === OrderBy.DESC ? -1 : 1
            } else {
                return res.status(400).json({ message: "Invalid groupCode" })
            }
        }

        const movie = await Movie.findOne({ slug }).populate({
            path: "screenings",
            select: "_id movieDate timeSlot price cinemaRoom",
            populate: { path: "cinemaRoom", select: "roomNumber" },
            options: groupCode ? { sort: sortOption } : {}
        })

        if (!movie) {
            return res.status(404).json({ message: "Movie not found..." })
        }

        return res.status(200).json({ screenings: movie.screenings })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Screenings not found for the movie..." })
    }
}

export const getCommentsByMovie = async (req, res, next) => {
    try {
        const { slug } = req.params
        const movie = await Movie.findOne({ slug })
        const comments = await Comment.find({ movie: movie._id }).populate("user", "name")
        res.status(200).json({ comments })
    } catch (err) {
        next(err)
    }
}

export const getMovieStatistics = async (req, res, next) => {
    try {
        const moviesStatistics = []
        const movies = await Movie.find().populate("screenings").lean()

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: "movies not found..." })
        }

        for (const movie of movies) {
            const screenings = await Screening.find({ movie: movie._id })
                .populate("bookings").populate("cinemaRoom").lean()

            let ticketsBookedLength = 0
            let revenue = 0
            let totalSeats = 0
            let selectedSeats = 0

            for (const screening of screenings) {
                ticketsBookedLength += screening.bookings.length

                for (const booking of screening.bookings) {
                    revenue += booking.totalMoney
                }

                if (screening.cinemaRoom) {
                    const cinemaRoom = await CinemaRoom.findById(screening.cinemaRoom._id).populate("seats").lean()

                    if (cinemaRoom && cinemaRoom.seats) {
                        totalSeats += cinemaRoom.seats.length
                        selectedSeats += cinemaRoom.seats.filter(seat => seat.selected).length
                    }
                }
            }

            const percentSeatBooked = totalSeats ? (selectedSeats / totalSeats) * 100 : 0
            const percentSeatNotBooked = percentSeatBooked === 0 ? 100 : ((totalSeats - selectedSeats) / totalSeats) * 100

            moviesStatistics.push({
                title: movie.title,
                totalScreenings: movie.screenings ? movie.screenings.length : 0,
                ticketsBookedLength,
                revenue,
                percentSeatBooked: percentSeatBooked.toFixed(2),
                percentSeatNotBooked: percentSeatNotBooked.toFixed(2)
            })
        }

        return res.status(200).json({ moviesStatistics })
    } catch (err) {
        next(err)
    }
}