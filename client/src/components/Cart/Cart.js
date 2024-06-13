import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { getBookingsFromUser } from "../../api/bookingApi"
import { handleSeatArr } from "../../util"
import Loading from "../Loading/Loading"
import DetailsIcon from "@mui/icons-material/Details"
import { Tooltip } from "react-tooltip"
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

                <List className="lst-booking">
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
                                <ListItemText>{handleSeatArr(booking.seats)}</ListItemText>
                            </Box>

                            <Box className="col3">
                                <Typography>Price ticket:</Typography>
                                <ListItemText>{booking.totalMoney.toLocaleString("vi-VN")} VNĐ</ListItemText>
                            </Box>

                            <DetailsIcon
                                sx={{
                                    ":hover": {
                                        cursor: "pointer",
                                        color: "#e50914"
                                    }
                                }}
                                data-tooltip-content="View Details"
                                data-tooltip-id="cinemaTicketDetails"
                                onClick={() => navigate(`/booking/${booking._id}/detail`)}
                            />

                            <Tooltip
                                id="cinemaTicketDetails"
                                place="top"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />
                        </ListItem>
                    )) :
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                            <img
                                src={`${process.env.REACT_APP_API_URL}/img/astronaut_with_magnifying_glass.png`}
                                width={"30%"}
                                height={"60%"}
                                alt="Not found"
                            />
                            <Typography variant="h5" color={"#2d2d2e"}>
                                You haven't booked any tickets yet
                            </Typography>
                        </Box>}
                </List>
            </Box> : <Loading />}
        </>
    )
}

export default Cart