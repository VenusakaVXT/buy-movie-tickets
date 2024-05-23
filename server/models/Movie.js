import mongoose from "mongoose"
import mongooseDelete from "mongoose-delete"

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
    director: {
        type: String,
        required: true,
    },
    contentWritter: {
        type: String,
        required: true,
    },
    actors: {
        type: String,
        required: true,
    },
    category: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Category",
        }
    ],
    releaseDate: {
        type: String,
    },
    time: {
        type: Number,
    },
    trailerId: {
        type: String,
    },
    wasReleased: {
        type: Boolean,
        required: true,
    },
    producer: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Producer",
        }
    ],
    screenings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Screening"
        }
    ],
    manager: {
        type: mongoose.Types.ObjectId,
        ref: "Manager",
    },
    slug: {
        type: String,
        unique: true
    }
})

// Add plugins
movieSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all"
})

export default mongoose.model("Movie", movieSchema)