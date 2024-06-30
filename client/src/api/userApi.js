import axios from "axios"

export const customerSendLoginRequest = async (data, signUp) => {
    const res = await axios
        .post(`/user/${signUp ? "register" : "login"}`, signUp ? {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthDay: data.birthDay,
            gender: data.gender,
            address: data.address,
            password: data.password,
            confirmPassword: data.confirmPassword
        } : {
            nameAccount: data.nameAccount,
            password: data.password,
        })
        .catch((err) => alert("Login failed because:", err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("Error sending customer login request...")
    }

    const resData = await res.data
    return resData
}

export const managerSendLoginRequest = async (data) => {
    const res = await axios
        .post("/manager/login", {
            email: data.email,
            password: data.password
        })
        .catch((err) => {
            console.error(err)
            if (err.response.status === 400) {
                alert(err.response.data.message)
            } else {
                alert("Error sending manager login request...")
            }
        })

    const resData = await res.data
    return resData
}

export const getCustomerProfile = async (id) => {
    const res = await axios.get(`/user/${id}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("user not found...")
    }

    const resData = await res.data
    return resData
}

export const getManagerProfile = async (id) => {
    const res = await axios.get(`/manager/${id}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("manager not found...")
    }

    const resData = await res.data
    return resData
}

export const updateUser = async (id, data) => {
    const res = await axios.put(`/user/${id}`, data)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("update error...")
    }

    const resData = await res.data
    return resData
}

export const userComment = async ({ userId, movieId, content }) => {
    const res = await axios
        .post("/user/create-comment", { userId, movieId, content })
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("error post comment...")
    }

    const resData = await res.data
    return resData
}

export const userDeleteComment = async (commentId) => {
    const res = axios
        .delete(`/user/delete-comment/${commentId}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("error delete comment...")
    }

    const resData = await res.data
    return resData
}

export const getCustomersRanking = async () => {
    const res = await axios.get("/user/customers/ranking")
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}

export const getEmployeeStatistics = async () => {
    const res = await axios.get("/manager/statistics/employees")
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}

export const comparePassword = async (id, password) => {
    const res = await axios
        .post(`/user/${id}/compare-password`, { password })
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log(`${password} does not match the user's password`)
    }

    const resData = await res.data
    return resData
}

export const getCancelBookingsByUser = async (id) => {
    const res = await axios
        .get(`/user/${id}/cancel-bookings`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("no data...")
    }

    const resData = await res.data
    return resData
}