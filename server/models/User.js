import mongoose from "mongoose"

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    birthDay: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    }]
})

export default mongoose.model("User", userSchema)