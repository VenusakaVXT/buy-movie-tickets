import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Screening from "../models/Screening.js"
import Seat from "../models/Seat.js"
import User from "../models/User.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"
import qrCode from "qrcode"

export const newBooking = async (req, res, next) => {
    const { screening, seats, user } = req.body

    let existScreening
    let existUser
    let existSeats = []

    try {
        existScreening = await Screening.findById(screening)
        existUser = await User.findById(user)

        for (const seatId of seats) {
            const existSeat = await Seat.findById(seatId)
            if (existSeat) {
                if (existSeat.selected) {
                    return res.status(400).json({
                        message: `Seat ${existSeat.rowSeat}${existSeat.seatNumber} has already been selected`
                    })
                } else {
                    existSeats.push(existSeat)
                }
            }
        }
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

    if (existSeats.length !== seats.length) {
        return res.status(404).json({
            message: "seat not found with given id...",
        })
    }

    let booking

    try {
        const totalMoney = existScreening.price * existSeats.length
        const qrData = JSON.stringify({ screening, seats, user, totalMoney })
        const qrDataURL = await qrCode.toDataURL(qrData)

        booking = new Booking({ screening, seats, user, totalMoney, qrCode: qrDataURL })

        const session = await mongoose.startSession()
        session.startTransaction()

        existUser.bookings.push(booking)
        existScreening.bookings.push(booking)

        for (const seat of existSeats) {
            seat.selected = true
            seat.bookings.push(booking)
            await seat.save({ session })
        }

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
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "name")
            .populate("seats", "rowSeat seatNumber")
            .populate({
                path: "screening",
                populate: [
                    { path: "movie", select: "title time" },
                    { path: "cinemaRoom", select: "roomNumber", populate: {
                        path: "cinema", select: "name"
                    } }
                ]
            })

        if (!booking) {
            return res.status(404).json({ message: "booking not found..." })
        }

        return res.status(200).json({ booking })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

export const cancelBooking = async (req, res, next) => {
    let booking

    try {
        booking = await Booking.findByIdAndRemove(req.params.id).populate("user screening seats")

        const session = await mongoose.startSession()
        session.startTransaction()

        for (const seat of booking.seats) {
            seat.selected = false
            seat.bookings.pull(booking)
            await seat.save({ session })
        }

        await booking.user.bookings.pull(booking)
        await booking.screening.bookings.pull(booking)

        await booking.user.save({ session })
        await booking.screening.save({ session })

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

        for (let booking of bookings) {
            const seatPromises = booking.seats.map((seatId) => Seat.findById(seatId))
            const seats = await Promise.all(seatPromises)
            const seatPositions = []

            seats.forEach((seat) => {
                if (seat && seat.seatNumber < 10) {
                    seatPositions.push(`${seat.rowSeat}-00${seat.seatNumber}`)
                } else if (seat && seat.seatNumber >= 10) {
                    seatPositions.push(`${seat.rowSeat}-0${seat.seatNumber}`)
                } else {
                    seatPositions.push("Unknown")
                }
            })

            booking.seatPositions = seatPositions.join(", ")
        }

        res.render("booking/booking-detail", { bookings })
    } catch (err) {
        next(err)
    }
}