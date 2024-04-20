import React from "react"
import Auth from "./Auth"
import { customerSendLoginRequest } from "../../api/userApi"

const Register = () => {
    const getData = (data) => {
        console.log(data)
        customerSendLoginRequest(data.inputs, data.signUp)
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={true} role={"customer"}/>
    </div>
}

export default Register