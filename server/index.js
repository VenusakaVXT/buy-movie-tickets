import express from "express"
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use("/", (req, res, next) => {
    res.send("Hello World")
})

app.listen(5000, () => {
    console.log(`Run project on url localhost:${PORT}`)
})