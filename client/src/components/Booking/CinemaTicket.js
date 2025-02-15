import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import Loading from "../Loading/Loading"
import { getBookingDetail } from "../../api/bookingApi"
import { Box, Button, Typography } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import QrCode2Icon from "@mui/icons-material/QrCode2"
import { getEndTime, handleSeatArr } from "../../util"
import html2canvas from "html2canvas"
import { formatTitle } from "../../App"
import "../../scss/CinemaTicket.scss"
import "../../scss/App.scss"

const CinemaTicket = () => {
    const [booking, setBooking] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const bookingId = useParams().bookingId
    const navigate = useNavigate()
    const qrCodeRef = useRef(null)
    const { t } = useTranslation()

    useEffect(() => {
        setIsLoading(true)
        getBookingDetail(bookingId)
            .then((res) => setBooking(res.booking))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [bookingId])

    const handleSaveQRCode = async () => {
        const element = qrCodeRef.current
        if (!element) return

        try {
            const canvas = await html2canvas(element)
            const imgData = canvas.toDataURL("image/png")
            const link = document.createElement("a")

            link.href = imgData
            link.download = `qr_code_${bookingId}.png`
            link.click()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {booking && !isLoading ? <Box className="cinema-ticket__wrapper">
                <Helmet>
                    <title>{formatTitle(t("titlePage.movieTicket"))}</title>
                </Helmet>

                <Box className="cinema-ticket__border">
                    <img src={`${process.env.REACT_APP_API_URL}/img/cinema_ticket.png`} alt="cinema-ticket" />

                    <Box className="cinema-ticket__content">
                        <Typography variant="h3">{t("cinemaTicket.title")}</Typography>
                        <Typography>{t("cinemaTicket.customerName")}: <span>{booking.user.name}</span></Typography>
                        <Typography>{t("cinemaTicket.movie")}: <span>{booking.screening.movie.title}</span></Typography>
                        <Typography>{t("cinemaTicket.date")}: <span>{booking.screening.movieDate}</span></Typography>
                        <Box display={"flex"}>
                            <Typography marginRight={"40px"}>
                                {t("cinemaTicket.start")}: <span>{booking.screening.timeSlot}</span>
                            </Typography>
                            <Typography>{t("cinemaTicket.end")}: <span>
                                {getEndTime(booking.screening.timeSlot, booking.screening.movie.time)}
                            </span></Typography>
                        </Box>
                        <Typography>{t("cinemaTicket.seat")}: <span>
                            {booking.seats ? handleSeatArr(booking.seats) : t("unknown")}
                        </span></Typography>
                        <Typography>{t("cinemaTicket.screeningAt")}: {booking.screening.cinemaRoom
                            ? <span>
                                {booking.screening.cinemaRoom.roomNumber}-{booking.screening.cinemaRoom.cinema.name}
                            </span>
                            : t("unknown")}
                        </Typography>
                        <Typography>
                            {t("seatDiagram.unitPrice")}: <span>{booking.screening.price.toLocaleString("vi-VN")} VNĐ</span>
                        </Typography>
                        <Typography>{t("seatDiagram.quantity")}: <span>{booking.seats.length}</span></Typography>
                        <Typography>
                            {t("seatDiagram.totalMoney")}: <span>{booking.totalMoney.toLocaleString("vi-VN")} VNĐ</span>
                        </Typography>
                        <Typography>{t("cinemaTicket.bookingTime")}: <span>{booking.createdAt}</span></Typography>
                    </Box>

                    <Box className="cinema-ticket__img">
                        <img src={booking.qrCode} alt="QR Code" ref={qrCodeRef} />
                        <Typography>{t("cinemaTicket.qrCode").toUpperCase()}</Typography>

                        <img src={`${process.env.REACT_APP_API_URL}/img/cinema_decorate.png`} alt="cinema-decorate" />
                    </Box>
                </Box>

                <Box className="cinema-ticket__btn">
                    <Button className="btn" onClick={() => navigate("/cart")}>
                        <ShoppingCartIcon /><span>{t("cinemaTicket.goToCart")}</span>
                    </Button>
                    <Button className="btn" onClick={handleSaveQRCode}>
                        <QrCode2Icon /><span>{t("cinemaTicket.saveQRCode")}</span>
                    </Button>
                </Box>
            </Box> : <Loading />}
        </>
    )
}

export default CinemaTicket