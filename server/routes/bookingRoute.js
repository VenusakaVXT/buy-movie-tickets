import express from "express"
import {
    cancelBooking,
    getBookingById,
    newBooking,
    detailAllBooking
} from "../controllers/bookingController.js"

const bookingRouter = express.Router()

bookingRouter.get("/detail-booking", detailAllBooking)
bookingRouter.post("/", newBooking)
bookingRouter.get("/:id", getBookingById)
bookingRouter.delete("/:id", cancelBooking)

export default bookingRouter