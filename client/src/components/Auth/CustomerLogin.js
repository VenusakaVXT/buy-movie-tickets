import React from "react"
import Auth from "./Auth"
import { customerSendLoginRequest } from "../../api/userApi"
import { useDispatch } from "react-redux"
import { customerActions } from "../../store"

const Login = () => {
    const dispatch = useDispatch()

    const onResReceived = (data) => {
        console.log(data)
        dispatch(customerActions.login())
        localStorage.setItem("customerId", data.id)
    }

    const getData = (data) => {
        console.log(data)
        customerSendLoginRequest(data.inputs, data.signUp)
            .then(onResReceived)
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={false} role={"customer"}/>
    </div>
}

export default Login