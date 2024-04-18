import express from "express"
import categoryFilmController from "../controllers/categoryFilmController.js"

const categoryFilmRouter = express.Router()

categoryFilmRouter.get("/create", categoryFilmController.create)
categoryFilmRouter.post("/store", categoryFilmController.store)
categoryFilmRouter.get("/table-lists", categoryFilmController.tableLists)
categoryFilmRouter.get("/:id/edit", categoryFilmController.edit)
categoryFilmRouter.put("/:id", categoryFilmController.update)
categoryFilmRouter.delete("/:id", categoryFilmController.delete)

export default categoryFilmRouter