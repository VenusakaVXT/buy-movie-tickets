import React, { useState } from "react"
import { Box, Typography, TextField, Link, Button } from "@mui/material"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"
import { customerSendRegisterRequest } from "../../api/userApi"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Register = () => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: "",
        birthDay: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputs((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (inputs.password !== inputs.confirmPassword) {
            return toast.error(t("register.toastError1"))
        }

        const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}/
        if (!passwordPattern.test(inputs.password)) {
            return toast.error(t("register.toastError2"))
        }

        customerSendRegisterRequest(inputs)
            .then((res) => {
                console.log(res)
                navigate("/login")
                toast.success(i18n.language === "en" ? res.message : t("register.toastSuccess"))
            })
            .catch(() => toast.error(t("register.toastError3")))
    }

    return (
        <Box className="auth__wrapper">
            <Brand />

            <form height={780} className="auth__frm" onSubmit={handleSubmit}>
                <Typography variant="h5" color="#ff0000">{t("register.title")}</Typography>

                <TextField
                    value={inputs.name}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="text"
                    placeholder={t("register.fullName")}
                    name="name"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.email}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.phone}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="tel"
                    placeholder={t("register.phoneNumber")}
                    name="phone"
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

                <TextField
                    value={inputs.confirmPassword}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    placeholder={t("register.confirmPassword")}
                    name="confirmPassword"
                    onChange={handleChange}
                    required
                />

                <Button className="auth__btn" type="submit">{t("register.btn")}</Button>

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
                    {t("register.question")} <Link onClick={() => navigate("/login")}>{t("register.switch")}</Link>
                </Typography>
            </form>
        </Box>
    )
}

export default Register