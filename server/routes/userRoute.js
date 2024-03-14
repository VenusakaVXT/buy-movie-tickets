import express from "express"
import {
    getAllUsers,
    register,
    updateUser,
    deleteUser,
    login,
    getBookingOfUser,
} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/register", register)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.post("/login", login)
userRouter.get("/booking/:id", getBookingOfUser)

export default userRouter
