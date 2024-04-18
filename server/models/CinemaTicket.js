import mongoose from "mongoose"

const Schema = mongoose.Schema
const ticketSchema = new Schema({
    ticketId: {
        type: String,
        required: true,
    },
    booking: {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    payment: {
        type: mongoose.Types.ObjectId,
        ref: "Payment",
    },
})

ticketSchema.virtual("totalMoney").get(() => this.price * this.quantity)
ticketSchema.set("toJSON", { virtuals: true })

export default mongoose.model("Seat", ticketSchema)