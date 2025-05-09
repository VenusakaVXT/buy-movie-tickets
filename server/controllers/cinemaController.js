import Cinema from "../models/Cinema.js"
import CinemaRoom from "../models/CinemaRoom.js"
import CancelBooking from "../models/CancelBooking.js"
import WaterCornCombo from "../models/WaterCornCombo.js"

class CinemaController {
    getApiCinema = async (req, res, next) => {
        try {
            const cinemas = await Cinema.find()

            if (!cinemas) {
                res.status(500).json({ message: "request failed..." })
            }

            res.status(200).json({ cinemas })
        } catch (err) {
            console.error(err)
        }
    }

    getCinemaById = async (req, res, next) => {
        try {
            const cinema = await Cinema.findById(req.params.id)

            if (!cinema) {
                return res.status(404).json({ message: "cinema not found..." })
            }

            res.status(200).json({ cinema })
        } catch (err) {
            console.error(err)
        }
    }

    getCinemaRoomFromCinema = (req, res, next) => {
        CinemaRoom.find({ cinema: req.params.cinemaId })
            .then((cinemaRooms) => res.status(200).json({ cinemaRooms }))
            .catch((err) => res.status(500).json({ message: err }))
    }

    getComboByCinema = (req, res, next) => {
        const { cinemaId } = req.params
        WaterCornCombo.find({ cinema: cinemaId })
            .then((waterCornCombos) => res.status(200).json({ waterCornCombos }))
            .catch(next)
    }

    create(req, res, next) {
        res.render("cinema/create")
    }

    store(req, res, next) {
        const cinema = new Cinema({ ...req.body, waterCornCombos: [], promotionPrograms: [] })
        cinema.save()
            .then(() => res.redirect("/cinema/table-lists"))
            .catch(() => next)
    }

    tableLists(req, res, next) {
        Cinema.find({})
            .then((cinemas) => res.render("cinema/read", { cinemas }))
            .catch(() => next)
    }

    edit(req, res, next) {
        Cinema.findById(req.params.id)
            .then(cinema => res.render("cinema/edit", { cinema }))
            .catch(next)
    }

    update(req, res, next) {
        Cinema.updateOne({ _id: req.params.id }, {
            name: req.body.name,
            logo: req.body.logo,
            address: req.body.address,
            img: req.body.img,
            description: req.body.description,
            waterCornCombos: req.body.waterCornCombos || [],
            promotionPrograms: req.body.promotionPrograms || []
        })
            .then(() => res.redirect("/cinema/table-lists"))
            .catch(next)
    }

    delete(req, res, next) {
        Cinema.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/cinema/table-lists"))
            .catch(next)
    }

    getCancelBookingsByCinema = async (req, res, next) => {
        try {
            const cinema = await Cinema.findById(req.params.id)
                .populate({
                    path: "cinemaRooms",
                    populate: {
                        path: "screenings",
                        options: { withDeleted: true },
                        select: "_id bookings"
                    }
                })
                .lean()

            if (!cinema) {
                return res.status(404).json({ message: "cinema not found..." })
            }

            const bookingIds = []
            cinema.cinemaRooms.forEach((room) => {
                room.screenings.forEach((screening) => {
                    screening.bookings.forEach((booking) => {
                        bookingIds.push(booking)
                    })
                })
            })

            const cancelBookings = await CancelBooking.find({ booking: { $in: bookingIds } })
                .sort({ createdAt: -1 })

            res.status(200).json({ cancelBookingRows: cancelBookings })
        } catch (err) {
            next(err)
        }
    }

    getCinemaStatistical = async (req, res, next) => {
        try {
            const cinemaStatistical = await Cinema.aggregate([
                {
                    $lookup: {
                        from: "cinemarooms",
                        localField: "cinemaRooms",
                        foreignField: "_id",
                        as: "cinemaRoomsDetails"
                    }
                },
                {
                    $lookup: {
                        from: "screenings",
                        localField: "cinemaRoomsDetails._id",
                        foreignField: "cinemaRoom",
                        as: "screeningsDetails"
                    }
                },
                {
                    $lookup: {
                        from: "bookings",
                        localField: "screeningsDetails._id",
                        foreignField: "screening",
                        as: "bookingsDetails"
                    }
                },
                {
                    $addFields: {
                        cinemaRoomLength: { $size: "$cinemaRooms" },
                        employeeLength: { $size: "$employees" },
                        screeningLength: { $size: "$screeningsDetails" }
                    }
                },
                {
                    $addFields: {
                        cinemaRevenue: {
                            $sum: "$bookingsDetails.totalMoney"
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        cinemaRoomLength: 1,
                        employeeLength: 1,
                        screeningLength: 1,
                        cinemaRevenue: 1
                    }
                }
            ])

            res.status(200).json({ cinemaStatistical })
        } catch (err) {
            next(err)
        }
    }
}

export default new CinemaController