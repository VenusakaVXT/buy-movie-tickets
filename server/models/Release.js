import mongoose from "mongoose"

const Schema = mongoose.Schema
const releaseSchema = new Schema({
    screening: {
        type: mongoose.Types.ObjectId,
        ref: "Screening",
    },
    cinemaRoom: {
        type: mongoose.Types.ObjectId,
        ref: "CinemaRoom",
    },
})

export default mongoose.model("Screening", releaseSchema)
