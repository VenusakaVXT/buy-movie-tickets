import express from "express"
import {
    addMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
} from "../controllers/movieController.js"

const movieRouter = express.Router()

movieRouter.get("/", getAllMovies)
movieRouter.get("/:id/detail", getMovieById)
movieRouter.get("/create", addMovie)
movieRouter.delete("/:id", deleteMovie)
movieRouter.put("/:id", updateMovie)

export default movieRouter
