import React, { useState } from "react"
import {
    Box,
    Typography,
    FormControlLabel,
    RadioGroup,
    Radio,
    Button,
    Modal,
    IconButton,
    Avatar
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CloseIcon from "@mui/icons-material/Close"
import { comparePassword } from "../../api/userApi"
import { cancelBooking } from "../../api/bookingApi"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"
import { toast } from "react-toastify"
import "../../scss/App.scss"

const CancelBooking = () => {
    const [reason, setReason] = useState("")
    const [otherReason, setOtherReason] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [passwordAuth, setPasswordAuth] = useState("")
    const userId = localStorage.getItem("customerId")
    const bookingId = useParams().bookingId
    const refunds = localStorage.getItem("refunds")
    const compensationPercent = localStorage.getItem("compensationPercent")
    const navigate = useNavigate()
    const { t } = useTranslation()

    const reasons = [
        t("cancelBooking.reason1"),
        t("cancelBooking.reason2"),
        t("cancelBooking.reason3"),
        t("cancelBooking.reason4"),
        t("cancelBooking.reason5"),
        t("cancelBooking.reason6")
    ]

    const handleChangeReason = (e) => {
        const label = e.target.closest("label")
        const queryClass = ".radio-btn .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium"
        const targetSvgs = label.querySelectorAll(queryClass)

        document.querySelectorAll(queryClass).forEach((option) => {
            option.classList.remove("active")
        })

        targetSvgs.forEach(targetSvg => targetSvg.classList.add("active"))
        setReason(e.target.value)
    }

    const handleCancelBooking = async (e) => {
        e.preventDefault()
        try {
            const res = await comparePassword(userId, passwordAuth)
            const match = res.match

            if (match) {
                const cancelBookingData = await cancelBooking({
                    userId,
                    bookingId,
                    reason: reason !== "Other" ? reason : otherReason,
                    refunds: Number(refunds),
                    compensationPercent: Number(compensationPercent)
                })
                const cancelBookingId = cancelBookingData.cancelBooking._id

                alert(t("cancelBooking.alert"))
                navigate(`/customer/cancel-booking/${cancelBookingId}/detail`)
            } else {
                toast.error(t("register.toastError1"))
                setIsModalOpen(false)
            }
        } catch {
            toast.error(t("cancelBooking.toastError"))
        }
    }

    return (
        <Box className="wrapper">
            <Helmet><title>{formatTitle(t("titlePage.reasonCancelBooking"))}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                <Typography className="breadcrumb__item" onClick={() => navigate("/cart")}>
                    {t("cart.title")}
                </Typography>
                <Typography className="breadcrumb__item">
                    {t("cancelBooking.title")}
                </Typography>
            </Box>

            <Box className="frm-wrapper" p={"20px 40px"}>
                <Typography variant="h5" component="h2" color={"#e50914"} marginBottom={2}>
                    {t("cancelBooking.selectReason")}
                </Typography>

                <RadioGroup value={reason} onChange={handleChangeReason}>
                    {reasons.map((reasonItem, index) =>
                        <FormControlLabel
                            key={index} value={reasonItem} label={reasonItem} control={<Radio className="radio-btn" />}
                        />
                    )}
                    <FormControlLabel
                        value={"Other"} label={t("cancelBooking.other")} control={<Radio className="radio-btn" />}
                    />
                </RadioGroup>

                <textarea
                    name="otherReason"
                    variant="standard"
                    margin="normal"
                    placeholder={t("cancelBooking.placeholderReason")}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    required
                    disabled={reason !== "Other"}
                />

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Button className="btn" onClick={() => navigate("/cart")}>
                        {t("cancelBooking.backToCart")}
                    </Button>
                    <Button className="btn" onClick={() => {
                        if (reason === "") {
                            toast.warn(t("cancelBooking.toastWarnSelectReason"))
                        } else if (reason === "Other" && otherReason.trim() === "") {
                            toast.warn(t("cancelBooking.toastWarnSelectOther"))
                        } else {
                            setIsModalOpen(true)
                        }
                    }}>
                        {t("cancelBooking.requestBtn")}
                    </Button>
                </Box>

                {isModalOpen &&
                    <Modal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <form className="modal" style={{ width: 428 }} onSubmit={handleCancelBooking}>
                            <Box display={"flex"} justifyContent={"flex-end"}>
                                <IconButton sx={{ p: 0 }} onClick={() => setIsModalOpen(false)}>
                                    <CloseIcon sx={{ ":hover": { color: "#e50914" } }} />
                                </IconButton>
                            </Box>

                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                <Avatar sx={{ mr: 1 }} />
                                <Typography>{localStorage.getItem("customerName")}</Typography>
                            </Box>

                            <Typography textAlign={"justify"} m={"8px 0"}>
                                {t("cancelBooking.modalContent1")}
                                <span style={{ color: "#ff0000" }}>{t("cancelBooking.modalContent2",
                                    { ratingPoints: localStorage.getItem("ratingPointsDeducted") })}
                                </span>
                                {t("and")}
                                <span style={{ color: "#ff0000" }}>
                                    {t("cancelBooking.modalContent3", { percent: 100 - compensationPercent })}
                                </span>
                                {t("cancelBooking.modalContent4")}
                                <span style={{ fontWeight: 600 }}>{Number(refunds).toLocaleString("vi-VN")} VNĐ.</span>
                            </Typography>

                            <input
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "none",
                                    outline: "none",
                                    borderRadius: "4px",
                                    marginBottom: "10px"
                                }}
                                type="password"
                                value={passwordAuth}
                                onChange={(e) => setPasswordAuth(e.target.value)}
                                placeholder={t("cancelBooking.placeholderPassword")}
                            />

                            <Button
                                className="btn lowercase"
                                type="submit"
                                sx={{
                                    width: "100%",
                                    m: "0 !important",
                                    ":hover": { transform: "none" }
                                }}
                            >
                                {t("cancelBooking.authBtn")}
                            </Button>
                        </form>
                    </Modal>
                }
            </Box>
        </Box>
    )
}

export default CancelBooking