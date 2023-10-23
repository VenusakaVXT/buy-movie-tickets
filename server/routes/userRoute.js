import express from "express"
import { deleteUser, getAllUsers, register, updateUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/register", register)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)

export default userRouter