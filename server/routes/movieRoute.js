import express from "express"
import { 
    addMovie, 
    getAllMovies 
} from "../controllers/movieController.js"

const movieRouter = express.Router()

movieRouter.get("/", getAllMovies)
movieRouter.post("/", addMovie)

export default movieRouter