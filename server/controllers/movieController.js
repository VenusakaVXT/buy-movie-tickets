import jwt from "jsonwebtoken"
import Movie from "../models/Movie.js"

export const getAllMovies = async (req, res, next) => {
    let movies

    try {
        movies = await Movie.find()
    } catch(err) {
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
    } catch(err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(404).json({
            message: "invalid movie id..."
        })
    }

    return res.status(200).json({ movie })
}

export const addMovie = async (req, res, next) => {
    // omit the word "Bearer" and just take the string <token>
    const extractedToken = req.headers.authorization.split(" ")[1]

    if (!extractedToken && extractedToken.trim() === "") {
        return res.status(404).json({
            message: "token not found..."
        })
    }

    let adminId

    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({
                message: `${err.message}`
            })
        } else {
            adminId = decrypted.id
            return
        }
    })

    // create new movie
    const {
        title, description, actors, releaseDate, posterUrl, featured
    } = req.body

    if (
        !title && title.trim() === ""
        && !description && description.trim() === ""
        && !posterUrl && posterUrl.trim() === ""
    ) {
        return res.status(422).json({
            message: "invalid inputs..."
        })
    }

    let movie

    try {
        movie = new Movie({
            title,
            description,
            actors,
            releaseDate: new Date(`${releaseDate}`),
            featured,
            posterUrl,
            admin: adminId
        })
        movie = await movie.save()
    } catch(err) {
        console.error(err)
    }

    if (!movie) {
        return res.status(500).json({ message: "request failed..." })
    }

    return res.status(201).json({ movie })
}