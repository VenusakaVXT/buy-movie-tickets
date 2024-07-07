import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Manager from "../models/Employee.js"
import { io } from "../index.js"

dotenv.config()

const salt = bcrypt.genSaltSync(10) // saltRounds: 10

const hashManagerPassword = (managerPassword) => {
    return bcrypt.hashSync(managerPassword, salt)
}

export const addManager = async (req, res, next) => {
    const { email, password } = req.body

    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs...",
        })
    }

    let existManager, manager

    try {
        existManager = await Manager.findOne({ email })
    } catch (err) {
        console.error(err)
    }

    if (existManager) {
        return res.status(400).json({ message: "Manager already exists" })
    }

    const hashPassword = hashManagerPassword(password)

    try {
        manager = new Manager({ email, password: hashPassword })
        manager = await manager.save()
    } catch (err) {
        console.error(err)
    }

    if (!manager) {
        return res.status(500).json({ message: "Unable to store manager..." })
    }

    return res.status(201).json({ manager })
}

export const managerLogin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs...",
        })
    }

    let existManager

    try {
        existManager = await Manager.findOne({ email })
    } catch (err) {
        console.error(err)
    }

    if (!existManager) {
        return res.status(400).json({ message: "Manager not found..." })
    }

    if (existManager.locked) {
        return res.status(400).json({ message: "This account has been disabled" })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existManager.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password..." })
    }

    const token = jwt.sign({ id: existManager._id }, process.env.SECRET_KEY, {
        expiresIn: "7d", // the token chain will expire after 7 days
    })

    io.on("connection", (socket) => {
        socket.on("employeeLogin", async ({ id }) => {
            try {
                await Manager.findByIdAndUpdate(id, { isOnline: true })
            } catch (err) {
                console.error("Error updating employee login status:", err)
            }
        })

        socket.on("employeeLogout", async ({ id }) => {
            try {
                await Manager.findByIdAndUpdate(id, { isOnline: false })
            } catch (err) {
                console.error("Error updating employee logout status:", err)
            }
        })

        socket.on("disconnect", () => console.log("Socket.io disconnected..."))
    })

    res.status(200).json({
        message: "Login successfully!!!",
        token,
        id: existManager._id,
        email: existManager.email,
        cinemaId: existManager.cinema
    })
}

export const getManagers = async (req, res, next) => {
    try {
        const managers = await Manager.find()

        if (!managers) {
            return res.status(500).json({ message: "internal server error..." })
        }

        return res.status(200).json({ managers })
    } catch (err) {
        console.error(err)
    }
}

export const getManagerById = async (req, res, next) => {
    try {
        const managerId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(managerId)) {
            return res.status(400).json({ message: "invalid manager id..." })
        }

        const manager = await Manager.findById(managerId)
            .populate("cinema", "name")
            .populate({
                path: "addedMovies",
                options: { withDeleted: true },
                populate: [
                    { path: "category", select: "category" },
                    { path: "producer", select: "producerName" }
                ],
            })
            .populate({
                path: "addedScreenings",
                options: { withDeleted: true },
                populate: [
                    {
                        path: "movie",
                        options: { withDeleted: true },
                        select: "title trailerId slug time"
                    },
                    {
                        path: "cinemaRoom",
                        select: "roomNumber",
                        populate: {
                            path: "cinema",
                            select: "name"
                        }
                    }
                ],
            })

        if (!manager) {
            return res.status(500).json({ message: "manager not found..." })
        }

        manager.addedMovies.reverse()
        manager.addedScreenings.reverse()

        return res.status(200).json({ manager })
    } catch (err) {
        next(err)
    }
}

export const getEmployeeStatistics = async (req, res, next) => {
    try {
        const employees = await Manager.find().populate("cinema", "name").lean()

        const totalEmployees = employees.length
        const positionCounts = { manageMovies: 0, manageScreenings: 0, others: 0 }

        const employeeDetails = employees.map((employee) => {
            if (employee.position === "Manage movies") {
                positionCounts.manageMovies++
            } else if (employee.position === "Manage screenings") {
                positionCounts.manageScreenings++
            } else {
                positionCounts.others++
            }

            const addedMoviesLength = employee.addedMovies.length || 0
            const addedScreeningsLength = employee.addedScreenings.length || 0

            return {
                email: employee.email,
                position: employee.position,
                cinemaName: employee.cinema ? employee.cinema.name : "No cinema",
                amountOfWorkDone: addedMoviesLength + addedScreeningsLength,
                isOnline: employee.isOnline
            }
        })

        const percentManageMovies = (positionCounts.manageMovies / totalEmployees) * 100
        const percentManageScreenings = (positionCounts.manageScreenings / totalEmployees) * 100
        const percentOthers = (positionCounts.others / totalEmployees) * 100

        return res.status(200).json({
            employeesStatistics: {
                percents: {
                    manageMovies: percentManageMovies.toFixed(2),
                    manageScreenings: percentManageScreenings.toFixed(2),
                    others: percentOthers.toFixed(2)
                },
                employees: employeeDetails
            }
        })
    } catch (err) {
        next(err)
    }
}