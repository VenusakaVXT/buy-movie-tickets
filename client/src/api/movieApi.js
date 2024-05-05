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