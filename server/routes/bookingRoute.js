import express from "express"
import { 
    newBooking,
} from "../controllers/bookingController.js"

const bookingRouter = express.Router()

bookingRouter.post("/", newBooking)

export default bookingRouter