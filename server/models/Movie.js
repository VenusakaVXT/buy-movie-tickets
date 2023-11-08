import mongoose from "mongoose"

const Schema = mongoose.Schema
const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    actors: [
        {
            type: String,
            required: true,
        }
    ],
    releaseDate: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
    },
    bookings: [{ type: String }],
    admin: {
        type: String,
        required: true,
    }
})

export default mongoose.model("Movie", movieSchema)