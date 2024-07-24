import React, { useState } from "react"
import {
    Box,
    Typography,
    TextField,
    Link,
    Button,
    Switch
} from "@mui/material"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"
import {
    customerSendLoginRequest,
    managerSendLoginRequest
} from "../../api/userApi"
import { useDispatch } from "react-redux"
import { customerActions, managerActions } from "../../store"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Login = () => {
    const [isCustomer, setIsCustomer] = useState(true)
    const [inputs, setInputs] = useState({ nameAccount: "", password: "" })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputs((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleSwitchChange = (e) => setIsCustomer(e.target.checked)

    const handleSubmit = (e) => {
        e.preventDefault()
        isCustomer
            ? customerSendLoginRequest(inputs)
                .then((data) => {
                    console.log(data)
                    dispatch(customerActions.login({
                        id: data.id,
                        name: data.name,
                        bookings: data.bookings,
                        ratingPoints: data.ratingPoints
                    }))
                    localStorage.setItem("customerId", data.id)
                    localStorage.setItem("customerName", data.name)
                    navigate("/")
                    toast.success(i18n.language === "us" ? data.message : t("login.toastSuccess"))
                })
                .catch(err => console.error(err))
            : managerSendLoginRequest(inputs)
                .then((data) => {
                    console.log(data)
                    dispatch(managerActions.login({ id: data.id }))
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("managerId", data.id)
                    localStorage.setItem("managerEmail", data.email)
                    localStorage.setItem("cinemaId", data.cinemaId)
                    navigate("/")
                    toast.success(i18n.language === "us" ? data.message : t("login.toastSuccess"))
                })
                .catch(err => console.error(err))
    }

    return (
        <Box className="auth__wrapper">
            <Brand />

            <form height={430} className="auth__frm" onSubmit={handleSubmit}>
                <Typography variant="h5" color="#ff0000">{t("login.title")}</Typography>

                <TextField
                    value={inputs.nameAccount}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="text"
                    placeholder={`Email/${t("register.phoneNumber")}`}
                    name="nameAccount"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.password}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    placeholder={t("register.password")}
                    name="password"
                    onChange={handleChange}
                    required
                />

                <Box mt={1} display={"flex"} justifyContent={"space-between"}>
                    <Box display={"flex"}>
                        <Switch defaultChecked color="error" size="small" onChange={handleSwitchChange} />
                        <Typography color={"#6d6d6e"}>
                            {isCustomer ? t("login.customer") : t("login.manager")}
                        </Typography>
                    </Box>
                    <Link className="forgot-password">{t("login.forgotPassword")}</Link>
                </Box>

                <Button className="auth__btn" type="submit">{t("login.btn")}</Button>

                <Box className="other">
                    <Box className="line"></Box>
                    <span>{t("register.or").toUpperCase()}</span>
                    <Box className="line"></Box>
                </Box>

                <Box margin={"23px 0"}>
                    <Box sx={{
                        width: "100%",
                        height: 40,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        textTransform: "uppercase",
                        bgcolor: "#fff",
                        color: "#000",
                        cursor: "pointer",
                        ":hover": {
                            opacity: 0.8
                        }
                    }}>
                        <Typography>{t("register.btn2")}</Typography>
                    </Box>
                </Box>

                <Typography className="question-switch">
                    {t("login.question")} <Link onClick={() => navigate("/register")}>{t("login.switch")}</Link>
                </Typography>
            </form>
        </Box>
    )
}

export default Login