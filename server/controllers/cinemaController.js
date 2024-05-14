import Cinema from "../models/Cinema.js"
import CinemaRoom from "../models/CinemaRoom.js"
import Screening from "../models/Screening.js"
import Movie from "../models/Movie.js"

class CinemaController {
    getApiCinema = async (req, res, next) => {
        let cinemas

        try {
            cinemas = await Cinema.find()
        } catch (err) {
            console.error(err)
        }

        if (!cinemas) {
            res.status(500).json({ message: "request failed..." })
        }

        res.status(200).json({ cinemas })
    }

    create(req, res, next) {
        res.render("cinema/create")
    }

    store(req, res, next) {
        const cinema = new Cinema(req.body)

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
            description: req.body.description
        })
            .then(() => res.redirect("/cinema/table-lists"))
            .catch(next)
    }

    delete(req, res, next) {
        Cinema.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/cinema/table-lists"))
            .catch(next)
    }

    getScreeningsFromCinemaRooms = async (req, res, next) => {
        try {
            const cinema = await Cinema.findById(req.params.cinemaId)

            if (!cinema) {
                return res.status(404).json({ message: "cinema not found..." })
            }

            const cinemaRoomIds = cinema.cinemaRooms
            const cinemaRooms = await CinemaRoom.find({ _id: { $in: cinemaRoomIds } })

            let screenings = []

            for (const cinemaRoom of cinemaRooms) {
                const screeningsOfCinemaRoom = await Screening.find({ cinemaRoom: cinemaRoom._id })
                    .select("_id movieDate timeSlot price movie")
                    .populate({ path: "cinemaRoom", select: "roomNumber" })

                const movie = await Movie.findOne({ slug: req.params.movieSlug })
                const screeningsMovie = screeningsOfCinemaRoom.filter((screening) => screening.movie.equals(movie._id))

                screenings = [...screenings, ...screeningsMovie]
            }

            return res.status(200).json({ screenings })
        } catch {
            return res.status(500).json({ message: next })
        }
    }
}

export default new CinemaController