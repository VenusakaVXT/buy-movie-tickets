import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import homeRouter from "./routes/homeRoute.js"
import userRouter from "./routes/userRoute.js"
import managerRouter from "./routes/managerRoute.js"
import movieRouter from "./routes/movieRoute.js"
import bookingRouter from "./routes/bookingRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import cinemaRouter from "./routes/cinemaRoute.js"
import movieScreeningRouter from "./routes/movieScreeningRoute.js"
import categoryFilmRouter from "./routes/categoryFilmRoute.js"
import producerRouter from "./routes/producerRoute.js"
import cinemaRoomRouter from "./routes/cinemaRoomRoute.js"
import seatRouter from "./routes/seatRoute.js"
import screeningRouter from "./routes/screeningRoute.js"
import employeeRouter from "./routes/employeeRoute.js"
import promotionProgramRouter from "./routes/promotionProgramRoute.js"
import waterCornComboRouter from "./routes/waterCornComboRoute.js"
import configCors from "./config/fixCORS.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import nunjucks from "nunjucks"
import lessMiddleware from "less-middleware"
import methodOverride from "method-override"
import flash from "connect-flash"
import cors from "cors"
import session from "express-session"
import http from "http"
import { Server } from "socket.io"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

// Socket.IO
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_URL,
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("a user connected")
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

export { io }

// Middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())

// Convert HTTPS Method
app.use(methodOverride("_method"))

// Session control
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// Fix CORS
configCors(app)
app.use(cors("*"))

// Router
app.use("/home", homeRouter)
app.use("/user", userRouter)
app.use("/manager", managerRouter)
app.use("/movie", movieRouter)
app.use("/booking", bookingRouter)
app.use("/category", categoryRouter)
app.use("/cinema", cinemaRouter)
app.use("/movie-screening", movieScreeningRouter)
app.use("/category-film", categoryFilmRouter)
app.use("/producer", producerRouter)
app.use("/cinemaroom", cinemaRoomRouter)
app.use("/seat", seatRouter)
app.use("/screening", screeningRouter)
app.use("/employee", employeeRouter)
app.use("/promotion-program", promotionProgramRouter)
app.use("/water-corn-combo", waterCornComboRouter)

// Static file
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/uploads")))

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
        server.listen(5000, () => {
            console.log(`Run project on url localhost:${PORT}`)
        })
    )
    .catch((err) => console.error(err))
