import mongoose from "mongoose"

const Schema = mongoose.Schema
const seatSchema = new Schema({
    seatId: {
        type: String,
        required: true,
    },
    seatType: {
        type: Boolean,
        required: true,
    },
    seatPosition: {
        type: String,
        required: true,
    },
    cinemaRoom: {
        type: mongoose.Types.ObjectId,
        ref: "CinemaRoom",
    },
})

export default mongoose.model("Seat", seatSchema)
