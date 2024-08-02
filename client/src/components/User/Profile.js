import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Box, Typography, Button } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { getCustomerProfile, getManagerProfile, changePassword } from "../../api/userApi"
import { handleDate } from "../../util"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import UserUpdateModal from "./UpdateUser"
import { toast } from "react-toastify"
import "../../scss/App.scss"

const Profile = () => {
    const [customer, setCustomer] = useState()
    const [manager, setManager] = useState()
    const [render, setRender] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [inputsPassword, setInputsPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })
    const customerId = localStorage.getItem("customerId")
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (isCustomerLoggedIn) {
            getCustomerProfile(customerId)
                .then((res) => setCustomer(res.user))
                .catch((err) => console.error(err))
        } else if (isManagerLoggedIn) {
            getManagerProfile(localStorage.getItem("managerId"))
                .then((res) => setManager(res.manager))
                .catch((err) => console.error(err))
        } else {
            console.log("Can't get profile because no account is logged in yet")
        }
    }, [isCustomerLoggedIn, isManagerLoggedIn, customerId])

    const handleNavigate = (path) => {
        if (isCustomerLoggedIn) {
            navigate(path)
        } else if (isManagerLoggedIn) {
            toast.info(t("profile.toastInfo1", { managerEmail: manager.email }))
        } else {
            toast.info(t("profile.toastInfo2"))
        }
    }

    const handleProfileUpdate = (updatedUser) => {
        dispatch(customerActions.updateName({ name: updatedUser.name }))
        setCustomer(updatedUser)
    }

    const handleValueInputsPassword = (e) => {
        const { name, value } = e.target
        setInputsPassword((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        try {
            const res = await changePassword(customerId, inputsPassword)
            if (res) {
                toast.success(i18n.language === "en" ? res.message : t("password.toastSuccess"))
                setRender(true)
                setInputsPassword({ oldPassword: "", newPassword: "", confirmNewPassword: "" })
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box className="wrapper" color={"#fff"}>
            <Box className="breadcrumb">
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                {i18n.language === "en"
                    ? <Typography className="breadcrumb__item disable">
                        {isCustomerLoggedIn ? t("login.customer") : t("login.manager")} {t("profile.title")}
                    </Typography>
                    : <Typography className="breadcrumb__item disable">
                        {t("profile.title")} {isCustomerLoggedIn ? t("login.customer") : t("login.manager")}
                    </Typography>
                }
                {!render && <Typography className="breadcrumb__item">
                    {t("profile.changePassword")}
                </Typography>}
            </Box>

            <Box margin={"20px 17px"} display={"flex"}>
                <Box sx={{
                    width: 250,
                    bgcolor: "#1a1b1e",
                    p: "20px",
                    borderRadius: "6px",
                    ".txt-hover.css-ahj2mt-MuiTypography-root": { mb: "12px" }
                }}>
                    <Typography className="txt-hover">{t("profile.personalInfo")}</Typography>
                    <Typography className="txt-hover">{t("profile.passwordsAndSecurity")}</Typography>
                    <hr style={{ marginBottom: "12px" }} />
                    <Typography className="txt-hover">{t("profile.yourPowers")}</Typography>
                    <Typography className="txt-hover">{t("profile.onlinePayment")}</Typography>
                    <hr style={{ marginBottom: "12px" }} />
                    <Typography className="txt-hover">{t("profile.termsOfService")}</Typography>
                    <Typography className="txt-hover">{t("profile.help")}</Typography>
                </Box>

                <Box width={"calc(100% - 250px)"} margin={"0 18px"}>
                    {i18n.language === "en"
                        ? <Typography variant="h4" textAlign={"center"}>
                            {isCustomerLoggedIn ? t("login.customer") : t("login.manager")} {t("profile.title")}
                        </Typography>
                        : <Typography variant="h4" textAlign={"center"} textTransform={"capitalize"}>
                            {t("profile.title")} {isCustomerLoggedIn ? t("login.customer") : t("login.manager")}
                        </Typography>
                    }

                    {render ? <>
                        <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <AccountCircleIcon sx={{ fontSize: "12rem" }} />

                            <Box height={180} margin={"24px"}>
                                {isCustomerLoggedIn && customer && <>
                                    <Typography className="txt-line">{t("profile.name")}: {customer.name}</Typography>
                                    <Typography className="txt-line">Email: {customer.email}</Typography>
                                    <Typography className="txt-line">
                                        {t("register.phoneNumber")}: {customer.phone}
                                    </Typography>
                                    <Typography className="txt-line">
                                        {t("profile.birthday")}: {customer.birthDay
                                            ? handleDate(customer.birthDay) : t("profile.noInfo")}
                                    </Typography>
                                    <Typography className="txt-line">
                                        {t("profile.gender")}: {customer.gender
                                            ? t(`profile.${customer.gender.toLowerCase()}`) : t("profile.noInfo")}
                                    </Typography>
                                    <Typography className="txt-line">
                                        {t("profile.address")}: {customer.address ? customer.address : t("profile.noInfo")}
                                    </Typography>
                                </>}

                                {isManagerLoggedIn && manager && <>
                                    <Typography className="txt-line">Email: {manager.email}</Typography>
                                    <Typography className="txt-line">
                                        {t("profile.position")}: {
                                            i18n.language === "en" ? manager.position
                                                : manager.position === "Manage screenings" ? t("statistical.manageScreenings")
                                                    : manager.position === "Manage movies" ? t("statistical.manageMovies")
                                                        : t("profile.noInfo")
                                        }
                                    </Typography>
                                    <Typography className="txt-line">{t("profile.workAt")} {manager.cinema.name}</Typography>
                                </>}
                            </Box>
                        </Box>

                        <Box display={"flex"} justifyContent={"center"}>
                            <Button className="btn lowercase" onClick={() => {
                                if (isCustomerLoggedIn) {
                                    setIsModalOpen(true)
                                } else {
                                    handleNavigate("edit-profile")
                                }
                            }}>
                                {t("profile.editProfile")}
                            </Button>
                            <Button className="btn lowercase" onClick={() => {
                                if (isManagerLoggedIn) {
                                    handleNavigate("change-password")
                                } else {
                                    setRender(false)
                                }
                            }}>
                                {t("profile.changePassword")}
                            </Button>
                        </Box>
                    </> : <Box>
                        <form onSubmit={handleChangePassword}>
                            <label>{t("password.currentPassword")}</label>
                            <input
                                className="input-form"
                                type="password"
                                value={inputsPassword.oldPassword}
                                name="oldPassword"
                                onChange={handleValueInputsPassword}
                                placeholder={t("password.placeholderCurrentPassword")}
                                required
                            />
                            <label>{t("password.newPassword")}</label>
                            <input
                                className="input-form"
                                type="password"
                                value={inputsPassword.newPassword}
                                name="newPassword"
                                onChange={handleValueInputsPassword}
                                placeholder={t("password.placeholderNewPassword")}
                                required
                            />
                            <label>{t("password.confirmNewPassword")}</label>
                            <input
                                className="input-form"
                                type="password"
                                value={inputsPassword.confirmNewPassword}
                                name="confirmNewPassword"
                                onChange={handleValueInputsPassword}
                                placeholder={t("password.placeholderConfirmNewPassword")}
                                required
                            />

                            <Box display={"flex"} justifyContent={"center"}>
                                <Button className="btn lowercase" onClick={() => setRender(true)}>
                                    {t("back")}
                                </Button>
                                <Button className="btn lowercase" type="submit">
                                    {t("password.savePassword")}
                                </Button>
                            </Box>
                        </form>
                    </Box>}
                </Box>
            </Box>

            {isModalOpen && <UserUpdateModal
                id={customerId}
                customerData={customer}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleProfileUpdate}
            />}
        </Box>
    )
}

export default Profile