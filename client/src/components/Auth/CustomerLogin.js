import React from "react"
import Auth from "./Auth"
import { customerSendLoginRequest } from "../../api/userApi"
import { useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onResReceived = (data) => {
        console.log(data)
        dispatch(customerActions.login())
        localStorage.setItem("customerId", data.id)
        localStorage.setItem("customerName", data.name)
        navigate("/")
    }

    const getData = (data) => {
        console.log(data)
        customerSendLoginRequest(data.inputs, data.signUp)
            .then(onResReceived)
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={false} role={"customer"} />
    </div>
}

export default Login