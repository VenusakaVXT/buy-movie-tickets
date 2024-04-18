import express from "express"
import cinemaController from "../controllers/cinemaController.js"

const cinemaRouter = express.Router()

cinemaRouter.get("/", cinemaController.getApiCinema)
cinemaRouter.get("/create", cinemaController.create)
cinemaRouter.post("/store", cinemaController.store)
cinemaRouter.get("/table-lists", cinemaController.tableLists)
cinemaRouter.get("/:id/edit", cinemaController.edit)
cinemaRouter.put("/:id", cinemaController.update)
cinemaRouter.delete("/:id", cinemaController.delete)

export default cinemaRouter
