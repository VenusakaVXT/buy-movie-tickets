import express from "express"
import {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    updateMovieInCategory
} from "../controllers/categoryController.js"

const categoryRouter = express.Router()

categoryRouter.post("/", addCategory)
categoryRouter.get("/", getAllCategories)
categoryRouter.get("/:id", getCategoryById)
categoryRouter.put("/:id", updateCategory)
categoryRouter.put("/:categoryId/movies/:movieId", updateMovieInCategory)

export default categoryRouter