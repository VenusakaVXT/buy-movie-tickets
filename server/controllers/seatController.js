import Seat from "../models/Seat.js"
import CinemaRoom from "../models/CinemaRoom.js"
import { isValidObjectId } from "mongoose"

class SeatController {
    getApiSeat = async (req, res, next) => {
        try {
            const seats = await Seat.find().populate("cinemaRoom", "roomNumber")

            if (!seats) {
                return res.status(500).json({ message: "request failed..." })
            }

            res.status(200).json({ seats })
        } catch (err) {
            next(err)
        }
    }

    create(req, res, next) {
        CinemaRoom.find({})
            .then((cinemaRooms) => res.render("seat/create", { cinemaRooms }))
            .catch(next)
    }

    store = async (req, res, next) => {
        const { rowSeat, seatNumber, seatType, selected = false, cinemaRoom } = req.body

        try {
            const cinemaRoomObj = await CinemaRoom.findOne({ _id: cinemaRoom })
            const existSeat = await Seat.findOne({
                rowSeat,
                seatNumber,
                cinemaRoom: cinemaRoomObj._id
            })

            if (existSeat) {
                return res.status(400).send(
                    `Seat ${rowSeat}-${seatNumber.padStart(3, "0")} already exists in room ${cinemaRoomObj.roomNumber}`
                )
            }

            const seat = new Seat({
                rowSeat,
                seatNumber,
                seatType,
                cinemaRoom: cinemaRoomObj._id,
                selected
            })
            await seat.save()

            cinemaRoomObj.seats.push(seat._id)
            cinemaRoomObj.totalNumSeat = cinemaRoomObj.seats.length
            await cinemaRoomObj.save()

            res.redirect("/seat/table-lists")
        } catch (err) {
            next(err)
        }
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

    update = async (req, res, next) => {
        try {
            const { rowSeat, seatNumber, seatType, cinemaRoom: newCinemaRoomId } = req.body
            const seatId = req.params.id

            const seat = await Seat.findById(seatId).populate("cinemaRoom")
            if (!seat) {
                return res.status(404).json({ message: "seat not found..." })
            }

            const existSeat = await Seat.findOne({
                rowSeat: rowSeat,
                seatNumber: seatNumber,
                cinemaRoom: newCinemaRoomId,
                _id: { $ne: seatId }
            })

            if (existSeat) {
                return res.status(409).send(
                    `Seat ${rowSeat}-${seatNumber.padStart(3, "0")} already exists in room ${newCinemaRoomId}`
                )
            }

            const updateSeatObj = {
                rowSeat,
                seatNumber,
                seatType,
                cinemaRoom: newCinemaRoomId
            }

            const oldCinemaRoomId = seat.cinemaRoom ? seat.cinemaRoom._id : null

            await Seat.findByIdAndUpdate(seatId, updateSeatObj, { new: true })

            if (oldCinemaRoomId && oldCinemaRoomId.toString() !== newCinemaRoomId) {
                await CinemaRoom.findByIdAndUpdate(
                    oldCinemaRoomId,
                    { $pull: { seats: seatId } },
                    { new: true }
                )
            }

            await CinemaRoom.findByIdAndUpdate(
                newCinemaRoomId,
                { $addToSet: { seats: seatId } },
                { new: true }
            )

            res.redirect("/seat/table-lists")
        } catch (err) {
            next(err)
        }
    }

    delete = async (req, res, next) => {
        try {
            const seatId = req.params.id
            const seat = await Seat.findById(seatId)

            if (!seat) {
                return res.status(404).send("Seat does not exist...")
            }

            const cinemaRoom = await CinemaRoom.findById(seat.cinemaRoom)

            if (!cinemaRoom) {
                return res.status(404).send("Cinemaroom does not exist...")
            }

            await Seat.deleteOne({ _id: seatId })

            cinemaRoom.seats = cinemaRoom.seats.filter(id => id.toString() !== seatId)
            cinemaRoom.totalNumSeat = cinemaRoom.seats.length

            await cinemaRoom.save()

            res.redirect("/seat/table-lists")
        } catch (err) {
            next(err)
        }
    }
}

export default new SeatController