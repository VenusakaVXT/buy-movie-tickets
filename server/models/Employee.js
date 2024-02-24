import mongoose from "mongoose"

const Schema = mongoose.Schema
const employeeSchema = new Schema({
    employeeEmail: {
        type: String,
        required: true,
        unique: true,
    },
    employeePassword: {
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
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    addedMovies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie",
        },
    ],
})

export default mongoose.model("Employee", employeeSchema)
