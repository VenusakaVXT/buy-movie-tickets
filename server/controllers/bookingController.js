import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Screening from "../models/Screening.js"
import Seat from "../models/Seat.js"
import User from "../models/User.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"
import qrCode from "qrcode"
import CancelBooking from "../models/CancelBooking.js"

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
        const ratingPoints = existSeats.length * 5
        const qrData = JSON.stringify({ screening, seats, user, totalMoney })
        const qrDataURL = await qrCode.toDataURL(qrData)

        booking = new Booking({ screening, seats, user, totalMoney, qrCode: qrDataURL })

        const session = await mongoose.startSession()
        session.startTransaction()

        existUser.ratingPoints += ratingPoints
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
                options: { withDeleted: true },
                populate: [
                    {
                        path: "movie",
                        options: { withDeleted: true },
                        select: "title time"
                    },
                    {
                        path: "cinemaRoom",
                        select: "roomNumber",
                        populate: {
                            path: "cinema",
                            select: "name"
                        }
                    }
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

export const detailAllBooking = async (req, res, next) => {
    try {
        const bookings = await Booking.find({}).sort({ createdAt: -1 })
        const cancelBookingsLength = (await CancelBooking.find({})).length
        const users = await User.find({})

        bookings.forEach((booking) => {
            const user = users.find((u) =>
                u._id.toString() === booking.user.toString()
            )
            booking.userName = user ? user.name : "Unknown"
        })

        const screenings = await Screening.findWithDeleted({})
        const movies = await Movie.findWithDeleted({})
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

        res.render("booking/booking-detail", { bookings, cancelBookingsLength })
    } catch (err) {
        next(err)
    }
}

export const cancelBooking = async (req, res, next) => {
    const { userId, bookingId, reason, refunds, compensationPercent } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found..." })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "booking not found..." })
        }

        const cancelBooking = new CancelBooking({
            user: userId,
            booking: bookingId,
            reason,
            refunds,
            compensationPercent,
            approveRequest: false
        })

        user.cancelBookings.push(cancelBooking._id)
        booking.cancelled = true

        await user.save()
        await booking.save()
        await cancelBooking.save()

        res.status(201).json({ cancelBooking })
    } catch (err) {
        next(err)
    }
}

export const detailCancelBooking = async (req, res, next) => {
    try {
        const cancelBooking = await CancelBooking.findById(req.params.id)
            .populate("user", "name")
            .populate({
                path: "booking",
                populate: [
                    { path: "seats", select: "rowSeat seatNumber" },
                    {
                        path: "screening",
                        options: { withDeleted: true },
                        populate: [
                            {
                                path: "movie",
                                options: { withDeleted: true },
                                select: "title time"
                            },
                            {
                                path: "cinemaRoom",
                                select: "roomNumber",
                                populate: {
                                    path: "cinema",
                                    select: "name"
                                }
                            }
                        ]
                    }
                ]
            })

        if (!cancelBooking) {
            return res.status(404).json({ message: "cancel booking not found..." })
        }

        res.status(200).json({ cancelBooking })
    } catch (err) {
        next(err)
    }
}

export const restoreBooking = async (req, res, next) => {
    try {
        const cancelBooking = await CancelBooking.findById(req.params.id)
        if (!cancelBooking) {
            return res.status(404).json({ message: "cancel booking not found..." })
        }

        const booking = await Booking.findById(cancelBooking.booking)
        if (!booking) {
            return res.status(404).json({ message: "booking not found..." })
        }

        booking.cancelled = false
        await booking.save()
        await CancelBooking.findByIdAndDelete(cancelBooking._id)

        res.status(200).json({ message: "booking restored successfully..." })
    } catch (err) {
        next(err)
    }
}

export const getAllCancelBooking = async (req, res, next) => {
    try {
        const cancelBookings = await CancelBooking.find()
            .populate("user", "name")
            .populate({
                path: "booking",
                populate: [
                    { path: "seats", select: "rowSeat seatNumber" },
                    {
                        path: "screening",
                        options: { withDeleted: true },
                        populate: [
                            {
                                path: "movie",
                                options: { withDeleted: true },
                                select: "title"
                            },
                            {
                                path: "cinemaRoom",
                                select: "roomNumber",
                                populate: {
                                    path: "cinema",
                                    select: "name"
                                }
                            }
                        ]
                    }
                ]
            })
            .sort({ createdAt: -1 })

        cancelBookings.forEach((cancelBooking) => {
            if (cancelBooking.booking
                && cancelBooking.booking.screening.timeSlot
                && cancelBooking.booking.screening.movieDate) {
                const screeningTime =
                    `${cancelBooking.booking.screening.timeSlot}, 
                    ${cancelBooking.booking.screening.movieDate}`
                cancelBooking.booking.screeningTime = screeningTime
            }
        })

        cancelBookings.forEach((cancelBooking) => {
            if (cancelBooking.booking
                && cancelBooking.booking.screening.cinemaRoom.roomNumber
                && cancelBooking.booking.screening.cinemaRoom.cinema.name) {
                const screeningAt =
                    `${cancelBooking.booking.screening.cinemaRoom.roomNumber}
                    - ${cancelBooking.booking.screening.cinemaRoom.cinema.name}`
                cancelBooking.booking.screeningAt = screeningAt
            } else {
                cancelBooking.booking.screeningAt = "Unknown"
            }
        })

        cancelBookings.forEach((cancelBooking) => {
            if (cancelBooking.booking && cancelBooking.booking.seats) {
                const seatArr = cancelBooking.booking.seats
                const seats = seatArr.map(seat => `${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`)
                cancelBooking.booking.seatDisplay = seats.join(", ")
            } else {
                cancelBooking.booking.seatDisplay = "Unknown"
            }
        })

        res.render("booking/cancel-booking", { cancelBookings })
    } catch (err) {
        next(err)
    }
}

export const approveRequestCancelBooking = async (req, res, next) => {
    try {
        const cancelBooking = await CancelBooking.findById(req.params.id)
            .populate("booking")
            .populate("user")
            .exec()

        if (!cancelBooking) {
            return res.status(404).json({ message: "cancel booking not found..." })
        }

        cancelBooking.approveRequest = true
        await cancelBooking.save()

        const user = cancelBooking.user
        const booking = cancelBooking.booking

        user.ratingPoints -= (booking.seats.length * 5)
        user.bookings = user.bookings.filter((bookingId) =>
            bookingId.toString() !== booking._id.toString()
        )
        await user.save()

        const seatIds = booking.seats
        await Seat.updateMany({ _id: { $in: seatIds } }, { $set: { selected: false } })

        res.status(200).json({ message: "Admin has approved" })
    } catch (err) {
        next(err)
    }
}