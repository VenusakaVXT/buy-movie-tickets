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
    address: {
        type: String,
    },
    bookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Booking",
        },
    ],
    ratingPoints: {
        type: Number
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
    ],
    cancelBookings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "CancelBooking",
        },
    ],
    isOnline: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("User", userSchema)