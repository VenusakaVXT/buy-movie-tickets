import bcrypt from "bcrypt"
import Admin from "../models/Admin.js"

const salt = bcrypt.genSaltSync(10) // saltRounds: 10

const hashAdminPassword = (adminPassword) => {
    return bcrypt.hashSync(adminPassword, salt)
}

export const addAdmin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let existAdmin, admin

    try {
        existAdmin = await Admin.findOne({ email })
    } catch(err) {
        console.error(err)
    }

    if (existAdmin) {
        return res.status(400).json({ message: "Admin already exists" })
    }

    const hashPassword = hashAdminPassword(password)

    try {
        admin = new Admin({ email, password: hashPassword })
        admin = await admin.save()
    } catch(err) {
        console.error(err)
    }

    if (!admin) {
        return res.status(500).json({ message: "Unable to store admin..." })
    }

    return res.status(201).json({ admin })
}

export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let existAdmin

    try {
        existAdmin = await Admin.findOne({ email })
    } catch(err) {
        console.error(err)
    }

    if (!existAdmin) {
        return res.status(400).json({ message: "admin not found..." })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existAdmin.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "incorrect password..." })
    }

    res.status(200).json({ message: "login successfully!!!" })
}