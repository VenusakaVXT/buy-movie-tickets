import express from "express"
import { 
    addCinema, 
    getAllCinema 
} from "../controllers/cinemaController.js"

const cinemaRouter = express.Router()

cinemaRouter.post("/", addCinema)
cinemaRouter.get("/", getAllCinema)

export default cinemaRouter