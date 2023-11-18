import express from "express"
import { 
    cancelBooking,
    getBookingById,
    newBooking,
} from "../controllers/bookingController.js"

const bookingRouter = express.Router()

bookingRouter.post("/", newBooking)
bookingRouter.get("/:id", getBookingById)
bookingRouter.delete("/:id", cancelBooking)

export default bookingRouter