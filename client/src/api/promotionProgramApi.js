import axios from "axios"

export const getPromotionPrograms = async () => {
    const res = await axios.get("/promotion-program")
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}

export const getPromotionProgramById = async (id) => {
    const res = await axios.get(`/promotion-program/${id}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}