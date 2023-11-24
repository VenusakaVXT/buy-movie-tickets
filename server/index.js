import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import userRouter from './routes/userRoute.js'
import adminRouter from "./routes/adminRoute.js"
import movieRouter from "./routes/movieRoute.js"
import bookingRouter from "./routes/bookingRoute.js"
//import cors from "cors"
import configCors from "./config/fixCORS.js"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

// Middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Fix CORS
configCors(app)
//app.use(cors())

// Router
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/movie", movieRouter)
app.use("/booking", bookingRouter)

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