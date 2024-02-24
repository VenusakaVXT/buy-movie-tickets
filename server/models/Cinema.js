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
    img: {
        type: String,
    },
    description: {
        type: String,
    }
})

export default mongoose.model("Cinema", cinemaSchema)
