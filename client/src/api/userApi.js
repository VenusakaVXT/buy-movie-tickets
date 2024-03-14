import axios from "axios"

export const userSendLoginRequest = async (data, signUp) => {
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
        .catch((err) => console.error(err))

    if (res.status !== 200 && res.status !== 201) {
        console.log("Error sending login request...")
    }

    const resData = await res.data
    return resData
}