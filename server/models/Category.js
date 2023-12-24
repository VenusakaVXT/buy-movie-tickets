import mongoose from "mongoose"

const Schema = mongoose.Schema
const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    movies: [
        {
            title: {
                type: String,
                required: true,
            },
            img: {
                type: String,
                required: true,
            },
        },
    ],
})

export default mongoose.model("Category", categorySchema)
