import mongoose from "mongoose"

const Schema = mongoose.Schema
const cinemaRoomSchema = new Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    totalNumSeat: {
        type: Number,
        required: true,
    },
    cinema: {
        type: mongoose.Types.ObjectId,
        ref: "Cinema",
    },
    seats: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Seat"
        }
    ],
    screenings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Screening"
        }
    ]
})

export default mongoose.model("CinemaRoom", cinemaRoomSchema)