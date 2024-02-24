import mongoose from "mongoose"

const Schema = mongoose.Schema
const customerSchema = new Schema({
    customerName: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
        unique: true,
    },
    customerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    birthDay: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    customerAdress: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
})

export default mongoose.model("Customer", customerSchema)
