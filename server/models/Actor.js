import mongoose, { Types } from "mongoose"

const Schema = mongoose.Schema
const actorChema = new Schema({
    actorName: {
        type: String,
        required: true,
    },
    actorBirthday: {
        type: String,
        required: true,
    },
    gender: {
        type: Boolean,
        required: true,
    },
    movies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie"
        }
    ]
})

export default mongoose.model("Actor", actorChema)