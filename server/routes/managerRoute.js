import express from "express"
import {
    addManager,
    managerLogin,
    getManagers,
    getManagerById,
    getEmployeeStatistics,
} from "../controllers/managerController.js"

const managerRouter = express.Router()

managerRouter.get("/", getManagers)
managerRouter.get("/:id", getManagerById)
managerRouter.post("/register", addManager)
managerRouter.post("/login", managerLogin)
managerRouter.get("/statistics/employees", getEmployeeStatistics)

export default managerRouter