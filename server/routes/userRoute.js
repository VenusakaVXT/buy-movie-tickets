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
    userComment,
    userDeleteComment,
    comparePassword,
    getCancelBookingsByUser,
    changePassword,
    sendCodeToEmail,
    forgotPassword,
    userDeleteBooking
} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)
userRouter.post("/register", register)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.post("/login", login)
userRouter.get("/:id/bookings", getBookingOfUser)
userRouter.delete("/:userId/bookings/:bookingId", userDeleteBooking)
userRouter.get("/customers/ranking", getCustomersRanking)
userRouter.post("/create-comment", userComment)
userRouter.delete("/delete-comment/:commentId", userDeleteComment)
userRouter.post("/:id/compare-password", comparePassword)
userRouter.get("/:id/cancel-bookings", getCancelBookingsByUser)
userRouter.put("/:id/change-password", changePassword)
userRouter.post("/send-code-to-email", sendCodeToEmail)
userRouter.post("/forgot-password", forgotPassword)

export default userRouter