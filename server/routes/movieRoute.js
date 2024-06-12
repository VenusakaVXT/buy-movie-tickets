import express from "express"
import {
    addMovie,
    deleteMovie,
    getAllMovies,
    getCommentsByMovie,
    getMovieById,
    getMovieBySlug,
    getMovieStatistics,
    getScreeningsByMovieSlug,
    updateMovie,
} from "../controllers/movieController.js"

const movieRouter = express.Router()

movieRouter.get("/", getAllMovies)
movieRouter.get("/statistics", getMovieStatistics)
movieRouter.get("/:id", getMovieById)
movieRouter.get("/:slug/detail", getMovieBySlug)
movieRouter.post("/", addMovie)
movieRouter.delete("/:id", deleteMovie)
movieRouter.put("/:id", updateMovie)
movieRouter.get("/:slug/screenings", getScreeningsByMovieSlug)
movieRouter.get("/:slug/comments", getCommentsByMovie)

export default movieRouter