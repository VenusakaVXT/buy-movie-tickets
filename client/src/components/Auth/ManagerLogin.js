import React from "react"
import Auth from "./Auth"
import { managerSendLoginRequest } from "../../api/userApi"

const Login = () => {
    const getData = (data) => {
        console.log(data)
        managerSendLoginRequest(data.inputs)
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={false} role={"manager"}/>
    </div>
}

export default Login