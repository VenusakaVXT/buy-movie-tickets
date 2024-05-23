import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Manager from "../models/Employee.js"

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
        return res.status(400).json({ message: "manager not found..." })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existManager.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "incorrect password..." })
    }

    const token = jwt.sign({ id: existManager._id }, process.env.SECRET_KEY, {
        expiresIn: "7d", // the token chain will expire after 7 days
    })

    res.status(200).json({
        message: "login successfully!!!",
        token,
        id: existManager._id,
        email,
        cinemaId: existManager.cinema
    })
}

export const getManagers = async (req, res, next) => {
    let managers

    try {
        managers = await Manager.find()
    } catch (err) {
        console.error(err)
    }

    if (!managers) {
        return res.status(500).json({ message: "internal server error..." })
    }

    return res.status(200).json({ managers })
}

export const getManagerById = async (req, res, next) => {
    try {
        const manager = await Manager.findById(req.params.id)
            .populate("cinema", "name")
            .populate({
                path: "addedMovies",
                populate: [
                    { path: "category", select: "category" },
                    { path: "producer", select: "producerName" }
                ],
            })
            .populate({
                path: "addedScreenings",
                populate: [
                    { path: "movie", select: "title trailerId slug time" },
                    {
                        path: "cinemaRoom", select: "roomNumber", populate: {
                            path: "cinema", select: "name"
                        }
                    }
                ],
            })

        if (!manager) {
            return res.status(500).json({ message: "manager not found..." })
        }

        return res.status(200).json({ manager })
    } catch (err) {
        next(err)
    }
}