import axios from "axios"
import { toast } from "react-toastify"

export const newBooking = async (screeningId, seats, customerId) => {
    const res = await axios
        .post("/booking", { screening: screeningId, seats, user: customerId })
        .catch(() => toast.error("Tickets cannot be booked"))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getBookingDetail = async (id) => {
    const res = await axios
        .get(`/booking/${id}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}

export const getBookingsFromUser = async () => {
    const userId = localStorage.getItem("customerId")

    const res = await axios
        .get(`/user/${userId}/bookings`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}

export const cancelBooking = async ({ userId, bookingId, reason, refunds, compensationPercent }) => {
    const res = await axios
        .post("/booking/cancel-booking", { userId, bookingId, reason, refunds, compensationPercent })
        .catch(() => toast.error("There is a problem with the process of canceling screening tickets"))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}

export const detailCancelBooking = async (id) => {
    const res = await axios
        .get(`/booking/cancel-booking/${id}/detail`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}

export const restoreBooking = async (id) => {
    const res = await axios
        .patch(`/booking/cancel-booking/${id}/restore`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) console.log("no data...")

    const resData = await res.data
    return resData
}