import express from "express"
import { 
    addAdmin, 
    adminLogin,
} from "../controllers/adminController.js"

const adminRouter = express.Router()

adminRouter.post("/register", addAdmin)
adminRouter.post("/login", adminLogin)

export default adminRouter