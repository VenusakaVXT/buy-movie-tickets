import React, { useState } from "react"
import { Box, Typography, TextField, Link, Button } from "@mui/material"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"
import { customerSendRegisterRequest } from "../../api/userApi"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import ReCAPTCHA from "react-google-recaptcha"
import { Helmet } from "react-helmet"

const Register = ({ title }) => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: "",
        birthDay: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: "",
        captchaToken: null
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
            .catch(err => console.error(err))
    }

    return (
        <Box className="auth__wrapper">
            <Helmet><title>{title}</title></Helmet>
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

                <ReCAPTCHA
                    style={{ marginTop: 10 }}
                    sitekey="6Le77hoqAAAAAPI4zMmhLPgiG5DSvvLKOVmMeMIz"
                    onChange={(token) => setInputs((prevState) => ({ ...prevState, captchaToken: token }))}
                />

                <Button className="auth__btn" type="submit">{t("register.btn")}</Button>

                <Typography className="question-switch">
                    {t("register.question")} <Link onClick={() => navigate("/login")}>{t("register.switch")}</Link>
                </Typography>
            </form>
        </Box>
    )
}

export default Register