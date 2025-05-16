import mongoose from "mongoose"

const Schema = mongoose.Schema
const promotionProgramSchema = new Schema({
    discountCode: {
        type: String,
        required: true
    },
    programName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    percentReduction: {
        type: Number,
        required: true
    },
    maxMoneyAmount: {
        type: Number,
        required: true
    },
    condition: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    cinema: {
        type: mongoose.Types.ObjectId,
        ref: "Cinema",
        required: false
    },
    customers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
}, { timestamps: true })

export default mongoose.model("PromotionProgram", promotionProgramSchema)