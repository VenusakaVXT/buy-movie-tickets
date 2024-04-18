import mongoose from "mongoose"

const Schema = mongoose.Schema
const producerSchema = new Schema({
    producerName: {
        type: String,
        required: true,
    },
    producerEmail: {
        type: String
    },
    movies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie"
        }
    ]
})

export default mongoose.model("Producer", producerSchema)