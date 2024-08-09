import express from "express"
import homeController from "../controllers/homeController.js"

const homeRouter = express.Router()

homeRouter.get("/dashboard", homeController.index)
homeRouter.get("/admin/login", homeController.authUI)
homeRouter.post("/admin/login", homeController.adminLogin)

export default homeRouter