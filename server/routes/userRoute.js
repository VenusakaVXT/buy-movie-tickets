import express from "express"
import { getAllUsers, register, updateUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/register", register)
userRouter.put("/:id", updateUser)

export default userRouter