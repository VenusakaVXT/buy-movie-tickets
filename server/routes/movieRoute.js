import express from "express"
import {
    addMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    getMovieBySlug,
    getScreeningsByMovieSlug,
    updateMovie,
} from "../controllers/movieController.js"

const movieRouter = express.Router()

movieRouter.get("/", getAllMovies)
movieRouter.get("/:id", getMovieById)
movieRouter.get("/:slug/detail", getMovieBySlug)
movieRouter.post("/", addMovie)
movieRouter.delete("/:id", deleteMovie)
movieRouter.put("/:id", updateMovie)
movieRouter.get("/:slug/screenings", getScreeningsByMovieSlug)

export default movieRouter