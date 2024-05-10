import Seat from "../models/Seat.js"
import CinemaRoom from "../models/CinemaRoom.js"
import { isValidObjectId } from "mongoose"

class SeatController {
    getApiSeat = async(req, res, next) => {
        let seats

        try {
            seats = await Seat.find()
        } catch(err) {
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
            const seats = await Seat.find({})
            const cinemaRooms = await CinemaRoom.find({})

            seats.forEach((seat) => {
                const cinemaRoom = cinemaRooms.find((cr) =>
                    cr._id.toString() === seat.cinemaRoom.toString()
                )
                seat.roomNumber = cinemaRoom ? cinemaRoom.roomNumber : "Unknown"
            })

            res.render("seat/read", { seats })
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
        CinemaRoom.findById({ _id: req.body.cinemaRoom })
            .then((cinemaRoom) => {
                const seatId = req.params.id

                Seat.updateOne({ _id: seatId }, {
                    rowSeat: req.body.rowSeat,
                    seatNumber: req.body.seatNumber,
                    seatType: req.body.seatType,
                    cinemaRoom: cinemaRoom._id,
                    selected: false
                })
                    .then(() => {
                        const foundSeat = cinemaRoom.seats.indexOf(seatId)

                        if (foundSeat == -1) {
                            cinemaRoom.seats.push(seatId)
                            cinemaRoom.save()
                        }

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