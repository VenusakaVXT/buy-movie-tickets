import React, { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { Helmet } from "react-helmet"
import { getAllSeatsFromCinemaRoom } from "../../api/cinemaApi"
import { newBooking } from "../../api/bookingApi"
import Loading from "../Loading/Loading"
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined"
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined"
import { toast } from "react-toastify"
import { formatTitle } from "../../App"
import "../../scss/SeatDiagram.scss"
import "../../scss/App.scss"

const SeatDiagram = () => {
    const [synthesizeData, setSynthesizeData] = useState()
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const screeningId = useParams().screeningId
    const movieSlug = useParams().movieSlug
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    useEffect(() => {
        const handleBeforeUnload = () => localStorage.removeItem("seatBookeds")
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        getAllSeatsFromCinemaRoom(screeningId)
            .then((res) => setSynthesizeData(res.synthesizeData))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [screeningId])

    useEffect(() => setQuantity(document.querySelectorAll(".seat-choice").length), [synthesizeData])

    const sortedSeats = synthesizeData && synthesizeData.seats ? synthesizeData.seats.sort((x, y) => {
        if (x.rowSeat !== y.rowSeat) {
            return x.rowSeat.localeCompare(y.rowSeat)
        }

        return parseInt(x.seatNumber) - parseInt(y.seatNumber)
    }) : []

    const handleSeatClick = (event, seat) => {
        const seatTarget = event.target
        const seatId = seat._id

        if (!seatTarget.classList.contains("seat-booked")) {
            const seatBookeds = JSON.parse(localStorage.getItem("seatBookeds")) || []

            if (seatTarget.classList.contains("seat-choice")) {
                seatTarget.classList.remove("seat-choice")
                const index = seatBookeds.indexOf(seatId)
                if (index > -1) {
                    seatBookeds.splice(index, 1)
                }
            } else {
                seatTarget.classList.add("seat-choice")
                seatBookeds.push(seatId)
            }

            localStorage.setItem("seatBookeds", JSON.stringify(seatBookeds))
            setQuantity(seatBookeds.length)
        }
    }

    // const checkDistanceBetweenSelectedSeats = (seats) => {
    //     const seatsArr = seats.map(seatId => synthesizeData.seats.find(seat => seat._id === seatId))
    //     const rows = [...new Set(seatsArr.map(seat => seat.rowSeat))]

    //     for (const row of rows) {
    //         const rowSeats = synthesizeData.seats.filter(seat => seat.rowSeat === row)
    //         const selectedSeatNumbers = seatsArr.filter(seat => seat.rowSeat === row)
    //             .map(seat => parseInt(seat.seatNumber))

    //         for (let i = 0; i < rowSeats.length; i++) {
    //             if ((rowSeats[i].selected && selectedSeatNumbers.includes(parseInt(rowSeats[i].seatNumber) + 2)) ||
    //                 (rowSeats[i].selected && selectedSeatNumbers.includes(parseInt(rowSeats[i].seatNumber) - 2))) {
    //                 return false
    //             }
    //         }
    //     }

    //     return true
    // }

    // const isValidSeatSelection = (seats, selectedSeats) => {
    //     const bookedSeats = seats.filter(seat => seat.selected)
    //     for (const selectedSeat of selectedSeats) {
    //         const row = selectedSeat.rowSeat
    //         const seatNumber = parseInt(selectedSeat.seatNumber)
    //         for (const bookedSeat of bookedSeats) {
    //             if (bookedSeat.rowSeat === row) {
    //                 const bookedSeatNumber = parseInt(bookedSeat.seatNumber)
    //                 if (Math.abs(seatNumber - bookedSeatNumber) === 1) {
    //                     return false
    //                 }
    //             }
    //         }
    //     }

    //     return true
    // }

    const handleBookNowClick = async () => {
        const seats = JSON.parse(localStorage.getItem("seatBookeds")) || []
        const customerId = localStorage.getItem("customerId")

        if (!screeningId) {
            toast.error(t("seatDiagram.toastScreeningNotFound"))
            setIsLoading(false)
            return
        }

        if (seats.length === 0) {
            toast.info(t("seatDiagram.toastChooseSeat"))
            setIsLoading(false)
            return
        }

        if (!customerId) {
            toast.error(t("seatDiagram.toastCustomerNotFound"))
            setIsLoading(false)
            return
        }

        // const selectedSeats = synthesizeData.seats.filter(seat => seats.includes(seat._id))

        // if (!isValidSeatSelection(synthesizeData.seats, selectedSeats) 
        //     || !checkDistanceBetweenSelectedSeats(seats)) {
        //     toast.info("Do not place seats at least 1 seat away from selected seats.")
        //     setIsLoading(false)
        //     return
        // }

        try {
            const bookingData = await newBooking(screeningId, seats, customerId)
            const bookingId = bookingData.booking._id

            dispatch(customerActions.addBooking(bookingData.booking))
            dispatch(customerActions.setRatingPoints(seats.length * 5))
            navigate(`/booking/${bookingId}/detail`)
            toast.success(t("seatDiagram.toastSuccess"))

            localStorage.removeItem("seatBookeds")
        } catch (err) {
            console.error(err)
            toast.error(t("seatDiagram.toastError"))
        }
    }

    return (
        <>
            {synthesizeData && !isLoading ? <Box margin={"30px 92px"}>
                <Helmet>
                    <title>{formatTitle(t("titlePage.seatDiagram"))}</title>
                </Helmet>

                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        {t("header.home")}
                    </Typography>

                    <Typography className="breadcrumb__item" onClick={() => navigate(`/booking/${movieSlug}`)}>
                        {t("booking.allScreenings")}
                    </Typography>

                    <Typography className="breadcrumb__item disable">
                        {t(`movies.${movieSlug}`)}
                    </Typography>

                    <Typography className="breadcrumb__item">
                        {synthesizeData.roomNumber}-{synthesizeData.cinemaName}
                    </Typography>
                </Box>

                <Box className="seat-statistics">
                    <Typography className="textitem">
                        {t("seatDiagram.totalSeats")}: {synthesizeData.seats.length}
                    </Typography>

                    <Typography className="textitem">
                        {t("seatDiagram.seatsBooked")}: {synthesizeData.seats.filter(seat => seat.selected === true).length}
                    </Typography>

                    <Typography className="textitem">
                        {t("seatDiagram.seatsNotBooked")}: {synthesizeData.seats.filter(seat => seat.selected === false).length}
                    </Typography>
                </Box>

                <Box className="seat-diagram">
                    {sortedSeats.map((seat) => (
                        <div
                            key={seat._id}
                            className={`seat-item ${seat.selected === true ? "seat-booked" : ""}`}
                            onClick={(e) => {
                                setPrice(synthesizeData.price)
                                handleSeatClick(e, seat)
                            }}
                        >
                            {`${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`}
                        </div>
                    ))}
                </Box>

                <Box className="seat-caption">
                    <Box className="seat-caption__item">
                        <div className="seat-color not-booked"></div>:
                        <Typography className="text-caption">{t("seatDiagram.seatNotBooked")}</Typography>
                    </Box>

                    <Box className="seat-caption__item">
                        <div className="seat-color booked"></div>:
                        <Typography className="text-caption">{t("seatDiagram.seatBooked")}</Typography>
                    </Box>

                    <Box className="seat-caption__item">
                        <div className="seat-color choice"></div>:
                        <Typography className="text-caption">{t("seatDiagram.seatChoice")}</Typography>
                    </Box>
                </Box>

                <Box className="seat-fee">
                    <Box className="seat-unit-price">
                        <Typography fontSize={"1.5rem"}>{t("seatDiagram.unitPrice")}</Typography>
                        <Typography fontSize={"1.5rem"}>{price}</Typography>
                    </Box>

                    <ClearOutlinedIcon />

                    <Box className="seat-quantity">
                        <Typography fontSize={"1.5rem"}>{t("seatDiagram.quantity")}</Typography>
                        <Typography fontSize={"1.5rem"}>{quantity}</Typography>
                    </Box>

                    <DragHandleOutlinedIcon />

                    <Box className="total-money">
                        <Typography fontSize={"1.5rem"}>{t("seatDiagram.totalMoney")}</Typography>
                        <Typography fontSize={"1.5rem"}>{price * quantity}</Typography>
                    </Box>

                    <Button className="btn" fontSize={"1.5rem"} onClick={() => {
                        if (isCustomerLoggedIn) {
                            setIsLoading(true)
                            handleBookNowClick()
                        } else if (isManagerLoggedIn) {
                            toast.warn(t("seatDiagram.toastWarnStaff"))
                        } else {
                            toast.info(t("seatDiagram.toastInfoLogIn"))
                            navigate("/login")
                        }
                    }}>
                        {t("seatDiagram.bookNow")}
                    </Button>
                </Box>
            </Box> : <Loading />}
        </>
    )
}

export default SeatDiagram