import mongoose from "mongoose"

const Schema = mongoose.Schema
const waterCornComboSchema = new Schema({
    comboName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    components: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cinema: {
        type: mongoose.Types.ObjectId,
        ref: "Cinema"
    }
})

export default mongoose.model("WaterCornCombo", waterCornComboSchema)