import React from "react"
import Auth from "./Auth"
import { managerSendLoginRequest } from "../../api/userApi"
import { useDispatch } from "react-redux"
import { managerActions } from "../../store"

const Login = () => {
    const dispatch = useDispatch()

    const onResReceived = (data) => {
        console.log(data)
        dispatch(managerActions.login())
        localStorage.setItem("managerId", data.id)
        localStorage.setItem("token", data.token)
    }

    const getData = (data) => {
        console.log(data)
        managerSendLoginRequest(data.inputs)
            .then(onResReceived)
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={false} role={"manager"}/>
    </div>
}

export default Login