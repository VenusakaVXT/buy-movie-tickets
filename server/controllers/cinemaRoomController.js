import Cinema from "../models/Cinema.js"
import CinemaRoom from "../models/CinemaRoom.js"
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
        const { roomNumber, totalNumSeat } = req.body
        const cinemaObj = await Cinema.findOne({ _id: req.body.cinema })

        if (!cinemaObj) {
            return res.status(404).send("cinema not found...")
        }

        const cinemaRoom = new CinemaRoom({
            roomNumber,
            totalNumSeat,
            cinema: cinemaObj._id
        })

        const savedCinemaRoom = await cinemaRoom.save()
        const seatIds = await this.createSeatsAuto(savedCinemaRoom._id, totalNumSeat)

        savedCinemaRoom.seats = seatIds
        await savedCinemaRoom.save()

        cinemaObj.cinemaRooms.push(cinemaRoom._id)
        await cinemaObj.save()

        res.redirect("/cinemaroom/table-lists")
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

    update(req, res, next) {
        Cinema.findById({ _id: req.body.cinema })
            .then((cinema) => {
                const cinemaRoomId = req.params.id

                CinemaRoom.updateOne({ _id: cinemaRoomId }, {
                    roomNumber: req.body.roomNumber,
                    totalNumSeat: req.body.totalNumSeat,
                    cinema: cinema._id
                })
                    .then(() => {
                        const foundCinemaRoom = cinema.cinemaRooms.indexOf(cinemaRoomId)

                        if (foundCinemaRoom == -1) {
                            cinema.cinemaRooms.push(cinemaRoomId)
                            cinema.save()
                        }

                        res.redirect("/cinemaroom/table-lists")
                    })
                    .catch(next)
            })
            .catch(next)
    }

    delete(req, res, next) {
        CinemaRoom.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/cinemaroom/table-lists"))
            .catch(next)
    }
}

export default new CinemaRoomController