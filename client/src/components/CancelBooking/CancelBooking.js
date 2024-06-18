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
import CloseIcon from "@mui/icons-material/Close"
import { comparePassword } from "../../api/userApi"
import { cancelBooking } from "../../api/bookingApi"
import { Helmet } from "react-helmet"
import "../../scss/App.scss"

const reasons = [
    "I don't want to watch this movie anymore",
    "I want to book more tickets",
    "I want to reduce the number of seats booked",
    "I want to see another day",
    "I want to watch it at another time that day",
    "I accidentally booked this movie ticket by mistake"
]

const CancelBooking = ({ title }) => {
    const [reason, setReason] = useState("")
    const [otherReason, setOtherReason] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [passwordAuth, setPasswordAuth] = useState("")
    const userId = localStorage.getItem("customerId")
    const bookingId = useParams().bookingId
    const refunds = localStorage.getItem("refunds")
    const compensationPercent = localStorage.getItem("compensationPercent")
    const navigate = useNavigate()

    const handleChangeReason = (e) => {
        const label = e.target.closest("label")
        const queryClass = ".css-1hbvpl3-MuiSvgIcon-root"
        const targetSvg = label.querySelector(queryClass)

        document.querySelectorAll(queryClass).forEach((option) => {
            option.classList.remove("active")
        })

        targetSvg.classList.add("active")
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

                alert("Request to cancel booking successfully! Please, wait for the system to process in 1-2 days.")
                navigate(`/customer/cancel-booking/${cancelBookingId}/detail`)
            } else {
                alert("Passwords do not match!!!")
                setIsModalOpen(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box className="wrapper">
            <Helmet><title>{title}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item" onClick={() => navigate("/cart")}>
                    Cart
                </Typography>
                <Typography className="breadcrumb__item">
                    Cancel Booking
                </Typography>
            </Box>

            <Box className="frm-wrapper" p={"20px 40px"}>
                <Typography variant="h5" component="h2" color={"#e50914"} marginBottom={2}>
                    Select the reason for canceling the movie ticket
                </Typography>

                <RadioGroup value={reason} onChange={handleChangeReason}>
                    {reasons.map((reasonItem, index) =>
                        <FormControlLabel
                            key={index} value={reasonItem} label={reasonItem} control={<Radio />}
                        />
                    )}
                    <FormControlLabel value={"Other"} label="Other" control={<Radio />} />
                </RadioGroup>

                <textarea
                    name="otherReason"
                    variant="standard"
                    margin="normal"
                    placeholder="Please enter other reason..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    required
                    disabled={reason !== "Other"}
                />

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Button className="btn" onClick={() => navigate("/cart")}>
                        Back To Cart
                    </Button>
                    <Button className="btn" onClick={() => setIsModalOpen(true)}>
                        Request To Cancel Booking
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
                                To submit a request to cancel a booking, you need to authenticate your password.
                                If your ticket cancellation request is approved, <span style={{ color: "#ff0000" }}>
                                    {localStorage.getItem("seatLength")} rating points will be deducted
                                </span> and <span style={{ color: "#ff0000" }}>
                                    the refund amount will be reduced by {100 - compensationPercent}%.
                                </span> That means you will receive <span style={{ fontWeight: 600 }}>
                                    {Number(refunds).toLocaleString("vi-VN")} VNĐ </span> back.
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
                                placeholder="Please password authentication..."
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
                                Authentication
                            </Button>
                        </form>
                    </Modal>
                }
            </Box>
        </Box>
    )
}

export default CancelBooking