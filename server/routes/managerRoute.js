import express from "express"
import {
    addManager,
    managerLogin,
    getManagers,
} from "../controllers/managerController.js"

const managerRouter = express.Router()

managerRouter.get("/", getManagers)
managerRouter.post("/register", addManager)
managerRouter.post("/login", managerLogin)

export default managerRouter