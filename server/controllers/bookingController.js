import Booking from "../models/Booking.js";

export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user } = req.body

    let booking

    try {
        booking = new Booking({
            movie,
            date: new Date(`${date}`),
            seatNumber,
            user
        })

        booking = await booking.save()
    } catch(err) {
        console.error(err)
    }

    if (!booking) {
        return res.status(500).json({
            message: "unable to create a booking..."
        })
    }

    return res.status(201).json({ booking })
}