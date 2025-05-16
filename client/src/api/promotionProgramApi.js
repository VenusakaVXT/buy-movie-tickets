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

export const getPromotionProgramsByCinema = async (cinemaId) => {
    const res = await axios.get(`/promotion-program/cinema/${cinemaId}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}

export const getPromotionProgramByDiscountCode = async (discountCode) => {
    const res = await axios.get(`/promotion-program/discount-code/${discountCode}`)
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