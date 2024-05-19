import express from "express"
import {
    addManager,
    managerLogin,
    getManagers,
    getManagerById,
} from "../controllers/managerController.js"

const managerRouter = express.Router()

managerRouter.get("/", getManagers)
managerRouter.get("/:id", getManagerById)
managerRouter.post("/register", addManager)
managerRouter.post("/login", managerLogin)

export default managerRouter