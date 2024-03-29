import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Movie from "../models/Movie.js"
import Admin from "../models/Admin.js"

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
        return res.status(404).json({
            message: "invalid movie id...",
        })
    }

    return res.status(200).json({ movie })
}

export const addMovie = async (req, res, next) => {
    // omit the word "Bearer" and just take the string <token>
    const extractedToken = req.headers.authorization.split(" ")[1]

    if (!extractedToken && extractedToken.trim() === "") {
        return res.status(404).json({
            message: "token not found...",
        })
    }

    let adminId

    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({
                message: `${err.message}`,
            })
        } else {
            adminId = decrypted.id
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
        producer,
        featured
    } = req.body

    if (
        !title &&
        title.trim() === "" &&
        !description &&
        description.trim() === "" &&
        !trailerId &&
        trailerId.trim() === ""
    ) {
        return res.status(422).json({
            message: "invalid inputs...",
        })
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
            releaseDate: new Date(`${releaseDate}`),
            time,
            featured,
            wasReleased,
            producer,
            trailerId,
            admin: adminId,
        })

        const session = await mongoose.startSession()
        session.startTransaction()
        await movie.save({ session })

        const adminUser = await Admin.findById(adminId)
        adminUser.addedMovies.push(movie)
        await adminUser.save({ session })

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
        producer,
        featured
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
            featured
        }, { new: true })

        if (!updatedMovie) {
            res.status(404).json({ message: "invalid movie id..." })
        }

        res.status(200).json(updatedMovie)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
