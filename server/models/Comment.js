import mongoose from "mongoose"
import moment from "moment"

const Schema = mongoose.Schema
const commentSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    movie: {
        type: mongoose.Types.ObjectId,
        ref: "Movie"
    },
}, { timestamps: true })

commentSchema.virtual("periodAfterCreation").get(function() {
    const now = moment()
    const createdAt = moment(this.createdAt)
    const duration = moment.duration(now.diff(createdAt))

    if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())} minutes ago`
    } else if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())} hours ago`
    } else if (duration.asDays() < 7) {
        return `${Math.floor(duration.asDays())} days ago`
    } else if (duration.asWeeks() < 4) {
        return `${Math.floor(duration.asWeeks())} weeks ago`
    } else if (duration.asMonths() < 12) {
        return `${Math.floor(duration.asMonths())} months ago`
    } else {
        return `${Math.floor(duration.asYears())} years ago`
    }
})

commentSchema.set("toJSON", { virtuals: true })
commentSchema.set("toObject", { virtuals: true })

export default mongoose.model("Comment", commentSchema)