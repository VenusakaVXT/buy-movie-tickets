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
    director: [
        {
            type: String,
            required: true,
        }
    ],
    contentWritter: [
        {
            type: String,
            required: true,
        }
    ],
    actors: [
        {
            type: String,
            required: true,
        }
    ],
    category: [
        {
            type: String,
            required: true,
        }
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
    },
    featured: {
        type: Boolean,
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    }],
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true,
    }
})

export default mongoose.model("Movie", movieSchema)