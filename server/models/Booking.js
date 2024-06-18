import mongoose from "mongoose"

const Schema = mongoose.Schema
const bookingSchema = new Schema({
    screening: {
        type: mongoose.Types.ObjectId,
        ref: "Screening",
        required: true,
    },
    seats: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Seat",
        },
    ],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalMoney: {
        type: Number,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    },
    cancelled: {
        type: Boolean
    }
}, { timestamps: true })

export default mongoose.model("Booking", bookingSchema)