import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Screening from "../models/Screening.js"
import User from "../models/User.js"

export const newBooking = async (req, res, next) => {
    const { screening, bookingDate, seat, user } = req.body

    let existScreening
    let existUser

    try {
        existScreening = await Screening.findById(screening)
        existUser = await User.findById(user)
    } catch (err) {
        console.error(err)
    }

    if (!existScreening) {
        return res.status(404).json({
            message: "screening not found with given id...",
        })
    }

    if (!existUser) {
        return res.status(404).json({
            message: "user not found with given id...",
        })
    }

    let booking

    try {
        booking = new Booking({
            screening,
            bookingDate: new Date(`${bookingDate}`),
            seat,
            user,
        })

        const session = await mongoose.startSession()
        session.startTransaction()

        existUser.bookings.push(booking)
        existScreening.bookings.push(booking)

        await existUser.save({ session })
        await existScreening.save({ session })
        await booking.save({ session })

        session.commitTransaction()
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({
            message: "unable to create a booking...",
        })
    }

    return res.status(201).json({ booking })
}

export const getBookingById = async (req, res, next) => {
    const id = req.params.id
    let booking

    try {
        booking = await Booking.findById(id)
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unexpected error..." })
    }

    return res.status(200).json({ booking })
}

export const cancelBooking = async (req, res, next) => {
    const id = req.params.id
    let booking

    try {
        booking = await Booking.findByIdAndRemove(id).populate("user screening")

        const session = await mongoose.startSession()
        session.startTransaction()

        await booking.user.bookings.pull(booking)
        await booking.screening.bookings.pull(booking)
        await booking.screening.save({ session })
        await booking.user.save({ session })

        session.commitTransaction()
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unable to cancel..." })
    }

    return res.status(200).json({ message: "successfully cancel!!!" })
}
