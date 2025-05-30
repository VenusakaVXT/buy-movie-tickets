import Screening from "../models/Screening.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"
import Manager from "../models/Employee.js"
import mongoose, { isValidObjectId } from "mongoose"
import jwt from "jsonwebtoken"
import Seat from "../models/Seat.js"
import moment from "moment"
import { ScreeningFilter } from "../util/constants/screening.js"
import { OrderBy } from "../util/constants/order.js"

class ScreeningController {
    getApiScreening = async (req, res, next) => {
        const { groupCode, order } = req.query
        let sortOption = {}

        if (!groupCode) {
            try {
                const screenings = await Screening.find()
                    .populate("movie", "title")
                    .populate("cinemaRoom", "roomNumber")

                if (!screenings) {
                    return res.status(404).json({ message: "Screenings not found..." })
                }

                res.status(200).json({ screenings })
            } catch (err) {
                console.error(err)
                return res.status(500).json({ message: "Request failed..." })
            }
        }

        if (groupCode === ScreeningFilter.SCREENING_DATE) {
            sortOption.movieDate = order === OrderBy.DESC ? -1 : 1
        } else if (groupCode === ScreeningFilter.SCREENING_PRICE) {
            sortOption.price = order === OrderBy.DESC ? -1 : 1
        } else {
            return res.status(400).json({ message: "Invalid groupCode" })
        }

        try {
            const screenings = await Screening.find().sort(sortOption)
                .populate("movie", "title")
                .populate("cinemaRoom", "roomNumber")

            if (!screenings) {
                return res.status(404).json({ message: "Screenings not found..." })
            }

            res.status(200).json({ screenings })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Request failed..." })
        }
    }

    getScreeningById = async (req, res, next) => {
        const id = req.params.id
        try {
            const screening = await Screening.findById(id)
            if (!screening || !isValidObjectId(id)) {
                return res.status(404).json({ message: "Invalid screening id..." })
            }
            return res.status(200).json({ screening })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Request failed..." })
        }
    }

    addScreening = async (req, res, next) => {
        const extractedToken = req.headers.authorization.split(" ")[1]

        if (!extractedToken && extractedToken.trim() === "") {
            return res.status(404).json({ message: "token not found..." })
        }

        let managerId, screening

        jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
            if (err) {
                return res.status(400).json({ message: `${err.message}` })
            } else {
                managerId = decrypted.id
                return
            }
        })

        const { movie, movieDate, timeSlot, price, cinemaRoom } = req.body

        if (
            !movie && movie.trim() === "" && !movieDate && movieDate.trim() === ""
            && !timeSlot && timeSlot.trim() === "" && !price && price.trim() === ""
            && !cinemaRoom && cinemaRoom.trim() === ""
        ) {
            return res.status(422).json({ message: "invalid inputs..." })
        }

        try {
            const movieObj = await Movie.findById(movie)
            const cinemaRoomObj = await CinemaRoom.findById(cinemaRoom)

            if (!movieObj || !cinemaRoomObj) {
                return res.status(404).json({ message: "Movie or Cinemaroom not found..." })
            }

            const newScreeningDate = new Date(`${movieDate}T${timeSlot}:00`)
            const currentDate = new Date()

            if (newScreeningDate < currentDate) {
                return res.status(409).json({ message: "Cannot add screening for a past date." })
            }

            const existScreening = await Screening.findOne({
                cinemaRoom: cinemaRoomObj._id,
                movieDate,
                timeSlot
            })

            if (existScreening) {
                return res.status(409).json({
                    message: `There was a screening at ${timeSlot} on ${movieDate} in ${cinemaRoomObj.roomNumber} room.`
                })
            }

            const screenings = await Screening.find({ cinemaRoom, movieDate })

            for (let screening of screenings) {
                const existScreeningStart = new Date(`${screening.movieDate}T${screening.timeSlot}:00`)
                const existScreeningEnd = new Date(existScreeningStart.getTime() + movieObj.time * 60000)

                if (newScreeningDate < existScreeningEnd) {
                    return res.status(409).json({
                        message: `Cannot add screening at ${timeSlot} on ${movieDate} for ${cinemaRoomObj.roomNumber} room. 
                        Because the previous screening ends at ${existScreeningEnd.getHours()}
                        :${String(existScreeningEnd.getMinutes()).padStart(2, '0')}.`
                    })
                }
            }

            screening = new Screening({
                movie,
                movieDate,
                timeSlot,
                price,
                cinemaRoom,
                wasReleased: movieObj.wasReleased === true ? true : false,
                manager: managerId
            })

            const session = await mongoose.startSession()
            session.startTransaction()
            await screening.save({ session })

            movieObj.screenings.push(screening._id)
            await movieObj.save({ session })

            cinemaRoomObj.screenings.push(screening._id)
            await cinemaRoomObj.save({ session })

            const managerUser = await Manager.findById(managerId)
            managerUser.addedScreenings.push(screening._id)
            await managerUser.save({ session })

            await session.commitTransaction()
            session.endSession()

            if (!screening) {
                return res.status(500).json({ message: "Request failed..." })
            }

            return res.status(201).json({ screening, message: "Add screening successfully..." })
        } catch (err) {
            next(err)
        }
    }

    create(req, res, next) {
        Promise.all([Movie.find({}), CinemaRoom.find({})])
            .then(async ([movies, cinemaRooms]) => {
                const cinemas = await Cinema.find({})

                cinemaRooms.forEach((cinemaRoom) => {
                    const cinema = cinemas.find((c) =>
                        c._id.toString() === cinemaRoom.cinema.toString()
                    )
                    cinemaRoom.cinemaName = cinema ? cinema.name : "Unknown"
                })

                res.render("screening/create", { movies, cinemaRooms })
            })
            .catch(next)
    }

    store = async (req, res, next) => {
        const { movieDate, timeSlot, price, movie, cinemaRoom } = req.body

        try {
            const movieObj = await Movie.findOne({ _id: movie })
            const cinemaRoomObj = await CinemaRoom.findOne({ _id: cinemaRoom })
            const newScreeningDate = new Date(`${movieDate}T${timeSlot}:00`)
            const currentDate = new Date()

            if (newScreeningDate < currentDate) {
                return res.status(400).send("Cannot add screening for a past date.")
            }

            const existScreening = await Screening.findOne({
                cinemaRoom: cinemaRoomObj._id,
                movieDate,
                timeSlot
            })

            if (existScreening) {
                return res.status(400).send(
                    `There was a screening at ${timeSlot} on ${movieDate} in ${cinemaRoomObj.roomNumber} room.`
                )
            }

            const screenings = await Screening.find({ cinemaRoom, movieDate })

            for (let screening of screenings) {
                const existScreeningStart = new Date(`${screening.movieDate}T${screening.timeSlot}:00`)
                const existScreeningEnd = new Date(existScreeningStart.getTime() + movieObj.time * 60000)

                if (newScreeningDate < existScreeningEnd) {
                    return res.status(400).send(
                        `Cannot add screening at ${timeSlot} on ${movieDate} for ${cinemaRoomObj.roomNumber} room. 
                        Because the previous screening ends at ${existScreeningEnd.getHours()}
                        :${String(existScreeningEnd.getMinutes()).padStart(2, '0')}.`
                    )
                }
            }

            const screening = new Screening({
                movie: movieObj._id,
                movieDate,
                timeSlot,
                price,
                cinemaRoom: cinemaRoomObj._id,
                wasReleased: movieObj.wasReleased === true ? true : false
            })

            await screening.save()

            movieObj.screenings.push(screening._id)
            await movieObj.save()

            cinemaRoomObj.screenings.push(screening._id)
            await cinemaRoomObj.save()

            if (screening.wasReleased === true) {
                res.redirect("/screening/now-showing")
            } else {
                res.redirect("/screening/coming-soon")
            }
        } catch (err) {
            next(err)
        }
    }

    lstNowShowing = async (req, res, next) => {
        try {
            const screenings = await Screening.find({ wasReleased: true }).sort({ movieDate: 1 })
            const movies = await Movie.find({})
            const cinemaRooms = await CinemaRoom.find({})
            const cinemas = await Cinema.find({})

            screenings.forEach((screening) => {
                const movie = movies.find((m) =>
                    m._id.toString() === screening.movie.toString()
                )

                screening.movieName = movie ? movie.title : "Unknown"

                const cinemaRoom = cinemaRooms.find((cr) =>
                    cr._id.toString() === screening.cinemaRoom.toString()
                )
                const cinema = cinemas.find((c) =>
                    cinemaRoom && c._id.toString() === cinemaRoom.cinema.toString()
                )

                screening.screeningAt = cinemaRoom && cinema ? `${cinemaRoom.roomNumber}-${cinema.name}` : "Unknown"

                const screeningDate = new Date(screening.movieDate + "T" + screening.timeSlot + ":00")
                const currentDate = new Date()

                screening.showtimeOver = screeningDate < currentDate
            })

            res.render("screening/now-showing", { screenings })
        } catch (err) {
            next(err)
        }
    }

    edit(req, res, next) {
        Promise.all([Movie.find({}), CinemaRoom.find({}), Screening.findById(req.params.id)])
            .then(async ([movies, cinemaRooms, screening]) => {
                if (!screening.movie || !isValidObjectId(screening.movie)) {
                    screening.movie = ""
                }

                if (!screening.cinemaRoom || !isValidObjectId(screening.cinemaRoom)) {
                    screening.cinemaRoom = ""
                }

                const cinemas = await Cinema.find({})

                cinemaRooms.forEach((cinemaRoom) => {
                    const cinema = cinemas.find((c) =>
                        c._id.toString() === cinemaRoom.cinema.toString()
                    )
                    cinemaRoom.cinemaName = cinema ? cinema.name : "Unknown"
                })

                res.render("screening/edit", { movies, cinemaRooms, screening })
            })
            .catch(next)
    }

    update = async (req, res, next) => {
        const { movieDate, timeSlot, price, movie, cinemaRoom } = req.body
        const screeningId = req.params.id

        try {
            const [movieObj, cinemaRoomObj] = await Promise.all([
                Movie.findById({ _id: movie }),
                CinemaRoom.findById({ _id: cinemaRoom })
            ])

            if (!movieObj || !cinemaRoomObj) {
                return res.status(404).send("Movie or CinemaRoom not found...")
            }

            const newScreeningDate = new Date(`${movieDate}T${timeSlot}:00`)
            const currentDate = new Date()

            if (newScreeningDate < currentDate) {
                return res.status(400).send("Cannot update screening for a past date.")
            }

            const existScreening = await Screening.findOne({
                _id: { $ne: screeningId },
                cinemaRoom: cinemaRoomObj._id,
                movieDate,
                timeSlot
            })

            if (existScreening) {
                return res.status(400).send(
                    `There was a screening at ${timeSlot} on ${movieDate} in ${cinemaRoomObj.roomNumber} room.`
                )
            }

            const screenings = await Screening.find({
                cinemaRoom,
                movieDate,
                _id: { $ne: screeningId }
            })

            for (let screening of screenings) {
                const existScreeningStart = new Date(`${screening.movieDate}T${screening.timeSlot}:00`)
                const existScreeningEnd = new Date(existScreeningStart.getTime() + movieObj.time * 60000)

                if (newScreeningDate < existScreeningEnd) {
                    return res.status(400).send(
                        `Cannot update screening at ${timeSlot} on ${movieDate} for ${cinemaRoomObj.roomNumber} room. 
                        Because the previous screening ends at ${existScreeningEnd.getHours()}
                        :${String(existScreeningEnd.getMinutes()).padStart(2, '0')}.`
                    )
                }
            }

            const updateObj = { movie: movieObj._id, movieDate, timeSlot, price, cinemaRoom: cinemaRoomObj._id }
            const updatedScreening = await Screening.findByIdAndUpdate(screeningId, updateObj, { new: true })

            if (!updatedScreening) {
                return res.status(404).send("Screening not found...")
            }

            if (!movieObj.screenings.includes(screeningId)) {
                movieObj.screenings.push(screeningId)
                await movieObj.save()
            }

            if (!cinemaRoomObj.screenings.includes(screeningId)) {
                cinemaRoomObj.screenings.push(screeningId)
                await cinemaRoomObj.save()
            }

            res.redirect("/screening/now-showing")
        } catch (err) {
            next(err)
        }
    }

    delete = async (req, res, next) => {
        try {
            const screening = await Screening.findById(req.params.id)
            if (!screening) {
                return res.status(404).send("screening not found...")
            }

            const cinemaRoom = await CinemaRoom.findById(screening.cinemaRoom)
            if (!cinemaRoom) {
                return res.status(404).send("cinemaRoom not found...")
            }

            await Seat.updateMany({ _id: { $in: cinemaRoom.seats } }, { $set: { selected: false } })
            await screening.delete()

            cinemaRoom.screenings = cinemaRoom.screenings.filter(id => id.toString() !== screening._id.toString())
            await cinemaRoom.save()

            res.redirect("back")
        } catch (err) {
            next(err)
        }
    }

    lstComingSoon = async (req, res, next) => {
        try {
            const screenings = await Screening.find({ wasReleased: false }).sort({ movieDate: 1 })
            const movies = await Movie.find({})
            const cinemaRooms = await CinemaRoom.find({})
            const cinemas = await Cinema.find({})

            screenings.forEach((screening) => {
                const movie = movies.find((m) =>
                    m._id.toString() === screening.movie.toString()
                )
                const cinemaRoom = cinemaRooms.find((cr) =>
                    cr._id.toString() === screening.cinemaRoom.toString()
                )
                const cinema = cinemas.find((c) =>
                    cinemaRoom && c._id.toString() === cinemaRoom.cinema.toString()
                )

                screening.movieName = movie ? movie.title : "Unknown"
                screening.screeningAt = cinemaRoom && cinema ? `${cinemaRoom.roomNumber}-${cinema.name}` : "Unknown"
            })

            res.render("screening/coming-soon", { screenings })
        } catch (err) {
            next(err)
        }
    }

    getCurrentDateAnd7DaysLater = (req, res, next) => {
        try {
            const currentDate = moment()
            const dates = []

            for (let i = 0; i <= 7; i++) {
                dates.push(currentDate.clone().add(i, "days").format("YYYY-MM-DD"))
            }

            res.status(200).json({ dates })
        } catch (err) {
            next(err)
        }
    }

    getScreeningsByDate = async (req, res, next) => {
        try {
            const { movieSlug, movieDate } = req.params

            const movie = await Movie.findOne({ slug: movieSlug })
            if (!movie) {
                return res.status(404).json({ message: "Movie not found..." })
            }

            const screenings = await Screening.find({ movie: movie._id, movieDate })
                .populate("cinemaRoom", "roomNumber")
            res.status(200).json({ screenings })
        } catch (err) {
            next(err)
        }
    }

    getScreeningsByCinema = async (req, res, next) => {
        try {
            const cinema = await Cinema.findById(req.params.cinemaId)

            if (!cinema) {
                return res.status(404).json({ message: "Cinema not found..." })
            }

            const cinemaRoomIds = cinema.cinemaRooms
            const cinemaRooms = await CinemaRoom.find({ _id: { $in: cinemaRoomIds } })

            let screenings = []

            for (const cinemaRoom of cinemaRooms) {
                const screeningsOfCinemaRoom = await Screening
                    .find({ cinemaRoom: cinemaRoom._id })
                    .populate({ path: "cinemaRoom", select: "roomNumber" })

                const movie = await Movie.findOne({ slug: req.params.movieSlug })
                const screeningsMovie = screeningsOfCinemaRoom.filter((screening) => screening.movie.equals(movie._id))

                screenings = [...screenings, ...screeningsMovie]
            }

            return res.status(200).json({ screenings })
        } catch {
            return res.status(500).json({ message: "This movie has no show in this cinema" })
        }
    }

    getScreeningsByCinemaAndDate = async (req, res, next) => {
        const { movieSlug, movieDate, cinemaId } = req.params

        const movie = await Movie.findOne({ slug: movieSlug })
        if (!movie) {
            return res.status(404).json({ message: "Movie not found..." })
        }

        const cinemaRooms = await CinemaRoom.find({ cinema: cinemaId })
        if (!cinemaRooms.length) {
            return res.status(404).json({ message: "No cinema rooms found for this cinema" })
        }

        const cinemaRoomIds = cinemaRooms.map(room => room._id)
        const screenings = await Screening.find({
            movie: movie._id,
            movieDate,
            cinemaRoom: { $in: cinemaRoomIds }
        }).populate("cinemaRoom", "roomNumber")

        res.status(200).json({ screenings })
    }

    getAllSeatsFromCinemaRoom = async (req, res, next) => {
        try {
            const screeningId = req.params.id

            if (!isValidObjectId(screeningId)) {
                return res.status(400).json({ message: "invalid screening id..." })
            }

            const screening = await Screening.findById(screeningId)
            if (!screening) {
                return res.status(404).json({ message: "screening not found..." })
            }

            const cinemaRoom = await CinemaRoom.findById(screening.cinemaRoom)
                .populate("seats", "_id rowSeat seatNumber selected")
            if (!cinemaRoom) {
                return res.status(404).json({ message: "cinemaRoom not found..." })
            }

            const cinema = await Cinema.findOne({ cinemaRooms: cinemaRoom._id })
            if (!cinema) {
                return res.status(404).json({ message: "cinema not found..." })
            }

            const synthesizeData = {
                roomNumber: cinemaRoom.roomNumber,
                cinemaId: cinema._id,
                cinemaName: cinema.name,
                seats: cinemaRoom.seats,
                price: screening.price
            }

            return res.status(200).json({ synthesizeData })
        } catch (err) {
            next(err)
        }
    }
}

export default new ScreeningController