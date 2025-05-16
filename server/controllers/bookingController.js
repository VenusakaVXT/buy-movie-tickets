import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Screening from "../models/Screening.js"
import Seat from "../models/Seat.js"
import User from "../models/User.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"
import CancelBooking from "../models/CancelBooking.js"
import WaterCornCombo from "../models/WaterCornCombo.js"
import PromotionProgram from "../models/PromotionProgram.js"
import qrCode from "qrcode"
import sendEmail from "../util/email.js"
import { getLocalizedText } from "../util/localization.js"
import dotenv from "dotenv"

dotenv.config()

export const newBooking = async (req, res, next) => {
    const { screening, seats, user, waterCornCombos, discountCode } = req.body

    let existScreening
    let existUser
    let existSeats = []
    let existWaterCornCombos = []
    let existPromotionProgram
    let appliedPromotionProgram = false
    let amountDecreases = 0

    try {
        existScreening = await Screening.findById(screening)
        existUser = await User.findById(user)

        for (const seatId of seats) {
            const existSeat = await Seat.findById(seatId)
            if (existSeat) {
                if (existSeat.selected) {
                    return res.status(400).json({
                        message: `Seat ${existSeat.rowSeat}-${existSeat.seatNumber.padStart(3, "0")} has already been selected`
                    })
                } else {
                    existSeats.push(existSeat)
                }
            }
        }

        for (const waterCornCombo of waterCornCombos) {
            const existWaterCornCombo = await WaterCornCombo.findById(waterCornCombo.id)
            if (existWaterCornCombo) {
                existWaterCornCombos.push({
                    id: existWaterCornCombo._id,
                    quantity: waterCornCombo.quantity
                })
            }
        }

        existPromotionProgram = await PromotionProgram.findOne({ discountCode })
        if (existPromotionProgram && existPromotionProgram.isActive) {
            appliedPromotionProgram = true
        } else {
            appliedPromotionProgram = false
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
        const waterCornComboIds = existWaterCornCombos.map(combo => combo.id)
        const waterCornComboData = await WaterCornCombo.find({ _id: { $in: waterCornComboIds } })
        const waterCornComboMoney = existWaterCornCombos.reduce((total, combo) => {
            const waterCornCombo = waterCornComboData.find(wc => wc._id.toString() === combo.id.toString())
            return total + (waterCornCombo ? combo.quantity * waterCornCombo.price : 0)
        }, 0)
        let totalMoney = (existScreening.price * existSeats.length) + waterCornComboMoney

        if (appliedPromotionProgram && existPromotionProgram) {
            const discountAmount = (totalMoney * existPromotionProgram.percentReduction) / 100
            if (discountAmount > existPromotionProgram.maxMoneyAmount) {
                totalMoney -= existPromotionProgram.maxMoneyAmount
                amountDecreases = existPromotionProgram.maxMoneyAmount
            } else {
                totalMoney -= discountAmount
                amountDecreases = discountAmount
            }
        }

        const ratingPoints = existSeats.length * 5
        const qrData = JSON.stringify({ screening, seats, user, waterCornCombos, discountCode, totalMoney })
        const qrDataURL = await qrCode.toDataURL(qrData)

        booking = new Booking({
            screening,
            seats,
            user,
            waterCornCombos,
            promotionProgram: existPromotionProgram ? existPromotionProgram._id : null,
            amountDecreases,
            totalMoney,
            qrCode: qrDataURL
        })

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
        const waterCornCombosArr = await Promise.all(
            existWaterCornCombos.map(async (combo) => {
                const waterCornCombo = await WaterCornCombo.findById(combo.id)
                return `${combo.quantity} ${waterCornCombo.comboName}`
            })
        )
        const waterCornCombosDisplay = waterCornCombosArr.length > 0 ? waterCornCombosArr.join(", ") : "-/-"
        const programName = existPromotionProgram ? existPromotionProgram.programName : "-/-"

        const emailContent = (locale) => {
            return `
                <div style="font-size: 16px; color: #000;">
                    <style>span.im { color: #000 !important; }</style>
                    <h1>${getLocalizedText(locale, "newBooking.subject")}</h1>
                    <h2>${getLocalizedText(locale, "newBooking.greeting", { name: existUser.name })}</h2>
                    <p>${getLocalizedText(locale, "newBooking.intro", { createdAt: booking.createdAt })}</p>
                    <p>${getLocalizedText(locale, "newBooking.details")}</p>
                    <p>${getLocalizedText(locale, "newBooking.movie", { title: movieTitle.title })}</p>
                    <p>${getLocalizedText(locale, "newBooking.screeningTime", { timeSlot: existScreening.timeSlot, movieDate: existScreening.movieDate })}</p>
                    <p>${getLocalizedText(locale, "newBooking.screeningAt", { roomNumber: screeningAt.roomNumber, cinemaName: screeningAt.cinema.name })}</p>
                    <p>${getLocalizedText(locale, "newBooking.seats", { seats: seatDisplay.join(", ") })}</p>
                    <p>${getLocalizedText(locale, "newBooking.waterCornCombos", { waterCornCombos: waterCornCombosDisplay })}</p>
                    <p>${getLocalizedText(locale, "newBooking.promotionProgram", { programName })}</p>
                    <p>${getLocalizedText(locale, "newBooking.totalMoney", { totalMoney: booking.totalMoney.toLocaleString("vi-VN") })}</p>
                    <p>${getLocalizedText(locale, "newBooking.thanks")}</p>
                    <p>${getLocalizedText(locale, "newBooking.cta")}</p>
                </div>
                <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                    <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                        <a 
                            href=${process.env.REACT_URL} 
                            target="_blank" 
                            style="font-size: 16px; color: #fff; text-decoration: none;"
                        >
                            ${getLocalizedText(locale, "newBooking.ctaButton")}
                        </a>
                    </button>
                </div>
            `
        }

        const userEmail = existUser.email
        const locale = userEmail.endsWith(".vn") || userEmail.endsWith(".com") ? "vn" : "en"
        const htmlContent = emailContent(locale)

        sendEmail(
            userEmail,
            getLocalizedText(locale, "newBooking.subject"),
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
            .populate("waterCornCombos.id", "comboName price")
            .populate("promotionProgram", "discountCode programName percentReduction maxMoneyAmount")

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
        const waterCornCombos = await WaterCornCombo.find({})
        const promotionPrograms = await PromotionProgram.find({})

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

            booking.waterCornComboQuantity = booking.waterCornCombos && booking.waterCornCombos.length > 0
                ? booking.waterCornCombos.map((combo) => {
                    if (combo && combo.id) {
                        const waterCornCombo = waterCornCombos.find((wc) => wc._id.toString() === combo.id.toString())
                        return waterCornCombo ? `${combo.quantity ?? 1} ${waterCornCombo.comboName}` : "Unknown"
                    }
                }).join(", ") : "-/-"

            const promotionProgram = promotionPrograms.find((pp) =>
                pp._id.toString() === booking.promotionProgram?.toString()
            )
            booking.discountCode = promotionProgram ? promotionProgram.discountCode : "-/-"
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

        const emailContent = (locale) => {
            return `
                <div style="font-size: 16px;">
                    <style>span.im { color: #000 !important; }</style>
                    <h1>${getLocalizedText(locale, "restoreBooking.subject")}</h1>
                    <h2>${getLocalizedText(locale, "restoreBooking.greeting", { name: booking.user.name })}</h2>
                    <p>${getLocalizedText(locale, "restoreBooking.intro")}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.details")}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.bookingId", { bookingId: booking._id })}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.bookingTime", { createdAt: booking.createdAt })}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.cancellationTime", { createdAt: cancelBooking.createdAt })}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.reason", { reason: cancelBooking.reason })}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.thanks")}</p>
                    <p>${getLocalizedText(locale, "restoreBooking.cta")}</p>
                </div>
                <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                    <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                        <a 
                            href=${process.env.REACT_URL} 
                            target="_blank" 
                            style="font-size: 16px; color: #fff; text-decoration: none;"
                        >
                            ${getLocalizedText(locale, "restoreBooking.ctaButton")}
                        </a>
                    </button>
                </div>
            `
        }

        const userEmail = booking.user.email
        const locale = userEmail.endsWith(".vn") || userEmail.endsWith(".com") ? "vn" : "en"
        const htmlContent = emailContent(locale)

        sendEmail(
            userEmail,
            getLocalizedText(locale, "restoreBooking.subject"),
            htmlContent
        )

        res.status(200).json({ message: "Booking restored successfully..." })
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
            .sort({ approveRequest: 1, createdAt: -1 })

        const waterCornCombos = await WaterCornCombo.find({})
        const promotionPrograms = await PromotionProgram.find({})

        cancelBookings.forEach((cancelBooking) => {
            if (cancelBooking.booking
                && cancelBooking.booking.screening.timeSlot
                && cancelBooking.booking.screening.movieDate) {
                const screeningTime =
                    `${cancelBooking.booking.screening.timeSlot}, 
                    ${cancelBooking.booking.screening.movieDate}`
                cancelBooking.booking.screeningTime = screeningTime
            }

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

            if (cancelBooking.booking && cancelBooking.booking.seats) {
                const seatArr = cancelBooking.booking.seats
                const seats = seatArr.map(seat => `${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`)
                cancelBooking.booking.seatDisplay = seats.join(", ")
            } else {
                cancelBooking.booking.seatDisplay = "Unknown"
            }

            cancelBooking.booking.waterCornComboQuantity = cancelBooking.booking.waterCornCombos
                && cancelBooking.booking.waterCornCombos.length > 0 ?
                cancelBooking.booking.waterCornCombos.map((combo) => {
                    if (combo && combo.id) {
                        const waterCornCombo = waterCornCombos.find((wc) => wc._id.toString() === combo.id.toString())
                        return waterCornCombo ? `${combo.quantity ?? 1} ${waterCornCombo.comboName}` : "Unknown"
                    }
                }).join(", ") : "-/-"

            const promotionProgram = promotionPrograms.find((pp) =>
                pp._id.toString() === cancelBooking.booking.promotionProgram?.toString()
            )
            cancelBooking.booking.discountCode = promotionProgram ? promotionProgram.discountCode : "-/-"
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

        const emailContent = (locale) => {
            return `
                <div style="font-size: 16px;">
                    <style>span.im { color: #000 !important; }</style>
                    <h1>${getLocalizedText(locale, "cancelBooking.subject")}</h1>
                    <h2>${getLocalizedText(locale, "cancelBooking.greeting", { name: user.name })}</h2>
                    <p>${getLocalizedText(locale, "cancelBooking.intro")}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.details")}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.bookingId", { bookingId: booking._id })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.bookingTime", { createdAt: booking.createdAt })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.cancellationTime", { createdAt: cancelBooking.createdAt })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.reason", { reason: cancelBooking.reason })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.compensationPercent", { percent: 100 - cancelBooking.compensationPercent })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.refunds", { refunds: cancelBooking.refunds.toLocaleString("vi-VN") })}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.thanks")}</p>
                    <p>${getLocalizedText(locale, "cancelBooking.cta")}</p>
                </div>
                <div style="margin: 16px; display: flex; align-items: center; justify-content: center;">
                    <button style="background: #e50914; border: none; padding: 10px; cursor: pointer;">
                        <a 
                            href=${process.env.REACT_URL} 
                            target="_blank" 
                            style="font-size: 16px; color: #fff; text-decoration: none;"
                        >
                            ${getLocalizedText(locale, "cancelBooking.ctaButton")}
                        </a>
                    </button>
                </div>
            `
        }

        const userEmail = user.email
        const locale = userEmail.endsWith(".vn") || userEmail.endsWith(".com") ? "vn" : "en"
        const htmlContent = emailContent(locale)

        sendEmail(
            userEmail,
            getLocalizedText(locale, "cancelBooking.subject"),
            htmlContent
        )

        res.status(200).json({ message: "Admin has approved" })
    } catch (err) {
        next(err)
    }
}

export const resetSeats = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("seats")

        if (!booking) {
            return res.status(404).json({ message: "Booking not found..." })
        }

        const seatUpdates = booking.seats.map((seatId) => {
            return Seat.findByIdAndUpdate(seatId, { selected: false }, { new: true })
        })

        await Promise.all(seatUpdates)
        return res.status(200).json({ message: "Reset seats successfully!!!" })
    } catch (err) {
        res.status(400).json({ message: "Reset seats failed!!!" })
        next(err)
    }
}