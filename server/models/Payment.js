import mongoose from "mongoose"

const Schema = mongoose.Schema
const paymentSchema = new Schema({
    paymentMethodName: {
        type: String,
        required: true,
    },
    bank: {
        type: mongoose.Types.ObjectId,
        ref: "Bank",
    },
})

export default mongoose.model("Payment", paymentSchema)
