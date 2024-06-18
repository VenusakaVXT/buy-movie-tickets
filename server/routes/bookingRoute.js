import express from "express"
import {
    getBookingById,
    newBooking,
    detailAllBooking,
    cancelBooking,
    detailCancelBooking,
    getAllCancelBooking,
    approveRequestCancelBooking,
    restoreBooking,
} from "../controllers/bookingController.js"

const bookingRouter = express.Router()

bookingRouter.get("/detail-booking", detailAllBooking)
bookingRouter.post("/", newBooking)
bookingRouter.get("/:id", getBookingById)
bookingRouter.post("/cancel-booking", cancelBooking)
bookingRouter.get("/cancel-booking/:id/detail", detailCancelBooking)
bookingRouter.patch("/cancel-booking/:id/restore", restoreBooking)
bookingRouter.get("/cancel-booking/all", getAllCancelBooking)
bookingRouter.put("/cancel-booking/:id/approve-request", approveRequestCancelBooking)

export default bookingRouter