import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use("/", (req, res, next) => {
    res.send("Connect database successfully (#2)")
})

mongoose
    .connect(
        `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.awc33ii.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() =>
        app.listen(5000, () => {
            console.log(`Run project on url localhost:${PORT}`)
        })
    )
    .catch(err => console.error(err))