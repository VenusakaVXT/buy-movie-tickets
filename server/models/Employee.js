import mongoose from "mongoose"

const Schema = mongoose.Schema
const managerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    position: {
        type: String,
        required: true,
    },
    cinema: {
        type: mongoose.Types.ObjectId,
        ref: "Cinema",
    },
    addedMovies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie",
        },
    ],
    addedScreenings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Screening",
        },
    ]
})

export default mongoose.model("Manager", managerSchema)