import bcrypt from "bcrypt"
import User from "../models/User.js"

const salt = bcrypt.genSaltSync(10) // saltRounds: 10

const hashUserPassword = (userPassword) => {
    return bcrypt.hashSync(userPassword, salt)
}

export const getAllUsers = async (req, res, next) => {
    let users

    try {
        users = await User.find()
    } catch (err) {
        console.error(err)
    }

    if (!users) {
        return res.status(500).json({
            message: "Unexpected Error Occurred!!!"
        })
    }

    return res.status(200).json({ users })
}

export const register = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const hashPassword = hashUserPassword(password)

    if (
        (!name || name.trim() === "") &&
        (!email || email.trim() === "") &&
        (!password || password.trim() === "")
    ) {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let user

    try {
        user = new User({ name, email, password: hashPassword })
        user = await user.save()
    } catch (err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Unexpected Error Occurred!!!"
        })
    }

    return res.status(201).json({ user })
}

export const updateUser = async (req, res, next) => {
    const id = req.params.id
    const { name, email, password } = req.body
    const hashPassword = hashUserPassword(password)

    if (
        (!name || name.trim() === "") &&
        (!email || email.trim() === "") &&
        (!password || password.trim() === "")
    ) {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let user

    try {
        user = await User.findByIdAndUpdate(id, {
            name,
            email,
            password: hashPassword
        })
    } catch(err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Something went wrong..."
        })
    }

    res.status(200).json({ message: "User update successfully!!!" })
}