import express from "express"
import { getAllUsers, register } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/register", register)

export default userRouter