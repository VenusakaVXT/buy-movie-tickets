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
import sendEmail from "../util/email.js"
import dotenv from "dotenv"

dotenv.config()

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
                        message: `Seat ${existSeat.rowSeat}
                        -${existSeat.seatNumber.padStart(3, "0")} has already been selected`
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

        const movieTitle = await Movie.findById(existScreening.movie).select("title")
        const screeningAt = await CinemaRoom.findById(existScreening.cinemaRoom).populate("cinema", "name")
        const seatArr = await Seat.find({ _id: { $in: existSeats } })
        const seatDisplay = seatArr.map(seat => `${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`)

        const htmlContent = `
            <div style="font-size: 16px; color: #000;">
                <style>span.im { color: #000 !important; }</style>
                <h1>Successfully booked tickets at Buy Movie Tickets</h1>
                <h2>Dear ${existUser.name},</h2>
                <p>About time ${booking.createdAt}, you have booked movie tickets at our BMT system.</p>
                <p>Ticket booking details:</p>
                <p>Movie: ${movieTitle.title}</p>
                <p>Screening time: ${existScreening.timeSlot}, ${existScreening.movieDate}</p>
                <p>Screening at: ${screeningAt.roomNumber}-${screeningAt.cinema.name}</p>
                <p>Seats: ${seatDisplay.join(", ")}</p>
                <p>Total money: ${booking.totalMoney.toLocaleString("vi-VN")} VNĐ</p>
                <p>Sincerely thank our customer for always trusting and supporting Buy Movie Tickets!!!</p>
                <p>Visit the BMT homepage to see movie ticket details.</p>
            </div>
            <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                    <a 
                        href=${process.env.REACT_URL} 
                        target="_blank" 
                        style="font-size: 16px; color: #fff; text-decoration: none;"
                    >
                        BMT Home Page
                    </a>
                </button>
            </div>
        `

        sendEmail(
            existUser.email,
            "Successfully booked tickets at Buy Movie Tickets",
            htmlContent,
            [{ filename: `qr_code_${booking._id}.png`, path: qrDataURL, cid: "qrCodeImage" }]
        )
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

        const booking = await Booking.findById(cancelBooking.booking).populate("user")
        if (!booking) {
            return res.status(404).json({ message: "booking not found..." })
        }

        booking.cancelled = false
        await booking.save()
        await CancelBooking.findByIdAndDelete(cancelBooking._id)

        const htmlContent = `
            <div style="font-size: 16px;">
                <style>span.im { color: #000 !important; }</style>
                <h1>Request to cancel movie ticket exchange has been cancelled</h1>
                <h2>Dear ${booking.user.name},</h2>
                <p>
                    Your cancellation request was not approved by the Buy Movie Tickets system and the cinema
                    . Or you manually pressed to revoke the request.
                </p>
                <p>Details of ticket cancellation information:</p>
                <p>Booking ID: ${booking._id}</p>
                <p>Booking time: ${booking.createdAt}</p>
                <p>Cancellation time: ${cancelBooking.createdAt}</p>
                <p>Reason: ${cancelBooking.reason}</p>
                <p>Sincerely thank our customer for always trusting and supporting Buy Movie Tickets!!!</p>
                <p>Visit the BMT homepage to see movie ticket cancellation details.</p>
            </div>
            <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                    <a 
                        href=${process.env.REACT_URL} 
                        target="_blank" 
                        style="font-size: 16px; color: #fff; text-decoration: none;"
                    >
                        BMT Home Page
                    </a>
                </button>
            </div>
        `

        sendEmail(
            booking.user.email,
            "Request to cancel movie ticket exchange has been cancelled",
            htmlContent
        )

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

        const htmlContent = `
            <div style="font-size: 16px;">
                <style>span.im { color: #000 !important; }</style>
                <h1>Your cancellation request has been approved</h1>
                <h2>Dear ${user.name},</h2>
                <p>
                    After review by the system and cinema
                    , your request to cancel your ticket reservation has been approved.
                </p>
                <p>Details of ticket cancellation information:</p>
                <p>Booking ID: ${booking._id}</p>
                <p>Booking time: ${booking.createdAt}</p>
                <p>Cancellation time: ${cancelBooking.createdAt}</p>
                <p>Reason: ${cancelBooking.reason}</p>
                <p>The percentage you have to compensate the cinema: ${100 - cancelBooking.compensationPercent}%</p>
                <p>The amount of money you get back: ${cancelBooking.refunds.toLocaleString("vi-VN")} VNĐ</p>
                <p>Sincerely thank our customer for always trusting and supporting Buy Movie Tickets!!!</p>
                <p>Visit the BMT homepage to see movie ticket cancellation details.</p>
            </div>
            <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                    <a 
                        href=${process.env.REACT_URL} 
                        target="_blank" 
                        style="font-size: 16px; color: #fff; text-decoration: none;"
                    >
                        BMT Home Page
                    </a>
                </button>
            </div>
        `

        sendEmail(
            user.email,
            "Your cancellation request has been approved",
            htmlContent
        )

        res.status(200).json({ message: "Admin has approved" })
    } catch (err) {
        next(err)
    }
}