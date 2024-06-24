import express from "express"
import homeController from "../controllers/homeController.js"

const homeRouter = express.Router()

homeRouter.get("/", homeController.index)
homeRouter.post("/admin/login", homeController.adminLogin)

export default homeRouter