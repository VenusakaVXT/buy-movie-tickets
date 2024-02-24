import mongoose from "mongoose"

const Schema = mongoose.Schema
const bookingSchema = new Schema({
    screening: {
        type: mongoose.Types.ObjectId,
        ref: "Screening",
        required: true,
    },
    bookingDate: {
        // mm/dd/yyyy
        type: Date,
        required: true,
    },
    seat: {
        type: mongoose.Types.ObjectId,
        ref: "Seat",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

export default mongoose.model("Booking", bookingSchema)
