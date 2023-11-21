import mongoose from "mongoose"

const Schema = mongoose.Schema
const cinemaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    openTime: {
        type: Date,
        required: true
    },
    closeTime: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

export default mongoose.model("Cinema", cinemaSchema)