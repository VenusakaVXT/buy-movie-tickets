import mongoose from "mongoose"

const Schema = mongoose.Schema
const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    movies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie"
        },
        {
            title: {
                type: String,
            },
            img: {
                type: String,
            },
        },
    ],
})

export default mongoose.model("Category", categorySchema)