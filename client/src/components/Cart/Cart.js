import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { getBookingsFromUser } from "../../api/bookingApi"
import { handleSeatArr } from "../../util"
import Loading from "../Loading/Loading"
import DetailsIcon from "@mui/icons-material/Details"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import { Tooltip } from "react-tooltip"
import { calculateDaysBetween } from "../../util"
import CancelSendIcon from "@mui/icons-material/CancelScheduleSend"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import "../../scss/Cart.scss"
import "../../scss/App.scss"

const Cart = () => {
    const [bookings, setBookings] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)

        getBookingsFromUser()
            .then((res) => setBookings(res.bookings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <>
            {bookings && !isLoading ? <Box className="cart__wrapper">
                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        Home
                    </Typography>
                    <Typography className="breadcrumb__item">Cart</Typography>
                </Box>

                <List className="lst-booking" sx={{ mb: bookings.length < 3 ? 17 : 0 }}>
                    {bookings.length !== 0 ? bookings.map((booking) => (
                        <ListItem key={booking._id} className="booking-item">
                            <img
                                src={`https://img.youtube.com/vi/${booking.screening.movie.trailerId}/maxresdefault.jpg`}
                                alt={booking.screening.movie.slug}
                            />

                            <Box className="col1">
                                <Typography className="link" onClick={() =>
                                    navigate(`/movie-details/${booking.screening.movie.slug}`)
                                }>
                                    {booking.screening.movie.title}
                                </Typography>

                                <ListItemText>{booking.screening.movieDate}</ListItemText>
                            </Box>

                            <Box className="col2">
                                <Typography>Seat number:</Typography>
                                <ListItemText>{booking.seats ? handleSeatArr(booking.seats) : "Unknown"}</ListItemText>
                            </Box>

                            <Box className="col3">
                                <Typography>Price ticket:</Typography>
                                <ListItemText>{booking.totalMoney.toLocaleString("vi-VN")} VNĐ</ListItemText>
                            </Box>

                            {booking.cancelled ?
                                <CancelSendIcon
                                    sx={{
                                        ":hover": {
                                            cursor: "pointer",
                                            color: "#e50914"
                                        }
                                    }}
                                    data-tooltip-content="This movie screening has been canceled and is awaiting approval"
                                    data-tooltip-id="iconPendingCancellation"
                                    onClick={() => navigate("/customer/cancel-booking/list")}
                                /> :
                                <Box display={"flex"} flexDirection={"column"}>
                                    <DetailsIcon
                                        sx={{
                                            marginBottom: "4px",
                                            ":hover": {
                                                cursor: "pointer",
                                                color: "#e50914"
                                            }
                                        }}
                                        data-tooltip-content="View Details"
                                        data-tooltip-id="cinemaTicketDetails"
                                        onClick={() => navigate(`/booking/${booking._id}/detail`)}
                                    />

                                    {calculateDaysBetween(booking.screening.movieDate, booking.createdAt) >= 3 &&
                                        <EventBusyIcon
                                            sx={{
                                                marginTop: "4px",
                                                ":hover": {
                                                    cursor: "pointer",
                                                    color: "#e50914"
                                                }
                                            }}
                                            data-tooltip-content="Cancel Booking"
                                            data-tooltip-id="cancelBookingIcon"
                                            onClick={() => {
                                                const percent = [90, 80, 70]
                                                const dayNum = calculateDaysBetween(
                                                    booking.screening.movieDate,
                                                    booking.createdAt
                                                )

                                                localStorage.setItem("seatLength", booking.seats.length * 5)

                                                if (dayNum >= 7) {
                                                    localStorage.setItem("compensationPercent", percent[0])
                                                    localStorage.setItem("refunds", booking.totalMoney * (percent[0] / 100))
                                                } else if (dayNum >= 5 && dayNum < 7) {
                                                    localStorage.setItem("compensationPercent", percent[1])
                                                    localStorage.setItem("refunds", booking.totalMoney * (percent[1] / 100))
                                                } else if (dayNum >= 3 && dayNum < 5) {
                                                    localStorage.setItem("compensationPercent", percent[2])
                                                    localStorage.setItem("refunds", booking.totalMoney * (percent[2] / 100))
                                                } else {
                                                    alert("Conditions are not met to return tickets")
                                                }

                                                navigate(`/customer/cancel-booking/${booking._id}`)
                                            }}
                                        />}
                                </Box>}

                            <Tooltip
                                id="cinemaTicketDetails"
                                place="top"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />

                            <Tooltip
                                id="cancelBookingIcon"
                                place="top"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />

                            <Tooltip
                                id="iconPendingCancellation"
                                place="top"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />
                        </ListItem>
                    )) : <NoDataComponent content={"You haven't booked any tickets yet"} />}
                </List>
            </Box> : <Loading />}
        </>
    )
}

export default Cart