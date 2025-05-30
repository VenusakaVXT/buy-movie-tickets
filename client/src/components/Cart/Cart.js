import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { getBookingsFromUser, userDeleteBooking } from "../../api/bookingApi"
import { handleSeatArr } from "../../util"
import Loading from "../Loading/Loading"
import DetailsIcon from "@mui/icons-material/Details"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import { Tooltip } from "react-tooltip"
import { calculateDaysBetween } from "../../util"
import CancelSendIcon from "@mui/icons-material/CancelScheduleSend"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"
import { useDispatch } from "react-redux"
import { customerActions } from "../../store"
import DeleteIcon from "@mui/icons-material/Delete"
import "../../scss/Cart.scss"
import "../../scss/App.scss"

const hoverIconStyle = { ":hover": { cursor: "pointer", color: "#e50914" } }

const Cart = () => {
    const [bookings, setBookings] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const userId = localStorage.getItem("customerId")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        setIsLoading(true)
        getBookingsFromUser(userId)
            .then((res) => setBookings(res.bookings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [userId])

    const handleUserDeleteBooking = async (bookingId) => {
        try {
            const res = await userDeleteBooking(userId, bookingId)
            if (res.success) {
                setBookings((prev) => prev.filter((booking) => booking._id !== bookingId))
                dispatch(customerActions.removeBooking(bookingId))
                toast.success(t("cart.toastDeleteSuccess"))
            } else {
                console.error(res.message)
                toast.error(t("cart.toastDeleteFailed"))
            }
        } catch (error) {
            console.error("Error deleting booking:", error)
            toast.error(t("cart.toastDeleteFailed"))
        }
    }

    return (
        <>
            <Helmet><title>{formatTitle(t("cart.title"))}</title></Helmet>
            {bookings && !isLoading ? <Box className="cart__wrapper">
                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        {t("header.home")}
                    </Typography>
                    <Typography className="breadcrumb__item">{t("cart.title")}</Typography>
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
                                    {t(`movies.${booking.screening.movie.slug}`)}
                                </Typography>

                                <ListItemText sx={{ color: "#ccc", fontStyle: "italic" }}>
                                    {new Date(booking.screening.movieDate) < new Date() ? t("cart.passReleaseDate")
                                        : booking.screening.movieDate}
                                </ListItemText>
                            </Box>

                            <Box className="col2">
                                <Typography>{t("cart.seatNumber")}</Typography>
                                <ListItemText sx={{ color: "#ccc", fontStyle: "italic" }}>
                                    {booking.seats ? handleSeatArr(booking.seats) : t("unknown")}
                                </ListItemText>
                            </Box>

                            <Box className="col3">
                                <Typography>{t("cart.priceTicket")}</Typography>
                                <ListItemText sx={{ color: "#ccc", fontStyle: "italic" }}>
                                    {booking.totalMoney.toLocaleString("vi-VN")} VNĐ
                                </ListItemText>
                            </Box>

                            {booking.cancelled ?
                                <CancelSendIcon
                                    sx={hoverIconStyle}
                                    data-tooltip-content={t("cart.waitCancel")}
                                    data-tooltip-id="iconPendingCancellation"
                                    onClick={() => navigate("/customer/cancel-booking/list")}
                                /> :
                                <Box display={"flex"} flexDirection={"column"}>
                                    <DetailsIcon
                                        sx={{ marginBottom: "4px", ...hoverIconStyle }}
                                        data-tooltip-content={t("cart.viewDetails")}
                                        data-tooltip-id="cinemaTicketDetails"
                                        onClick={() => navigate(`/booking/${booking._id}/detail`)}
                                    />

                                    {new Date(booking.screening.movieDate) < new Date()
                                        && <DeleteIcon
                                            sx={hoverIconStyle}
                                            data-tooltip-content={t("cart.removeMovieTicket")}
                                            data-tooltip-id="removeMovieTicketIcon"
                                            onClick={() => handleUserDeleteBooking(booking._id)}
                                        />
                                    }

                                    {calculateDaysBetween(booking.screening.movieDate, booking.createdAt) >= 3 &&
                                        <EventBusyIcon
                                            sx={{ marginTop: "4px", ...hoverIconStyle }}
                                            data-tooltip-content={t("cart.cancelBooking")}
                                            data-tooltip-id="cancelBookingIcon"
                                            onClick={() => {
                                                const percent = [90, 80, 70]
                                                const dayNum = calculateDaysBetween(
                                                    booking.screening.movieDate,
                                                    booking.createdAt
                                                )
                                                const seatsLength = booking.seats.length
                                                const totalSeatsMoney = seatsLength * booking.screening.price
                                                const waterCornMoney = booking.totalMoney - totalSeatsMoney

                                                localStorage.setItem("ratingPointsDeducted", seatsLength * 5)

                                                if (dayNum >= 7) {
                                                    localStorage.setItem("compensationPercent", percent[0])
                                                    localStorage.setItem("refunds", (totalSeatsMoney * (percent[0] / 100)) + waterCornMoney)
                                                } else if (dayNum >= 5 && dayNum < 7) {
                                                    localStorage.setItem("compensationPercent", percent[1])
                                                    localStorage.setItem("refunds", (totalSeatsMoney * (percent[1] / 100)) + waterCornMoney)
                                                } else if (dayNum >= 3 && dayNum < 5) {
                                                    localStorage.setItem("compensationPercent", percent[2])
                                                    localStorage.setItem("refunds", (totalSeatsMoney * (percent[2] / 100)) + waterCornMoney)
                                                } else {
                                                    toast.error(t("cart.toastCancelBooking"))
                                                }

                                                navigate(`/customer/cancel-booking/${booking._id}`)
                                            }}
                                        />}
                                </Box>
                            }

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

                            <Tooltip
                                id="removeMovieTicketIcon"
                                place="top"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />
                        </ListItem>
                    )) : <NoDataComponent content={t("cart.noBooking")} />}
                </List>
            </Box> : <Loading />}
        </>
    )
}

export default Cart