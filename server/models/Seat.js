import mongoose from "mongoose"

const Schema = mongoose.Schema
const seatSchema = new Schema({
    rowSeat: {
        type: String,
        required: true,
    },
    seatNumber: {
        type: String,
        required: true,
    },
    seatType: {
        type: String,
        required: true,
    },
    cinemaRoom: {
        type: mongoose.Types.ObjectId,
        ref: "CinemaRoom",
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking"
        }
    ]
})

export default mongoose.model("Seat", seatSchema)