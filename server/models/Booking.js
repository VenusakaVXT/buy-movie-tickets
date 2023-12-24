import mongoose from "mongoose"

const Schema = mongoose.Schema
const bookingSchema = new Schema({
    movie: {
        type: mongoose.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    bookingDate: {
        // mm/dd/yyyy
        type: Date,
        required: true,
    },
    seatNumber: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

export default mongoose.model("Booking", bookingSchema)
