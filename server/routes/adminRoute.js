import express from "express"
import {
    addAdmin,
    adminLogin,
    getAdmins,
} from "../controllers/adminController.js"

const adminRouter = express.Router()

adminRouter.get("/", getAdmins)
adminRouter.post("/register", addAdmin)
adminRouter.post("/login", adminLogin)

export default adminRouter
