import axios from "axios"

export const customerSendLoginRequest = async (data, signUp) => {
    const res = await axios
        .post(`/user/${signUp ? "register" : "login"}`, signUp ? {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthDay: data.birthDay,
            gender: data.gender,
            adress: data.adress,
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
    const res = await axios.post("/manager/login", {
        email: data.email,
        password: data.password
    })
        .catch((err) => alert("Login failed because:", err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("Error sending manager login request...")
    }

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

export const updateUser = async (id) => {
    const res = await axios.put(`/user/${id}`)
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("update error...")
    }

    const resData = await res.data
    return resData
}