import axios from "axios"
import { toast } from "react-toastify"
import vi from "../locales/vi/translation.json"
import en from "../locales/en/translation.json"

const handleLanguage = (viStr, enStr) => {
    const i18nValue = localStorage.getItem("i18nextLng")
    return i18nValue === "vi" ? viStr : enStr
}

export const customerSendRegisterRequest = async (data) => {
    const res = await axios
        .post("/user/register", {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthDay: data.birthDay,
            gender: data.gender,
            address: data.address,
            password: data.password,
            confirmPassword: data.confirmPassword,
            captchaToken: data.captchaToken
        })
        .catch((err) => {
            console.error("Register failed because:", err)
            if (err.response.status === 400) {
                toast.error(handleLanguage(vi.errReCaptcha, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.register.toastError3, en.register.toastError3))
            }
        })

    const resData = await res.data
    return resData
}

export const customerSendLoginRequest = async (data) => {
    const res = await axios
        .post("/user/login", {
            nameAccount: data.nameAccount,
            password: data.password,
        })
        .catch((err) => {
            console.error("Login failed because:", err)
            if (err.response.status === 404) {
                toast.error(handleLanguage(vi.login.toastError1, err.response.data.message))
            } else if (err.response.status === 400) {
                toast.error(handleLanguage(vi.login.toastError2, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.login.toastError3, en.login.toastError3))
            }
        })

    const resData = await res.data
    return resData
}

export const managerSendLoginRequest = async (data) => {
    const res = await axios
        .post("/manager/login", {
            email: data.nameAccount,
            password: data.password
        })
        .catch((err) => {
            console.error("Login failed because:", err)
            if (err.response.status === 423) {
                toast.error(handleLanguage(vi.login.toastManagerDisabled, err.response.data.message))
            } else if (err.response.status === 404) {
                toast.error(handleLanguage(vi.login.toastError1, err.response.data.message))
            } else if (err.response.status === 400) {
                toast.error(handleLanguage(vi.login.toastError2, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.login.toastError3, en.login.toastError3))
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

export const changePassword = async (id, data) => {
    const res = await axios
        .put(`/user/${id}/change-password`, data)
        .catch((err) => {
            if (err.response.status === 401) {
                toast.error(handleLanguage(vi.password.toastError1, err.response.data.message))
            } else if (err.response.status === 402) {
                toast.error(handleLanguage(vi.password.toastError2, err.response.data.message))
            } else if (err.response.status === 403) {
                toast.error(handleLanguage(vi.password.toastError3, err.response.data.message))
            } else if (err.response.status === 404) {
                toast.error(handleLanguage(vi.login.toastError1, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.password.toastError, en.password.toastError))
            }
        })

    const resData = await res.data
    return resData
}

export const sendCodeToEmail = async (data) => {
    const res = await axios
        .post("/user/send-code-to-email", data)
        .catch((err) => {
            if (err.response.status === 404) {
                toast.error(handleLanguage(vi.login.toastError1, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.verifyCode.sendEmailFailed, err.response.data.message))
            }
        })

    const resData = await res.data
    return resData
}

export const forgotPassword = async (data) => {
    const res = await axios
        .post("/user/forgot-password", data)
        .catch((err) => {
            if (err.response.status === 400) {
                toast.error(handleLanguage(vi.errReCaptcha, err.response.data.message))
            } else if (err.response.status === 401) {
                toast.error(handleLanguage(vi.password.toastError2, err.response.data.message))
            } else if (err.response.status === 402) {
                toast.error(handleLanguage(vi.verifyCode.toastInvalidVerifyCode, err.response.data.message))
            } else if (err.response.status === 403) {
                toast.error(handleLanguage(vi.verifyCode.toastVerifyCodeExpiry, err.response.data.message))
            } else {
                toast.error(handleLanguage(vi.password.toastError, err.response.data.message))
            }
        })

    const resData = await res.data
    return resData
}