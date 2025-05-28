import mongoose from "mongoose"

const FaqTemplateSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

export default mongoose.model("FaqTemplate", FaqTemplateSchema)