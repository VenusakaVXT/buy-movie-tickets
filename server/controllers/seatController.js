import Seat from "../models/Seat.js"
import CinemaRoom from "../models/CinemaRoom.js"
import { isValidObjectId } from "mongoose"

class SeatController {
    getApiSeat = async (req, res, next) => {
        let seats

        try {
            seats = await Seat.find().populate("cinemaRoom", "roomNumber")
        } catch (err) {
            console.error(err)
        }

        if (!seats) {
            res.status(500).json({ message: "request failed..." })
        }

        res.status(200).json({ seats })
    }

    create(req, res, next) {
        CinemaRoom.find({})
            .then((cinemaRooms) => res.render("seat/create", { cinemaRooms }))
            .catch(next)
    }

    store = async (req, res, next) => {
        const { rowSeat, seatNumber, seatType, selected = false } = req.body
        const cinemaRoomObj = await CinemaRoom.findOne({ _id: req.body.cinemaRoom })

        const seat = new Seat({
            rowSeat,
            seatNumber,
            seatType,
            cinemaRoom: cinemaRoomObj._id,
            selected
        })

        await seat.save()
            .then(async () => {
                cinemaRoomObj.seats.push(seat._id)
                await cinemaRoomObj.save()
                res.redirect("/seat/table-lists")
            })
            .catch(next)
    }

    tableLists = async (req, res, next) => {
        try {
            const { cinemaRoomId } = req.query
            let seats

            if (cinemaRoomId && cinemaRoomId !== "all") {
                seats = await Seat.find({ cinemaRoom: cinemaRoomId }).populate("cinemaRoom", "roomNumber")
            } else {
                seats = await Seat.find({}).populate("cinemaRoom", "roomNumber")
            }

            const cinemaRooms = await CinemaRoom.find({})

            res.render("seat/read", { seats, cinemaRooms, selectedCinemaRoomId: cinemaRoomId || "all" })
        } catch (err) {
            next(err)
        }
    }

    edit(req, res, next) {
        Promise.all([CinemaRoom.find({}), Seat.findById(req.params.id)])
            .then(([cinemaRooms, seat]) => {
                if (!seat.cinemaRoom || !isValidObjectId(seat.cinemaRoom)) {
                    seat.cinemaRoom = ""
                }
                res.render("seat/edit", { cinemaRooms, seat })
            })
            .catch(next)
    }

    update(req, res, next) {
        const newCinemaRoomId = req.body.cinemaRoom
        const seatId = req.params.id

        const updateSeatObj = {
            rowSeat: req.body.rowSeat,
            seatNumber: req.body.seatNumber,
            seatType: req.body.seatType,
            cinemaRoom: newCinemaRoomId
        }

        Seat.findById(seatId).populate("cinemaRoom")
            .then((seat) => {
                if (!seat) {
                    return res.status(404).json({ message: "seat not found..." })
                }

                const oldCinemaRoomId = seat.cinemaRoom ? seat.cinemaRoom._id : null

                Seat.findByIdAndUpdate(seatId, updateSeatObj, { new: true })
                    .then(() => {
                        if (oldCinemaRoomId && oldCinemaRoomId !== newCinemaRoomId) {
                            CinemaRoom.findByIdAndUpdate(
                                oldCinemaRoomId,
                                { $pull: { seats: seatId } },
                                { new: true }
                            ).catch(next)
                        }

                        CinemaRoom.findByIdAndUpdate(
                            newCinemaRoomId,
                            { $addToSet: { seats: seatId } },
                            { new: true }
                        ).catch(next)

                        res.redirect("/seat/table-lists")
                    })
                    .catch(next)
            })
            .catch(next)
    }

    delete(req, res, next) {
        Seat.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/seat/table-lists"))
            .catch(next)
    }
}

export default new SeatController