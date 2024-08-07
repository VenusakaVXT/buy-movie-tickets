import React, { useState, useEffect } from "react"
import { Box, Typography, Button, Avatar } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { forgotPassword } from "../../api/userApi"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"

const divStyle = { display: "flex", alignItems: "center", justifyContent: "center" }

const ForgotPassword = () => {
    const userName = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")
    const [verifyCode, setVerifyCode] = useState(null)
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [captchaToken, setCaptchaToken] = useState(null)
    const [runTime, setRunTime] = useState(5 * 60)
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (runTime === 0) {
            toast.warn(t("password.toastWarnRunTime"))
            return
        }

        const getTimeLeft = setInterval(() => {
            setRunTime(prevTime => prevTime - 1)
        }, 1000)

        return () => clearInterval(getTimeLeft)
    }, [t, runTime])

    const formatRunTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (verifyCode.length !== 6) {
            toast.error(t("password.toastVerifyCode"))
        }

        try {
            const res = await forgotPassword({
                email,
                verifyCode,
                newPassword,
                confirmNewPassword,
                captchaToken
            })
            if (res) {
                toast.success(i18n.language === "en" ? res.message : t("password.toastSuccess"))
                localStorage.removeItem("userEmail")
                localStorage.removeItem("userName")
                navigate("/login")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box className="wrapper">
            <Helmet><title>{formatTitle(t("password.forgotPassword"))}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                <Typography className="breadcrumb__item" onClick={() => navigate("/login")}>
                    {t("login.title")}
                </Typography>
                <Typography className="breadcrumb__item">{t("password.forgotPassword")}</Typography>
            </Box>

            <Box height={"90vh"} sx={divStyle}>
                <form
                    style={{
                        width: 630,
                        padding: "20px",
                        border: "1px solid #767676",
                        borderRadius: "10px"
                    }}
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h4" textAlign={"center"} color={"#f2f2f2"} mb={0.5}>
                        {t("password.forgotPassword")}
                    </Typography>

                    <Typography variant="caption" color={"#f2f2f2"}>
                        <Box
                            width={"100%"}
                            display={"flex"}
                            flexWrap={"wrap"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            sx={{ "span": { mr: "3px" }, wordWrap: "break-word" }}
                        >
                            <span>{t("password.reminder1")}</span>
                            <span><Avatar sx={{ width: 20, height: 20 }} /></span>
                            <span>{userName !== null ? userName : t("password.accountNameNotFound")}.</span>
                            <span>{t("password.reminder2")}</span>
                            <span style={{ color: "#e50914" }}>{formatRunTime(runTime)}</span>
                        </Box>
                    </Typography>

                    <Box sx={divStyle}>
                        <Typography width={"170px"} fontSize={"1rem"} mr={1} color={"#fff"}>
                            {t("password.verifyCode")}
                        </Typography>
                        <input
                            className="input-form"
                            name="verifyCode"
                            type="number"
                            minLength={6}
                            size={6}
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            placeholder={t("password.placeholderVerifyCode")}
                            required
                        />
                    </Box>

                    <Box sx={divStyle}>
                        <Typography width={"170px"} fontSize={"1rem"} mr={1} color={"#fff"}>
                            {t("password.newPassword")}
                        </Typography>
                        <input
                            className="input-form"
                            name="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t("password.placeholderNewPassword")}
                            required
                        />
                    </Box>

                    <Box sx={divStyle}>
                        <Typography width={"170px"} fontSize={"1rem"} mr={1} color={"#fff"}>
                            {t("password.confirmNewPassword")}
                        </Typography>
                        <input
                            className="input-form"
                            name="confirmNewPassword"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder={t("password.placeholderConfirmNewPassword")}
                            required
                        />
                    </Box>

                    <Box display={"flex"} mt={1}>
                        <Typography fontSize={"1rem"} mr={1} color={"#fff"}>
                            {t("password.authReCaptcha")}
                        </Typography>
                        <ReCAPTCHA
                            sitekey="6LeaCBwqAAAAAOIKIk5CjYXnlt12j6UkBdQv2yfx"
                            onChange={(token) => setCaptchaToken(token)}
                        />
                    </Box>

                    <Box sx={divStyle} mt={2}>
                        <Button className="btn" type="submit">{t("password.resetPassword")}</Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ForgotPassword