import mongoose from "mongoose"

const Schema = mongoose.Schema
const cinemaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
})

export default mongoose.model("Cinema", cinemaSchema)
