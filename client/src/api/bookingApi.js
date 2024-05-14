import axios from "axios"

export const newBooking = async (screeningId, seats, customerId) => {
    const res = await axios
        .post("/booking", { screening: screeningId, seats, user: customerId })
        .catch((err) => alert("Tickets cannot be booked because:", err))

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