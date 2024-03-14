import mongoose from "mongoose"

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
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
    birthDay: {
        type: Date,
    },
    gender: {
        type: String,
    },
    adress: {
        type: String,
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking",
        },
    ],
})

export default mongoose.model("User", userSchema)
