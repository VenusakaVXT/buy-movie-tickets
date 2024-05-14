import axios from "axios"

export const getAllSeatsFromCinemaRoom = async (screeningId) => {
    const res = await axios
        .get(`/screening/${screeningId}/cinema-room/all-seats`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const resData = await res.data
    return resData
}