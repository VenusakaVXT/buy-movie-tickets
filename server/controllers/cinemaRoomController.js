import Cinema from "../models/Cinema.js"
import CinemaRoom from "../models/CinemaRoom.js"
import { isValidObjectId } from "mongoose"

class CinemaRoomController {
    create(req, res, next) {
        Cinema.find({})
            .then((cinemas) => res.render("cinemaroom/create", { cinemas }))
            .catch(next)
    }

    store = async (req, res, next) => {
        const { roomNumber, totalNumSeat } = req.body
        const cinemaObj = await Cinema.findOne({ _id: req.body.cinema })

        const cinemaRoom = new CinemaRoom({
            roomNumber,
            totalNumSeat,
            cinema: cinemaObj._id
        })

        await cinemaRoom.save()
            .then(async () => {
                cinemaObj.cinemaRooms.push(cinemaRoom._id)
                await cinemaObj.save()
                res.redirect("/cinemaroom/table-lists")
            })
            .catch(next)
    }

    tableLists = async (req, res, next) => {
        try {
            const cinemaRooms = await CinemaRoom.find({})
            const cinemas = await Cinema.find({})

            cinemaRooms.forEach((cinemaroom) => {
                const cinema = cinemas.find((c) =>
                    c._id.toString() === cinemaroom.cinema.toString()
                )
                cinemaroom.cinemaName = cinema ? cinema.name : "Unknown"
            })

            res.render("cinemaroom/read", { cinemaRooms })
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
                CinemaRoom.updateOne({ _id: req.params.id }, {
                    roomNumber: req.body.roomNumber,
                    totalNumSeat: req.body.totalNumSeat,
                    cinema: cinema._id
                })
                    .then(() => res.redirect("/cinemaroom/table-lists"))
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