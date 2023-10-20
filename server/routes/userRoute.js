import express from "express"
import { getAllUsers } from "../controllers/userController"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)

export default userRouter