import mongoose from "mongoose"

const ChatSessionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closed: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("ChatSession", ChatSessionSchema)