import React, { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../Loading/Loading"
import { detailCancelBooking, restoreBooking } from "../../api/bookingApi"
import { getEndTime, handleSeatArr } from "../../util"
import { Helmet } from "react-helmet"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import RestoreIcon from "@mui/icons-material/Restore"
import ReplyIcon from "@mui/icons-material/Reply"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import "../../scss/CinemaTicket.scss"
import "../../scss/App.scss"

const CancelBookingInfo = ({ title }) => {
    const [cancelBooking, setCancelBooking] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const cancelBookingId = useParams().id
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const rolePath = isCustomerLoggedIn ? "customer" : "manager"
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)

        detailCancelBooking(cancelBookingId)
            .then((res) => setCancelBooking(res.cancelBooking))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [cancelBookingId])

    const handleRestoreBooking = () => {
        restoreBooking(cancelBookingId)
            .then(() => {
                toast.success("Restore successfully...")
                navigate("/cart")
            })
            .catch(() => toast.error("Restore failed..."))
    }

    return (
        <>
            {cancelBooking && !isLoading ?
                <Box className="wrapper">
                    <Box className="breadcrumb" margin={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            Home
                        </Typography>
                        <Typography className="breadcrumb__item" onClick={() =>
                            navigate(`/${rolePath}/cancel-booking/list`)
                        }>
                            List Cancel Booking
                        </Typography>
                        <Typography className="breadcrumb__item">
                            Cancel Booking Detail
                        </Typography>
                    </Box>

                    <Box className="cinema-ticket__wrapper">
                        <Helmet><title>{title}</title></Helmet>

                        <Box className="cinema-ticket__border">
                            <img src={`${process.env.REACT_APP_API_URL}/img/cinema_ticket.png`} alt="cinema-ticket" />

                            <Box className="cinema-ticket__content" width={"100% !important"}>
                                <Typography variant="h3" mb={1}>Cancel Booking Detail</Typography>

                                <Typography>Customer name: <span>{cancelBooking.user.name}</span></Typography>
                                <Typography>Movie: <span>
                                    {cancelBooking.booking.screening.movie.title}</span>
                                </Typography>

                                <Box className="flex-box">
                                    <Typography>
                                        Date: <span>{cancelBooking.booking.screening.movieDate}</span>
                                    </Typography>
                                    <Typography>
                                        Start: <span>{cancelBooking.booking.screening.timeSlot}</span>
                                    </Typography>
                                    <Typography>End: <span>
                                        {getEndTime(
                                            cancelBooking.booking.screening.timeSlot,
                                            cancelBooking.booking.screening.movie.time
                                        )}
                                    </span>
                                    </Typography>
                                </Box>

                                <Box className="flex-box">
                                    <Typography>
                                        Seat: {cancelBooking.booking.seats ? <span>
                                            {handleSeatArr(cancelBooking.booking.seats)}
                                        </span> : "Unknown"}
                                    </Typography>
                                    <Typography>Screening at: {cancelBooking.booking.screening.cinemaRoom
                                        ? <span>
                                            {cancelBooking.booking.screening.cinemaRoom.roomNumber}
                                            -{cancelBooking.booking.screening.cinemaRoom.cinema.name}
                                        </span> : "Unknown"}
                                    </Typography>
                                </Box>

                                <Box className="flex-box">
                                    <Typography>
                                        Unit price: <span>
                                            {cancelBooking.booking.screening.price.toLocaleString("vi-VN")} VNĐ
                                        </span>
                                    </Typography>
                                    <Typography>
                                        Seat quantity: <span>{cancelBooking.booking.seats.length}</span>
                                    </Typography>
                                    <Typography>
                                        Total money: <span>
                                            {cancelBooking.booking.totalMoney.toLocaleString("vi-VN")} VNĐ
                                        </span>
                                    </Typography>
                                </Box>

                                <Typography>Booking time: <span>{cancelBooking.booking.createdAt}</span></Typography>
                                <Typography>Reason: <span>{cancelBooking.reason}</span></Typography>
                                <Typography>Refunds: <span>
                                    {cancelBooking.refunds.toLocaleString("vi-VN")} VNĐ
                                    (You get {cancelBooking.compensationPercent}
                                    % refund of total ticket booking amount)
                                </span></Typography>
                                <Typography>Cancellation time: <span>{cancelBooking.createdAt}</span></Typography>
                                <Typography>Status:
                                    {!cancelBooking.approveRequest
                                        ? <span> Awaiting approval (Waiting time may take 1-2 days)</span>
                                        : <span> Approved</span>}
                                </Typography>
                            </Box>
                        </Box>

                        {isCustomerLoggedIn && <Box className="cinema-ticket__btn">
                            {!cancelBooking.approveRequest
                                ? <Button className="btn" onClick={handleRestoreBooking}>
                                    <RestoreIcon /><span>Revoke Ticket Cancellation</span>
                                </Button>
                                : <Button className="btn" onClick={() => navigate("/customer/cancel-booking/list")}>
                                    <ReplyIcon /><span>Come Back</span>
                                </Button>
                            }
                            <Button className="btn" onClick={() => navigate("/support")}>
                                <SupportAgentIcon /><span>Support Counseling</span>
                            </Button>
                        </Box>}
                    </Box>
                </Box> : <Loading />}
        </>
    )
}

export default CancelBookingInfo