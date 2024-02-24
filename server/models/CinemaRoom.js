import mongoose from "mongoose"

const Schema = mongoose.Schema
const cinemaRoomSchema = new Schema({
    roomId: {
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
})

export default mongoose.model("CinemaRoom", cinemaRoomSchema)
