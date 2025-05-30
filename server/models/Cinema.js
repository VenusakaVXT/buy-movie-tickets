import mongoose from "mongoose"

const Schema = mongoose.Schema
const cinemaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    img: {
        type: String,
    },
    description: {
        type: String,
    },
    cinemaRooms: [
        {
            type: mongoose.Types.ObjectId,
            ref: "CinemaRoom"
        }
    ],
    employees: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Employee"
        }
    ],
    waterCornCombos: [
        {
            type: mongoose.Types.ObjectId,
            ref: "WaterCornCombo"
        }
    ],
    promotionPrograms: [
        {
            type: mongoose.Types.ObjectId,
            ref: "PromotionProgram"
        }
    ]
})

export default mongoose.model("Cinema", cinemaSchema)