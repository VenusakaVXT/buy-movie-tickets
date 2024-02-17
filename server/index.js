import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import homeRouter from "./routes/homeRoute.js"
import userRouter from "./routes/userRoute.js"
import adminRouter from "./routes/adminRoute.js"
import movieRouter from "./routes/movieRoute.js"
import bookingRouter from "./routes/bookingRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import cinemaRouter from "./routes/cinemaRoute.js"
import movieScreeningRouter from "./routes/movieScreeningRoute.js"
import configCors from "./config/fixCORS.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import nunjucks from "nunjucks"
import lessMiddleware from "less-middleware"
import methodOverride from "method-override"
import sortMiddleware from "./middlewares/SortMiddleware.js"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

// Middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Convert HTTPS Method
app.use(methodOverride("_method"))

// Fix CORS
configCors(app)

// Router
app.use("/", homeRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/movie", movieRouter)
app.use("/booking", bookingRouter)
app.use("/category", categoryRouter)
app.use("/cinema", cinemaRouter)
app.use("/movie-screening", movieScreeningRouter)

// Static file
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, "public")))

// Template engine
nunjucks.configure("views", {
    autoescape: true,
    express: app
})

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "njk")

app.use(lessMiddleware("views/less", { force: true }))
app.use(express.static("public"))

mongoose
    .connect(
        `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.awc33ii.mongodb.net/?retryWrites=true&w=majority`,
    )
    .then(() =>
        app.listen(5000, () => {
            console.log(`Run project on url localhost:${PORT}`)
        }),
    )
    .catch((err) => console.error(err))
