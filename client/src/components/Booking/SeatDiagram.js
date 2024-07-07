import React, { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { Helmet } from "react-helmet"
import { getAllSeatsFromCinemaRoom } from "../../api/cinemaApi"
import { newBooking } from "../../api/bookingApi"
import Loading from "../Loading/Loading"
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined"
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined"
import { toast } from "react-toastify"
import "../../scss/SeatDiagram.scss"
import "../../scss/App.scss"

const SeatDiagram = ({ title }) => {
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

    const handleBookNowClick = async () => {
        const seats = JSON.parse(localStorage.getItem("seatBookeds")) || []
        const customerId = localStorage.getItem("customerId")

        if (!screeningId) {
            return toast.error("Screening not found...")
        }

        if (seats.length === 0) {
            return toast.info("Please choose your seat before booking!!!")
        }

        if (!customerId) {
            return toast.error("Customer not found...")
        }

        try {
            const bookingData = await newBooking(screeningId, seats, customerId)
            const bookingId = bookingData.booking._id

            dispatch(customerActions.addBooking(bookingData.booking))
            dispatch(customerActions.setRatingPoints(seats.length * 5))
            navigate(`/booking/${bookingId}/detail`)
            toast.success("Booked ticket successfully...")

            localStorage.removeItem("seatBookeds")
        } catch (err) {
            toast.error("Tickets cannot be booked")
        }
    }

    return (
        <>
            {synthesizeData && !isLoading ? <Box margin={"30px 92px"}>
                <Helmet>
                    <title>{title}</title>
                </Helmet>

                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        Home
                    </Typography>

                    <Typography className="breadcrumb__item" onClick={() => navigate(`/booking/${movieSlug}`)}>
                        All Screenings
                    </Typography>

                    <Typography className="breadcrumb__item disable">
                        {synthesizeData.movieTitle}
                    </Typography>

                    <Typography className="breadcrumb__item">
                        {synthesizeData.roomNumber}-{synthesizeData.cinemaName}
                    </Typography>
                </Box>

                <Box className="seat-statistics">
                    <Typography className="textitem">
                        Total seats: {synthesizeData.seats.length}
                    </Typography>

                    <Typography className="textitem">
                        Seats booked: {synthesizeData.seats.filter(seat => seat.selected === true).length}
                    </Typography>

                    <Typography className="textitem">
                        Seats not booked: {synthesizeData.seats.filter(seat => seat.selected === false).length}
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
                        <Typography className="text-caption">Seat not booked</Typography>
                    </Box>

                    <Box className="seat-caption__item">
                        <div className="seat-color booked"></div>:
                        <Typography className="text-caption">Seat booked</Typography>
                    </Box>

                    <Box className="seat-caption__item">
                        <div className="seat-color choice"></div>:
                        <Typography className="text-caption">Seat your choice</Typography>
                    </Box>
                </Box>

                <Box className="seat-fee">
                    <Box className="seat-unit-price">
                        <Typography fontSize={"1.5rem"}>Unit Price</Typography>
                        <Typography fontSize={"1.5rem"}>{price}</Typography>
                    </Box>

                    <ClearOutlinedIcon />

                    <Box className="seat-quantity">
                        <Typography fontSize={"1.5rem"}>Quantity</Typography>
                        <Typography fontSize={"1.5rem"}>{quantity}</Typography>
                    </Box>

                    <DragHandleOutlinedIcon />

                    <Box className="total-money">
                        <Typography fontSize={"1.5rem"}>Total money</Typography>
                        <Typography fontSize={"1.5rem"}>{price * quantity}</Typography>
                    </Box>

                    <Button className="btn" fontSize={"1.5rem"} onClick={() => {
                        if (isCustomerLoggedIn) {
                            setIsLoading(true)
                            handleBookNowClick()
                        } else if (isManagerLoggedIn) {
                            toast.warn("You are using a staff account that is not used to book tickets")
                        } else {
                            toast.info("You need to log in to be able to book tickets")
                            navigate("/customer/login")
                        }
                    }}>
                        Book Now
                    </Button>
                </Box>
            </Box> : <Loading />}
        </>
    )
}

export default SeatDiagram