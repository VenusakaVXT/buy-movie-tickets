import express from "express"
import categoryFilmController from "../controllers/categoryFilmController.js"

const categoryFilmRouter = express.Router()

categoryFilmRouter.get("/create", categoryFilmController.create)
categoryFilmRouter.post("/store", categoryFilmController.store)
categoryFilmRouter.get("/table-lists", categoryFilmController.tableLists)

export default categoryFilmRouter