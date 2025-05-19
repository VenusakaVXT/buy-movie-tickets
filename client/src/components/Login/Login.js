import React, { useState } from "react"
import {
    Box,
    Typography,
    TextField,
    Link,
    Button,
    Switch,
    Modal,
    IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"
import {
    customerSendLoginRequest,
    managerSendLoginRequest,
    sendCodeToEmail
} from "../../api/userApi"
import { useDispatch } from "react-redux"
import { customerActions, managerActions } from "../../store"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"

const Login = () => {
    const [isCustomer, setIsCustomer] = useState(true)
    const [inputs, setInputs] = useState({ nameAccount: "", password: "" })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [email, setEmail] = useState("")
    const movieSlug = localStorage.getItem("movieSlug")
    const screeningId = localStorage.getItem("screeningId")
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
                    if (movieSlug && screeningId) {
                        navigate(`/booking/${movieSlug}/${screeningId}`)
                        localStorage.removeItem("movieSlug")
                        localStorage.removeItem("screeningId")
                    } else if (movieSlug) {
                        navigate(`/movie-details/${movieSlug}`)
                        localStorage.removeItem("movieSlug")
                    } else {
                        navigate("/")
                    }
                    toast.success(i18n.language === "en" ? data.message : t("login.toastSuccess"))
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
                    toast.success(i18n.language === "en" ? data.message : t("login.toastSuccess"))
                })
                .catch(err => console.error(err))
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await sendCodeToEmail({ email })
            if (res) {
                localStorage.setItem("userEmail", email)
                localStorage.setItem("userName", res.userName)
                toast.success(i18n.language === "en" ? res.message : t("verifyCode.sendEmailSuccess"))
                navigate("/login/forgot-password")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box className="auth__wrapper">
            <Helmet><title>{formatTitle(t("login.title"))}</title></Helmet>
            <Brand />

            <form className="auth__frm" onSubmit={handleSubmit} style={{ height: "430px", width: "400px" }}>
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
                    <Link className="forgot-password" onClick={() => {
                        if (isCustomer) {
                            setIsModalOpen(true)
                        } else {
                            toast.info(t("login.toastClickForgotPassword"))
                        }
                    }}>
                        {t("login.forgotPassword")}
                    </Link>
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
                        ":hover": { opacity: 0.8 }
                    }}>
                        <Typography>{t("register.btn2")}</Typography>
                    </Box>
                </Box>

                <Typography className="question-switch">
                    {t("login.question")} <Link onClick={() => navigate("/register")}>{t("login.switch")}</Link>
                </Typography>
            </form>

            {isModalOpen &&
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <form className="modal" style={{ width: 402 }} onSubmit={handleModalSubmit}>
                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <IconButton sx={{ p: 0 }} onClick={() => setIsModalOpen(false)}>
                                <CloseIcon sx={{ ":hover": { color: "#e50914" } }} />
                            </IconButton>
                        </Box>

                        <Typography textAlign={"justify"} mt={1} mb={1}>
                            {t("login.contentModal")} ({<span class="text-italic">{t("login.noteContentModal")}</span>})
                        </Typography>

                        <Box display={"flex"}>
                            <input
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "none",
                                    outline: "none",
                                    borderRadius: "4px",
                                    marginRight: "10px"
                                }}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("login.placeholderInputModal")}
                                required
                            />

                            <Button className="btn" type="submit" sx={{ m: "0 !important" }}>
                                <SendIcon />
                            </Button>
                        </Box>
                    </form>
                </Modal>
            }
        </Box>
    )
}

export default Login