import mongoose from "mongoose";
import Booking from "../models/Booking.js"
import Movie from "../models/Movie.js"
import User from "../models/User.js"

export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user } = req.body

    let existMovie;
    let existUser;

    try {
        existMovie = await Movie.findById(movie)
        existUser = await User.findById(user)
    } catch (err) {
        console.error(err)
    }

    if (!existMovie) {
        return res.status(404).json({
            message: "movie not found with given id..."
        })
    }

    if (!existUser) {
        return res.status(404).json({
            message: "user not found with given id..."
        })
    }

    let booking

    try {
        booking = new Booking({
            movie,
            date: new Date(`${date}`),
            seatNumber,
            user
        })

        const session = await mongoose.startSession()
        session.startTransaction()

        existUser.bookings.push(booking)
        existMovie.bookings.push(booking)

        await existUser.save({ session })
        await existMovie.save({ session })
        await booking.save({ session })

        session.commitTransaction()
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({
            message: "unable to create a booking..."
        })
    }

    return res.status(201).json({ booking })
}

export const getBookingById = async (req, res, next) => {
    const id = req.params.id
    let booking

    try {
        booking = await Booking.findById(id)
    } catch(err) {
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
        booking = await Booking.findByIdAndRemove(id).populate("user movie")

        const session = await mongoose.startSession()
        session.startTransaction()

        await booking.user.bookings.pull(booking)
        await booking.movie.bookings.pull(booking)
        await booking.movie.save({ session })
        await booking.user.save({ session })
        
        session.commitTransaction()
    } catch(err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unable to cancel..." })
    }

    return res.status(200).json({ message: "successfully cancel!!!" })
}