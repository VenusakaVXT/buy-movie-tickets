import express from "express"
import {
    getAllUsers,
    register,
    updateUser,
    deleteUser,
    login,
    getBookingOfUser,
    getUserById,
    getCustomersRanking,
} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)
userRouter.post("/register", register)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.post("/login", login)
userRouter.get("/:id/bookings", getBookingOfUser)
userRouter.get("/customers/ranking", getCustomersRanking)

export default userRouter