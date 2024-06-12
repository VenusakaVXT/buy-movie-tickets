import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Movie from "../models/Movie.js"
import Manager from "../models/Employee.js"
import Producer from "../models/Producer.js"
import slugify from "slugify"
import Screening from "../models/Screening.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Comment from "../models/Comment.js"

export const getAllMovies = async (req, res, next) => {
    let movies

    try {
        movies = await Movie.find()
    } catch (err) {
        console.error(err)
    }

    if (!movies) {
        return res.status(500).json({ message: "request failed..." })
    }

    return res.status(200).json({ movies })
}

export const getMovieById = async (req, res, next) => {
    const id = req.params.id

    let movie

    try {
        movie = await Movie.findById(id)
    } catch (err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(404).json({ message: "invalid movie id..." })
    }

    return res.status(200).json({ movie })
}

export const getMovieBySlug = async (req, res, next) => {
    let movie

    try {
        movie = await Movie.findOne({ slug: req.params.slug })
            .populate("category", "category")
            .populate("producer", "producerName")
    } catch (err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(404).json({ message: "invalid movie slug..." })
    }

    return res.status(200).json({ movie })
}

export const addMovie = async (req, res, next) => {
    // omit the word "Bearer" and just take the string <token>
    const extractedToken = req.headers.authorization.split(" ")[1]

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

    // create new movie
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
        return res.status(422).json({ message: "invalid inputs..." })
    }

    let movie

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
        movie.slug = slugify(movie.title, { lower: true })

        const session = await mongoose.startSession()
        session.startTransaction()
        await movie.save({ session })

        const producerMovie = await Producer.findById(movie.producer)
        producerMovie.movies.push(movie._id)
        await producerMovie.save({ session })

        const managerUser = await Manager.findById(managerId)
        managerUser.addedMovies.push(movie._id)
        await managerUser.save({ session })

        await session.commitTransaction()
    } catch (err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(500).json({ message: "request failed..." })
    }

    return res.status(201).json({ movie })
}

export const deleteMovie = async (req, res, next) => {
    const id = req.params.id
    let movie

    try {
        movie = await Movie.findByIdAndRemove(id)
    } catch (err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(500).json({ message: "unable to delete..." })
    }

    return res.status(200).json({ message: "successfully delete!!!" })
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
            producer
        }, { new: true })

        if (!updatedMovie) {
            res.status(404).json({ message: "invalid movie id..." })
        }

        res.status(200).json(updatedMovie)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getScreeningsByMovieSlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const movie = await Movie.findOne({ slug }).populate({
            path: "screenings",
            select: "_id movieDate timeSlot price cinemaRoom",
            populate: {
                path: "cinemaRoom",
                select: "roomNumber"
            }
        })

        if (!movie) {
            return res.status(404).json({ message: "movie not found..." })
        }

        return res.status(200).json({ screenings: movie.screenings })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: next })
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