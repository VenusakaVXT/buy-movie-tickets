import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession"
    },
    sender: {
        type: String,
        enum: ["customer", "manager"],
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Message", MessageSchema)