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

commentSchema.virtual("periodAfterCreation").get(function () {
    const now = moment()
    const createdAt = moment(this.createdAt)
    const duration = moment.duration(now.diff(createdAt))

    if (duration.asMinutes() < 60) {
        return { timeUnit: "minutes", duration: Math.floor(duration.asMinutes()) }
    } else if (duration.asHours() < 24) {
        return { timeUnit: "hours", duration: Math.floor(duration.asHours()) }
    } else if (duration.asDays() < 7) {
        return { timeUnit: "days", duration: Math.floor(duration.asDays()) }
    } else if (duration.asWeeks() < 4) {
        return { timeUnit: "weeks", duration: Math.floor(duration.asWeeks()) }
    } else if (duration.asMonths() < 12) {
        return { timeUnit: "months", duration: Math.floor(duration.asMonths()) }
    } else {
        return { timeUnit: "years", duration: Math.floor(duration.asYears()) }
    }
})

commentSchema.set("toJSON", { virtuals: true })
commentSchema.set("toObject", { virtuals: true })

export default mongoose.model("Comment", commentSchema)