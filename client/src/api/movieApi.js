import axios from "axios"
import { toast } from "react-toastify"

export const getApiFromBE = async (destination) => {
    const res = await axios
        .get(`/${destination}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getMovieDetail = async (slug) => {
    const res = await axios
        .get(`/movie/${slug}/detail`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getCommentsByMovie = async (slug) => {
    const res = await axios
        .get(`/movie/${slug}/comments`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("0 CMT...")

    const resData = await res.data
    return resData
}

export const getScreeningsByMovie = async (slug) => {
    const res = await axios
        .get(`/movie/${slug}/screenings`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getCurrentDateAnd7DaysLater = async () => {
    const res = await axios.get("/screening/dates")
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no dates...")

    const resData = await res.data
    return resData
}

export const getScreeningsByDate = async (movieSlug, movieDate) => {
    const res = await axios
        .get(`/screening/${movieSlug}/${movieDate}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no screenings...")

    const resData = await res.data
    return resData
}

export const getScreeningsByCinema = async (cinemaId, movieSlug) => {
    const res = await axios
        .get(`/screening/${movieSlug}/cinema/${cinemaId}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no screenings...")

    const resData = await res.data
    return resData
}

export const getScreeningsByCinemaAndDate = async (movieSlug, movieDate, cinemaId) => {
    const res = await axios
        .get(`/screening/${movieSlug}/${movieDate}/${cinemaId}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no screenings...")

    const resData = await res.data
    return resData
}

export const addMovie = async (data) => {
    try {
        const res = await axios
            .post("/movie/", {
                title: data.title,
                description: data.description,
                director: data.director,
                contentWritter: data.contentWritter,
                actors: data.actors,
                category: data.category,
                releaseDate: data.releaseDate,
                time: data.time,
                trailerId: data.trailerId,
                producer: data.producer,
                wasReleased: data.wasReleased,
                manager: localStorage.getItem("managerId")
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

        const resData = res.data
        return resData
    } catch (err) {
        console.error(err)
        if (err.response.status === 409) {
            toast.error(err.response.data.message)
        } else {
            toast.error("Add movie failed...")
        }
        return null
    }
}

export const addScreening = async (data) => {
    try {
        const res = await axios
            .post("/screening/", {
                movie: data.movie,
                movieDate: data.movieDate,
                timeSlot: data.timeSlot,
                price: data.price,
                cinemaRoom: data.cinemaRoom,
                manager: localStorage.getItem("managerId")
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

        const resData = res.data
        return resData
    } catch (err) {
        console.error(err)
        if (err.response.status === 409) {
            toast.error(err.response.data.message.replace(/\s+/g, " "))
        } else {
            toast.error("Add screening failed...")
        }
        return null
    }
}

export const getMovieStatistics = async () => {
    const res = await axios.get("/movie/statistics")
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}