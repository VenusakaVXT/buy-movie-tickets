import mongoose from "mongoose"

const Schema = mongoose.Schema
const screeningSchema = new Schema({
    movie: {
        type: mongoose.Types.ObjectId,
        ref: "Movie",
    },
    movieDate: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    cinemaRoom: {
        type: mongoose.Types.ObjectId,
        ref: "CinemaRoom",
    },
    wasReleased: {
        type: Boolean,
        default: true,
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking",
        },
    ],
})

export default mongoose.model("Screening", screeningSchema)