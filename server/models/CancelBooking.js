import mongoose from "mongoose"

const Schema = mongoose.Schema
const cancelBookingSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    booking: {
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    },
    reason: {
        type: String,
        required: true
    },
    refunds: {
        type: Number,
        required: true
    },
    compensationPercent: {
        type: Number,
        required: true
    },
    approveRequest: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

export default mongoose.model("CancelBooking", cancelBookingSchema)