import bcrypt from "bcrypt"
import User from "../models/User.js"
import Booking from "../models/Booking.js"

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

export const addUser = async (req, res, next) => {
    const {
        name,
        phone,
        email,
        password,
        birthDay,
        gender,
        address
    } = req.body

    const hashPassword = hashUserPassword(password)

    if (
        (!name || name.trim() === "") &&
        (!phone || phone.trim() === "") &&
        (!email || email.trim() === "") &&
        (!password || password.trim() === "")
    ) {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let user

    try {
        user = new User({ 
            name, 
            phone,
            email, 
            password: hashPassword,
            birthDay,
            gender,
            address
        })
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

    const {
        name,
        phone,
        email,
        password,
        birthDay,
        gender,
        address
    } = req.body

    const hashPassword = hashUserPassword(password)

    if (
        (!name || name.trim() === "") &&
        (!phone || phone.trim() === "") &&
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
            phone,
            email, 
            password: hashPassword,
            birthDay,
            gender,
            address
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

export const deleteUser = async (req, res, next) => {
    const id = req.params.id

    let user

    try {
        user = await User.findByIdAndRemove(id)
    } catch(err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Something went wrong..."
        })
    }

    res.status(200).json({ message: "User delete successfully!!!" })
}

export const login = async (req, res, next) => {
    const { username, password } = req.body

    if (!username && username.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs..."
        })
    }

    let existUser

    try {
        existUser = await User.findOne({ $or: [{ email: username }, { phone: username }] })
    } catch(err) {
        console.error(err)
    }

    if (!existUser) {
        return res.status(404).json({ message: "user not found..." })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existUser.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "incorrect password..." })
    }

    res.status(200).json({ message: "login successfully!!!" })
}

export const getBookingOfUser = async (req, res, next) => {
    const id = req.params.id
    let booking

    try {
        booking = await Booking.find({ user: id })
    } catch(err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unable to get booking..." })
    }

    return res.status(200).json({ booking })
}