import mongoose from "mongoose"
import slug from "mongoose-slug-generator"

mongoose.plugin(slug)

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
    director: [
        {
            type: String,
            required: true,
        },
    ],
    contentWritter: [
        {
            type: String,
            required: true,
        },
    ],
    actors: [
        {
            type: String,
            required: true,
        },
    ],
    category: [
        {
            type: String,
            required: true,
        },
    ],
    releaseDate: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    trailerId: {
        type: String,
        required: true,
    },
    wasReleased: {
        type: Boolean,
        required: true,
    },
    featured: {
        type: Boolean,
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking",
        },
    ],
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        //required: true,
    },
    slug: {
        type: String,
        slug: "title"
    }
})

export default mongoose.model("Movie", movieSchema)
