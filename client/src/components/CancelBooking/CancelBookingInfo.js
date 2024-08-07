import React, { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Loading from "../Loading/Loading"
import { detailCancelBooking, restoreBooking } from "../../api/bookingApi"
import { getEndTime, handleSeatArr } from "../../util"
import { Helmet } from "react-helmet"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import RestoreIcon from "@mui/icons-material/Restore"
import ReplyIcon from "@mui/icons-material/Reply"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { formatTitle } from "../../App"
import "../../scss/CinemaTicket.scss"
import "../../scss/App.scss"

const CancelBookingInfo = () => {
    const [cancelBooking, setCancelBooking] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const cancelBookingId = useParams().id
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const rolePath = isCustomerLoggedIn ? "customer" : "manager"
    const navigate = useNavigate()
    const { t } = useTranslation()

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
                toast.success(t("restore.toastSuccess"))
                navigate("/cart")
            })
            .catch(() => toast.error(t("restore.toastFailed")))
    }

    return (
        <>
            {cancelBooking && !isLoading ?
                <Box className="wrapper">
                    <Helmet><title>{formatTitle(t("cancelBooking.cancelBookingDetail"))}</title></Helmet>

                    <Box className="breadcrumb" margin={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            {t("header.home")}
                        </Typography>
                        <Typography className="breadcrumb__item" onClick={() =>
                            navigate(`/${rolePath}/cancel-booking/list`)
                        }>
                            {t("header.lstCancelBooking")}
                        </Typography>
                        <Typography className="breadcrumb__item">
                            {t("cancelBooking.cancelBookingDetail")}
                        </Typography>
                    </Box>

                    <Box className="cinema-ticket__wrapper">
                        <Box className="cinema-ticket__border">
                            <img src={`${process.env.REACT_APP_API_URL}/img/cinema_ticket.png`} alt="cinema-ticket" />

                            <Box className="cinema-ticket__content" width={"100% !important"}>
                                <Typography variant="h3" mb={1}>{t("cancelBooking.cancelBookingDetail")}</Typography>
                                <Typography>
                                    {t("cinemaTicket.customerName")}: <span>{cancelBooking.user.name}</span>
                                </Typography>
                                <Typography>
                                    {t("cinemaTicket.movie")}: <span>{cancelBooking.booking.screening.movie.title}</span>
                                </Typography>

                                <Box className="flex-box">
                                    <Typography>
                                        {t("cinemaTicket.date")}: <span>{cancelBooking.booking.screening.movieDate}</span>
                                    </Typography>
                                    <Typography>
                                        {t("cinemaTicket.start")}: <span>{cancelBooking.booking.screening.timeSlot}</span>
                                    </Typography>
                                    <Typography>{t("cinemaTicket.end")}: <span>
                                        {getEndTime(
                                            cancelBooking.booking.screening.timeSlot,
                                            cancelBooking.booking.screening.movie.time
                                        )}
                                    </span>
                                    </Typography>
                                </Box>

                                <Box className="flex-box">
                                    <Typography>
                                        {t("cinemaTicket.seat")}: {cancelBooking.booking.seats
                                            ? <span>{handleSeatArr(cancelBooking.booking.seats)}</span>
                                            : t("unknown")}
                                    </Typography>
                                    <Typography>{t("cinemaTicket.screeningAt")}: {cancelBooking.booking.screening.cinemaRoom
                                        ? <span>
                                            {cancelBooking.booking.screening.cinemaRoom.roomNumber}
                                            -{cancelBooking.booking.screening.cinemaRoom.cinema.name}
                                        </span>
                                        : t("unknown")}
                                    </Typography>
                                </Box>

                                <Box className="flex-box">
                                    <Typography>
                                        {t("seatDiagram.unitPrice")}: <span>
                                            {cancelBooking.booking.screening.price.toLocaleString("vi-VN")} VNĐ
                                        </span>
                                    </Typography>
                                    <Typography>
                                        {t("seatDiagram.quantity")}: <span>{cancelBooking.booking.seats.length}</span>
                                    </Typography>
                                    <Typography>
                                        {t("seatDiagram.totalMoney")}: <span>
                                            {cancelBooking.booking.totalMoney.toLocaleString("vi-VN")} VNĐ
                                        </span>
                                    </Typography>
                                </Box>

                                <Typography>
                                    {t("cinemaTicket.bookingTime")}: <span>{cancelBooking.booking.createdAt}</span>
                                </Typography>
                                <Typography>{t("cancelBooking.reason")}: <span>{cancelBooking.reason}</span></Typography>
                                <Typography>{t("cancelBooking.refunds")}: <span>
                                    {cancelBooking.refunds.toLocaleString("vi-VN")} VNĐ
                                    ({t("cancelBooking.contentRefunds", { percent: cancelBooking.compensationPercent })})
                                </span></Typography>
                                <Typography>
                                    {t("cancelBooking.cancelTime")}: <span>{cancelBooking.createdAt}</span>
                                </Typography>
                                <Typography>{t("cancelBooking.status")}: {!cancelBooking.approveRequest
                                    ? <span>{t("cancelBooking.awaitApproval")} ({t("cancelBooking.waitCaption")})</span>
                                    : <span>{t("cancelBooking.approved")}</span>}
                                </Typography>
                            </Box>
                        </Box>

                        {isCustomerLoggedIn && <Box className="cinema-ticket__btn">
                            {!cancelBooking.approveRequest
                                ? <Button className="btn" onClick={handleRestoreBooking}>
                                    <RestoreIcon /><span>{t("cancelBooking.revoke")}</span>
                                </Button>
                                : <Button className="btn" onClick={() => navigate("/customer/cancel-booking/list")}>
                                    <ReplyIcon /><span>{t("cancelBooking.comeback")}</span>
                                </Button>
                            }
                            <Button className="btn" onClick={() => navigate("/support")}>
                                <SupportAgentIcon /><span>{t("cancelBooking.supportCounseling")}</span>
                            </Button>
                        </Box>}
                    </Box>
                </Box> : <Loading />}
        </>
    )
}

export default CancelBookingInfo