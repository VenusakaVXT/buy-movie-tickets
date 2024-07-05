import React from "react"
import Auth from "./Auth"
import { customerSendLoginRequest } from "../../api/userApi"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Register = () => {
    const navigate = useNavigate()

    const getData = (data) => {
        customerSendLoginRequest(data.inputs, data.signUp)
            .then((res) => {
                console.log(res)
                navigate("/customer/login")
                toast.success(res.message)
            })
            .catch(err => console.error(err))
    }

    return <div>
        <Auth onSubmit={getData} signUp={true} role={"customer"}/>
    </div>
}

export default Register