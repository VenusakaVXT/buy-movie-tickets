import mongoose from "mongoose"
import slug from "mongoose-slug-generator"
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
            type: mongoose.Types.ObjectId,
            ref: "Actor",
        },
    ],
    category: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Category",
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
    producer: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Producer",
        }
    ],
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
    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
})

// Add plugins
mongoose.plugin(slug)
movieSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all"
})

export default mongoose.model("Movie", movieSchema)
