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
//import html2canvas from "html2canvas"
import { formatTitle } from "../../App"
import { Tooltip } from "react-tooltip"
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
        const link = document.createElement("a")
        link.href = booking.qrCode
        link.download = `qr_code_${bookingId}.png`
        link.click()

        // const element = qrCodeRef.current
        // if (!element) return

        // const originalBackground = element.style.backgroundColor
        // element.style.backgroundColor = "rgba(255,255,255,1)"

        // try {
        //     const canvas = await html2canvas(element, { useCORS: true })
        //     const imgData = canvas.toDataURL("image/png")
        //     const link = document.createElement("a")

        //     link.href = imgData
        //     link.download = `qr_code_${bookingId}.png`
        //     link.click()
        // } catch (err) {
        //     console.error(err)
        // } finally {
        //     element.style.backgroundColor = originalBackground
        // }
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
                        <Typography>{t("cinemaTicket.movie")}: <span>{booking.screening.movie.title}</span></Typography>
                        <Typography>{t("cinemaTicket.projectionTime")}: <span>
                            {booking.screening.movieDate}, {booking.screening.timeSlot}-{getEndTime(booking.screening.timeSlot, booking.screening.movie.time)}
                        </span>
                        </Typography>
                        <Typography>{t("cinemaTicket.screeningAt")}: {booking.screening.cinemaRoom
                            ? <span>{booking.screening.cinemaRoom.roomNumber}-{booking.screening.cinemaRoom.cinema.name}</span>
                            : t("unknown")}
                        </Typography>
                        <Typography>{t("cinemaTicket.seat")}: <span>
                            {booking.seats ? handleSeatArr(booking.seats) : t("unknown")}
                        </span>
                        </Typography>
                        <Typography>{t("cinemaTicket.totalSeatsMoney")}: <span>
                            {booking.screening.price.toLocaleString("vi-VN")} x {booking.seats.length} = {(
                                booking.screening.price * booking.seats.length
                            ).toLocaleString("vi-VN")} VNĐ
                        </span>
                        </Typography>
                        <Typography>
                            {t("cinemaTicket.waterCornCombos")}: {booking.waterCornCombos && booking.waterCornCombos.length > 0
                                ? booking.waterCornCombos.length > 1
                                    ? <>
                                        <span>
                                            {booking.waterCornCombos[0].quantity} {booking.waterCornCombos[0].id.comboName} ({booking.waterCornCombos[0].id.price.toLocaleString("vi-VN")}),
                                        </span>
                                        <span data-tooltip-id="combo-tooltip" data-tooltip-content={
                                            booking.waterCornCombos.slice(1).map((combo) =>
                                                `${combo.quantity} ${combo.id.comboName} (${combo.id.price.toLocaleString("vi-VN")})`
                                            ).join("\n")
                                        }> ...
                                        </span>
                                        <Tooltip
                                            id="combo-tooltip"
                                            place="top"
                                            effect="solid"
                                            style={{
                                                background: "rgba(0, 0, 0, 0.95)",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                whiteSpace: "pre-line",
                                                zIndex: "9999"
                                            }}
                                        />
                                    </>
                                    : <span>
                                        {booking.waterCornCombos[0].quantity} {booking.waterCornCombos[0].id.comboName} ({booking.waterCornCombos[0].id.price.toLocaleString("vi-VN")})
                                    </span>
                                : <span>-/-</span>}
                        </Typography>
                        <Typography>
                            {t("cinemaTicket.waterCornCombosMoney")}: {booking.waterCornCombos && booking.waterCornCombos.length > 0
                                ? <span>
                                    {booking.waterCornCombos
                                        .reduce((total, combo) => total + (combo.quantity * combo.id.price), 0)
                                        .toLocaleString("vi-VN")} VNĐ
                                </span>
                                : <span>0 VNĐ</span>}
                        </Typography>
                        <Typography>{t("cinemaTicket.voucherId")}: {booking.promotionProgram && booking.promotionProgram.discountCode
                            ? <span>
                                {booking.promotionProgram.discountCode} ({t("cinemaTicket.reduce")} {booking.promotionProgram.percentReduction}%{
                                    booking.amountDecreases && `, -${booking.amountDecreases.toLocaleString("vi-VN")}VNĐ`
                                })
                            </span>
                            : <span>-/-</span>}
                        </Typography>
                        <Typography>
                            {t("seatDiagram.totalMoney")}: <span>{booking.totalMoney.toLocaleString("vi-VN")} VNĐ</span>
                        </Typography>
                        <Typography>{t("cinemaTicket.bookingTime")}: <span>{booking.createdAt}</span></Typography>
                    </Box>

                    <Box className="cinema-ticket__img">
                        <img src={booking.qrCode} alt="QR Code" ref={qrCodeRef} crossOrigin="anonymous" />
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