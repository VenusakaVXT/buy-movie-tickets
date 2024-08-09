import Cinema from "../models/Cinema.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Screening from "../models/Screening.js"
import Seat from "../models/Seat.js"
import { isValidObjectId } from "mongoose"

class CinemaRoomController {
    create(req, res, next) {
        Cinema.find({})
            .then((cinemas) => res.render("cinemaroom/create", { cinemas }))
            .catch(next)
    }

    createSeatsAuto = async (cinemaRoomId, totalNumSeat) => {
        const seats = []
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]

        for (let i = 0; i < totalNumSeat; i++) {
            const rowSeat = rows[Math.floor(i / 11)]
            const seatNumber = (i % 11) + 1

            const seat = new Seat({
                rowSeat,
                seatNumber: seatNumber.toString(),
                seatType: "Single",
                cinemaRoom: cinemaRoomId,
                selected: false
            })

            seats.push(seat)
        }

        const savedSeats = await Seat.insertMany(seats)
        return savedSeats.map(seat => seat._id)
    }

    store = async (req, res, next) => {
        try {
            const { roomNumber, totalNumSeat } = req.body

            const cinemaObj = await Cinema.findOne({ _id: req.body.cinema })
            if (!cinemaObj) {
                return res.status(404).send("cinema not found...")
            }

            const existCinemaRoom = await CinemaRoom.findOne({ roomNumber, cinema: cinemaObj._id })
            if (existCinemaRoom) {
                return res.status(409).send(`Room ${roomNumber} already exists in cinema ${cinemaObj.name}`)
            }

            const cinemaRoom = new CinemaRoom({ roomNumber, totalNumSeat, cinema: cinemaObj._id })
            const savedCinemaRoom = await cinemaRoom.save()
            const seatIds = await this.createSeatsAuto(savedCinemaRoom._id, totalNumSeat)

            savedCinemaRoom.seats = seatIds
            await savedCinemaRoom.save()

            cinemaObj.cinemaRooms.push(cinemaRoom._id)
            await cinemaObj.save()

            res.redirect("/cinemaroom/table-lists")
        } catch (err) {
            next(err)
        }
    }

    tableLists = async (req, res, next) => {
        try {
            const { cinemaId } = req.query
            let cinemaRooms

            if (cinemaId && cinemaId !== "all") {
                cinemaRooms = await CinemaRoom.find({ cinema: cinemaId }).populate("cinema", "name")
            } else {
                cinemaRooms = await CinemaRoom.find({}).populate("cinema", "name")
            }

            const cinemas = await Cinema.find({})

            res.render("cinemaroom/read", { cinemaRooms, cinemas, selectedCinemaId: cinemaId || "all" })
        } catch (err) {
            next(err)
        }
    }

    edit(req, res, next) {
        Promise.all([Cinema.find({}), CinemaRoom.findById(req.params.id)])
            .then(([cinemas, cinemaroom]) => {
                if (!cinemaroom.cinema || !isValidObjectId(cinemaroom.cinema)) {
                    cinemaroom.cinema = ""
                }
                res.render("cinemaroom/edit", { cinemas, cinemaroom })
            })
            .catch(next)
    }

    update = async (req, res, next) => {
        try {
            const { roomNumber, totalNumSeat, cinema } = req.body
            const cinemaRoomId = req.params.id
            const cinemaObj = await Cinema.findById(cinema)

            if (!cinemaObj) {
                return res.status(404).send("cinema not found...")
            }

            const existCinemaRoom = await CinemaRoom.findOne({
                roomNumber,
                cinema: cinemaObj._id,
                _id: { $ne: cinemaRoomId }
            })

            if (existCinemaRoom) {
                return res.status(409).send(`Room ${roomNumber} already exists in cinema ${cinemaObj.name}`)
            }

            await CinemaRoom.updateOne({ _id: cinemaRoomId }, { roomNumber, totalNumSeat, cinema: cinemaObj._id })

            if (!cinemaObj.cinemaRooms.includes(cinemaRoomId)) {
                cinemaObj.cinemaRooms.push(cinemaRoomId)
                await cinemaObj.save()
            }

            res.redirect("/cinemaroom/table-lists")
        } catch (err) {
            next(err)
        }
    }

    delete = async (req, res, next) => {
        try {
            const cinemaRoomId = req.params.id

            const cinemaRoom = await CinemaRoom.findById(cinemaRoomId)
            if (!cinemaRoom) {
                return res.status(404).send("Cinema room does not exist...")
            }

            const cinema = await Cinema.findById(cinemaRoom.cinema)
            if (!cinema) {
                return res.status(404).send("Cinema does not exist...")
            }

            cinema.cinemaRooms = cinema.cinemaRooms.filter(id => id.toString() !== cinemaRoomId)

            await cinema.save()
            await Screening.delete({ cinemaRoom: cinemaRoomId })
            await Seat.deleteMany({ _id: { $in: cinemaRoom.seats } })
            await CinemaRoom.deleteOne({ _id: cinemaRoomId })

            res.redirect("/cinema-room/table-lists")
        } catch (err) {
            next(err)
        }
    }

    resetSeats = async (req, res, next) => {
        try {
            const cinemaRoom = await CinemaRoom.findById(req.params.id).populate("seats")

            if (!cinemaRoom) {
                return res.status(404).json({ message: "CinemaRoom not found..." })
            }

            const seatUpdates = cinemaRoom.seats.map((seatId) => {
                return Seat.findByIdAndUpdate(seatId, { selected: false }, { new: true })
            })

            await Promise.all(seatUpdates)
            return res.status(200).json({ message: "Reset seats successfully!!!" })
        } catch (err) {
            res.status(400).json({ message: "Reset seats failed!!!" })
            next(err)
        }
    }
}

export default new CinemaRoomController