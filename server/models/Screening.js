import mongoose from "mongoose"

const Schema = mongoose.Schema
const screeningSchema = new Schema({
    movie: {
        type: mongoose.Types.ObjectId,
        ref: "Movie",
    },
    movieDate: {
        type: Date,
        required: true,
    },
    timeSlot: {
        // type: TimeRanges,
        type: Date,
        required: true,
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking",
        },
    ],
})

export default mongoose.model("Screening", screeningSchema)
