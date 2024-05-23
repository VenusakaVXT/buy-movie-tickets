import React from "react"
import Auth from "./Auth"
import { managerSendLoginRequest } from "../../api/userApi"
import { useDispatch } from "react-redux"
import { managerActions } from "../../store"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onResReceived = (data) => {
        console.log(data)
        dispatch(managerActions.login())
        localStorage.setItem("token", data.token)
        localStorage.setItem("managerId", data.id)
        localStorage.setItem("managerEmail", data.email)
        localStorage.setItem("cinemaId", data.cinemaId)
        navigate("/")
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