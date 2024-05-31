import axios from "axios"

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

export const getScreeningsByMovie = async (slug) => {
    const res = await axios
        .get(`/movie/${slug}/screenings`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getScreeningsByCinema = async (id, slug) => {
    const res = await axios
        .get(`/cinema/${id}/cinema-room/screenings/${slug}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}

export const addMovie = async (data) => {
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
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("Add movie failed...")
    }

    const resData = await res.data
    return resData
}

export const addScreening = async (data) => {
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
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("Add screening failed...")
    }

    const resData = await res.data
    return resData
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