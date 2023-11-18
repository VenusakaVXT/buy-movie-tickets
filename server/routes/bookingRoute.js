import express from "express"
import { 
    getBookingById,
    newBooking,
} from "../controllers/bookingController.js"

const bookingRouter = express.Router()

bookingRouter.post("/", newBooking)
bookingRouter.get("/:id", getBookingById)

export default bookingRouter