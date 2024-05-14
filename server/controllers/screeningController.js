import Screening from "../models/Screening.js"
import Movie from "../models/Movie.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Cinema from "../models/Cinema.js"
import { isValidObjectId } from "mongoose"

class ScreeningController {
    getApiScreening = async (req, res, next) => {
        let screenings

        try {
            screenings = await Screening.find()
                .populate("movie", "title")
                .populate("cinemaRoom", "roomNumber")
        } catch (err) {
            console.error(err)
        }

        if (!screenings) {
            res.status(500).json({ message: "request failed..." })
        }

        res.status(200).json({ screenings })
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
        const { movieDate, timeSlot, price } = req.body
        const movieObj = await Movie.findOne({ _id: req.body.movie })
        const cinemaRoomObj = await CinemaRoom.findOne({ _id: req.body.cinemaRoom })

        const screening = new Screening({
            movie: movieObj._id,
            movieDate,
            timeSlot,
            price,
            cinemaRoom: cinemaRoomObj._id,
            wasReleased: movieObj.wasReleased === true ? true : false
        })
        1
        await screening.save()
            .then(async () => {
                movieObj.screenings.push(screening._id)
                await movieObj.save()

                cinemaRoomObj.screenings.push(screening._id)
                await cinemaRoomObj.save()

                if (screening.wasReleased === true) {
                    res.redirect("/screening/now-showing")
                } else {
                    res.redirect("/screening/comming-soon")
                }
            })
            .catch(next)
    }

    lstNowShowing = async (req, res, next) => {
        try {
            const screenings = await Screening.find({ wasReleased: true })
            const movies = await Movie.find({})

            screenings.forEach((screening) => {
                const movie = movies.find((m) =>
                    m._id.toString() === screening.movie.toString()
                )
                screening.movieName = movie ? movie.title : "Unknown"
            })

            const cinemaRooms = await CinemaRoom.find({})
            const cinemas = await Cinema.find({})

            screenings.forEach((screening) => {
                const cinemaRoom = cinemaRooms.find((cr) =>
                    cr._id.toString() === screening.cinemaRoom.toString()
                )

                const cinema = cinemas.find((c) =>
                    cinemaRoom && c._id.toString() === cinemaRoom.cinema.toString()
                )

                screening.screeningAt = cinemaRoom && cinema
                    ? `${cinemaRoom.roomNumber}-${cinema.name}` : "Unknown"
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

    update(req, res, next) {
        Promise.all([
            Movie.findById({ _id: req.body.movie }),
            CinemaRoom.findById({ _id: req.body.cinemaRoom })
        ])
            .then(([movie, cinemaRoom]) => {
                const screeningId = req.params.id

                Screening.updateOne({ _id: screeningId }, {
                    movie: movie._id,
                    movieDate: req.body.movieDate,
                    timeSlot: req.body.timeSlot,
                    price: req.body.price,
                    cinemaRoom: cinemaRoom._id
                })
                    .then(() => {
                        if (movie.screenings.indexOf(screeningId) == -1) {
                            movie.screenings.push(screeningId)
                            movie.save()
                        }

                        if (cinemaRoom.screenings.indexOf(screeningId) == -1) {
                            cinemaRoom.screenings.push(screeningId)
                            cinemaRoom.save()
                        }

                        res.redirect("/screening/table-lists")
                    })
                    .catch(next)
            })
            .catch(next)
    }

    delete(req, res, next) {
        Screening.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/screening/table-lists"))
            .catch(next)
    }

    lstCommingSoon = async (req, res, next) => {
        try {
            const screenings = await Screening.find({ wasReleased: false })
            const movies = await Movie.find({})

            screenings.forEach((screening) => {
                const movie = movies.find((m) =>
                    m._id.toString() === screening.movie.toString()
                )
                screening.movieName = movie ? movie.title : "Unknown"
            })

            const cinemaRooms = await CinemaRoom.find({})
            const cinemas = await Cinema.find({})

            screenings.forEach((screening) => {
                const cinemaRoom = cinemaRooms.find((cr) =>
                    cr._id.toString() === screening.cinemaRoom.toString()
                )

                const cinema = cinemas.find((c) =>
                    cinemaRoom && c._id.toString() === cinemaRoom.cinema.toString()
                )

                screening.screeningAt = cinemaRoom && cinema
                    ? `${cinemaRoom.roomNumber}-${cinema.name}` : "Unknown"
            })

            res.render("screening/comming-soon", { screenings })
        } catch (err) {
            next(err)
        }
    }

    getAllSeatsFromCinemaRoom = async (req, res, next) => {
        try {
            const screening = await Screening.findById(req.params.id)
            if (!screening) {
                return res.status(404).json({ message: "screening not found..." })
            }

            const movie = await Movie.findById(screening.movie)
            if (!movie) {
                return res.status(404).json({ message: "movie not found..." })
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
                movieTitle: movie.title,
                roomNumber: cinemaRoom.roomNumber,
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