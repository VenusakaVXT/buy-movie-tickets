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

export const getCommentsByMovie = async (slug) => {
    const res = await axios
        .get(`/movie/${slug}/comments`)
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
        if (err.response.status !== 200 && err.response.status !== 201) {
            alert("Add movie failed...")
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
            alert(err.response.data.message.replace(/\s+/g, " "))
        } else {
            alert("Add screening failed...")
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