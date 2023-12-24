import express from "express"
import {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    login,
    getBookingOfUser,
} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/register", addUser)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.post("/login", login)
userRouter.get("/booking/:id", getBookingOfUser)

export default userRouter
