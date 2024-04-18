import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Screening from "../models/Screening.js"
import Seat from "../models/Seat.js"
import User from "../models/User.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"

export const newBooking = async (req, res, next) => {
    const { screening, seat, user } = req.body

    let existScreening
    let existSeat
    let existUser

    try {
        existScreening = await Screening.findById(screening)
        existSeat = await Seat.findById(seat)
        existUser = await User.findById(user)
    } catch (err) {
        console.error(err)
    }

    if (!existScreening) {
        return res.status(404).json({
            message: "screening not found with given id...",
        })
    }

    if (!existSeat) {
        return res.status(404).json({
            message: "seat not found with given id...",
        })
    }

    if (!existUser) {
        return res.status(404).json({
            message: "user not found with given id...",
        })
    }

    let booking

    try {
        booking = new Booking({ screening, seat, user })

        const session = await mongoose.startSession()
        session.startTransaction()

        existUser.bookings.push(booking)
        existScreening.bookings.push(booking)
        existSeat.bookings.push(booking)

        await existUser.save({ session })
        await existScreening.save({ session })
        await existSeat.save({ session })
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
    let booking

    try {
        booking = await Booking.findById(req.params.id)
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unexpected error..." })
    }

    return res.status(200).json({ booking })
}

export const cancelBooking = async (req, res, next) => {
    let booking

    try {
        booking = await Booking.findByIdAndRemove(req.params.id).populate("user screening seat")

        const session = await mongoose.startSession()
        session.startTransaction()

        await booking.user.bookings.pull(booking)
        await booking.screening.bookings.pull(booking)
        await booking.seat.bookings.pull(booking)

        await booking.user.save({ session })
        await booking.screening.save({ session })
        await booking.seat.save({ session })

        session.commitTransaction()
    } catch (err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({ message: "unable to cancel..." })
    }

    return res.status(200).json({ message: "successfully cancel!!!" })
}

export const detailAllBooking = async (req, res, next) => {
    try {
        const bookings = await Booking.find({})
        const users = await User.find({})

        bookings.forEach((booking) => {
            const user = users.find((u) =>
                u._id.toString() === booking.user.toString()
            )
            booking.userName = user ? user.name : "Unknown"
        })

        const screenings = await Screening.find({})
        const movies = await Movie.find({})
        const cinemaRooms = await CinemaRoom.find({})
        const cinemas = await Cinema.find({})

        bookings.forEach((booking) => {
            const screening = screenings.find((sn) =>
                sn._id.toString() === booking.screening.toString()
            )

            booking.screeningTime = screening
                ? `${screening.timeSlot}, ${screening.movieDate}` : "Unknown"

            const movie = movies.find((m) =>
                screening && m._id.toString() === screening.movie.toString()
            )

            booking.movieName = movie ? movie.title : "Unknown"

            const cinemaRoom = cinemaRooms.find((cr) =>
                screening && cr._id.toString() === screening.cinemaRoom.toString()
            )

            const cinema = cinemas.find((c) =>
                cinemaRoom && c._id.toString() === cinemaRoom.cinema.toString()
            )

            booking.screeningAt = cinema ? `${cinemaRoom.roomNumber}-${cinema.name}` : "Unknown"
        })

        const seats = await Seat.find({})

        bookings.forEach((booking) => {
            const seat = seats.find((s) =>
                s._id.toString() === booking.seat.toString()
            )

            if (seat.seatNumber < 10) {
                seat.position = `${seat.rowSeat}-00${seat.seatNumber}`
            } else {
                seat.position = `${seat.rowSeat}-0${seat.seatNumber}`
            }

            booking.seatPosition = seat ? seat.position : "Unknown"
        })

        res.render("booking/booking-detail", { bookings })
    } catch (err) {
        next(err)
    }
}