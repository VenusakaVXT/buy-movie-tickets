import React from "react"
import Auth from "./Auth"
import { userSendLoginRequest } from "../../api/userApi"

const Register = () => {
    const getData = (data) => {
        console.log(data)
        userSendLoginRequest(data.inputs, data.signUp)
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={true} />
    </div>
}

export default Register