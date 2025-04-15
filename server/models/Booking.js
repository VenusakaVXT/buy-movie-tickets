import mongoose from "mongoose"

const Schema = mongoose.Schema
const bookingSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    screening: {
        type: mongoose.Types.ObjectId,
        ref: "Screening",
        required: true
    },
    seats: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Seat",
            required: true
        },
    ],
    waterCornCombos: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "WaterCornCombo"
            },
            quantity: {
                type: Number
            }
        }
    ],
    promotionProgram: {
        type: mongoose.Types.ObjectId,
        ref: "PromotionProgram"
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