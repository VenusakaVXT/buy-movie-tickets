import React, { useEffect, useState } from "react"
import { Box, Typography, Button, Autocomplete, TextField } from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { Helmet } from "react-helmet"
import { getAllSeatsFromCinemaRoom } from "../../api/cinemaApi"
import { newBooking } from "../../api/bookingApi"
import Loading from "../Loading/Loading"
import { toast } from "react-toastify"
import { formatTitle, socket } from "../../App"
import "../../scss/SeatDiagram.scss"
import "../../scss/App.scss"
import { getPromotionProgramsByCinema } from "../../api/promotionProgramApi"
import WaterCornCombo from "../WaterCornCombo/WaterCornCombo"
import { highlightOption } from "../../util"

const SeatDiagram = () => {
    const [synthesizeData, setSynthesizeData] = useState()
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [isOpenCombo, setIsOpenCombo] = useState(false)
    const [promotionPrograms, setPromotionPrograms] = useState([])
    const [selectedPromotion, setSelectedPromotion] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [amountDecreases, setAmountDecreases] = useState(0)
    const [totalMoney, setTotalMoney] = useState(0)
    const [holdSeats, setHoldSeats] = useState({}) // { seatId: { userId, expireAt } }
    const [countdown, setCountdown] = useState(300) // 5 minutes = 300 seconds
    const customerId = localStorage.getItem("customerId")
    const waterCornComboMoney = localStorage.getItem("waterCornComboMoney")
    const navigate = useNavigate()
    const screeningId = useParams().screeningId
    const movieSlug = useParams().movieSlug
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const dispatch = useDispatch()
    const location = useLocation()
    const { t } = useTranslation()

    const handleRemoveLocalStorage = () => {
        localStorage.removeItem("seatBookeds")
        localStorage.removeItem("waterCornCombos")
        localStorage.removeItem("waterCornComboMoney")
    }

    useEffect(() => handleRemoveLocalStorage(), [location.pathname])

    useEffect(() => {
        const handleBeforeUnload = () => handleRemoveLocalStorage()
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

    useEffect(() => {
        setQuantity(document.querySelectorAll(".seat-choice").length)
        synthesizeData && getPromotionProgramsByCinema(synthesizeData.cinemaId)
            .then((res) => setPromotionPrograms(res.promotionPrograms))
            .catch((err) => console.error(err))
    }, [synthesizeData])

    useEffect(() => {
        const calculateDiscountAndTotal = () => {
            const seatMoney = price * quantity
            const comboMoney = parseInt(waterCornComboMoney || 0)
            let total = seatMoney + comboMoney
            let discount = 0

            if (selectedPromotion) {
                const discountAmount = (total * selectedPromotion.percentReduction) / 100
                discount = Math.min(discountAmount, selectedPromotion.maxMoneyAmount)
                total -= discount
            }

            setAmountDecreases(discount)
            setTotalMoney(total)
        }

        calculateDiscountAndTotal()
    }, [price, quantity, waterCornComboMoney, selectedPromotion])

    useEffect(() => {
        if (!synthesizeData || !screeningId) return

        socket.emit("joinScreeningRoom", { screeningId })

        socket.on("seatHoldUpdate", ({ seatId, userId, expireAt }) => {
            setHoldSeats(prev => ({
                ...prev,
                [seatId]: { userId, expireAt }
            }))
        })

        socket.on("seatHoldRelease", ({ seatId }) => {
            setHoldSeats(prev => {
                const newHold = { ...prev }
                delete newHold[seatId]
                return newHold
            })
        })

        socket.on("seatBookedUpdate", ({ seatIds }) => {
            setHoldSeats(prev => {
                const newHold = { ...prev }
                seatIds.forEach(id => {
                    newHold[id] = { ...(newHold[id] || {}), booked: true }
                })
                return newHold
            })
        })

        return () => {
            socket.emit("leaveScreeningRoom", { screeningId })
            socket.off("seatHoldUpdate")
            socket.off("seatHoldRelease")
            socket.off("seatBookedUpdate")
        }
    }, [synthesizeData, screeningId])

    useEffect(() => {
        let timer
        if (quantity > 0) {
            setCountdown(300)
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        const seatBookeds = JSON.parse(localStorage.getItem("seatBookeds")) || []
                        seatBookeds.forEach(seatId => {
                            socket.emit("releaseSeatHold", { screeningId, seatId })
                        })
                        localStorage.removeItem("seatBookeds")
                        setQuantity(0)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [quantity, screeningId])

    const sortedSeats = synthesizeData && synthesizeData.seats ? synthesizeData.seats.sort((x, y) => {
        if (x.rowSeat !== y.rowSeat) {
            return x.rowSeat.localeCompare(y.rowSeat)
        }

        return parseInt(x.seatNumber) - parseInt(y.seatNumber)
    }) : []

    const handleSeatClick = (event, seat) => {
        const seatTarget = event.target
        const seatId = seat._id

        if (!seatTarget.classList.contains("seat-booked") && !seatTarget.classList.contains("seat-hold")) {
            const seatBookeds = JSON.parse(localStorage.getItem("seatBookeds")) || []

            if (seatTarget.classList.contains("seat-choice")) {
                seatTarget.classList.remove("seat-choice")
                const index = seatBookeds.indexOf(seatId)
                if (index > -1) {
                    seatBookeds.splice(index, 1)
                    socket.emit("releaseSeatHold", { screeningId, seatId })
                }
            } else {
                seatTarget.classList.add("seat-choice")
                seatBookeds.push(seatId)
                socket.emit("holdSeat", {
                    screeningId,
                    seatId,
                    userId: customerId,
                    holdTime: 300
                })
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
        const waterCornCombos = JSON.parse(localStorage.getItem("waterCornCombos")) || []

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
            const bookingData = await newBooking(
                screeningId,
                seats,
                customerId,
                waterCornCombos,
                selectedPromotion ? selectedPromotion.discountCode : null
            )
            const bookingId = bookingData.booking._id

            dispatch(customerActions.addBooking(bookingData.booking))
            dispatch(customerActions.setRatingPoints(seats.length * 5))
            socket.emit("bookSeats", { screeningId, seatIds: seats })
            navigate(`/booking/${bookingId}/detail`)
            toast.success(t("seatDiagram.toastSuccess"))
            handleRemoveLocalStorage()
        } catch (err) {
            console.error(err)
            toast.error(t("seatDiagram.toastError"))
            setIsLoading(false)
        }
    }

    const formatCountdown = (sec) => {
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
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

                <Box display={"flex"}>
                    <Box width={780} margin={"0 auto"}>
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
                            {sortedSeats.map((seat) => {
                                const isBooked = seat.selected === true
                                const isBookedBySocket = !seat.selected && holdSeats[seat._id] && holdSeats[seat._id].booked
                                const isHold = holdSeats[seat._id] && holdSeats[seat._id].userId !== customerId && !holdSeats[seat._id].booked
                                const isChoice = (JSON.parse(localStorage.getItem("seatBookeds")) || []).includes(seat._id)
                                let seatClass = "seat-item"
                                if (isBooked || isBookedBySocket) seatClass += " seat-booked"
                                else if (isHold) seatClass += " seat-hold"
                                else if (isChoice) seatClass += " seat-choice"
                                return (
                                    <div
                                        key={seat._id}
                                        className={seatClass}
                                        onClick={(e) => {
                                            setPrice(synthesizeData.price)
                                            handleSeatClick(e, seat)
                                        }}
                                    >
                                        {`${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`}
                                    </div>
                                )
                            })}
                        </Box>

                        <Box className="seat-note">
                            <Box className="seat-note__item">
                                <div className="seat-color not-booked"></div>:
                                <Typography className="text-caption">{t("seatDiagram.seatNotBooked")}</Typography>
                            </Box>

                            <Box className="seat-note__item">
                                <div className="seat-color booked"></div>:
                                <Typography className="text-caption">{t("seatDiagram.seatBooked")}</Typography>
                            </Box>

                            <Box className="seat-note__item">
                                <div className="seat-color choice"></div>:
                                <Typography className="text-caption">{t("seatDiagram.seatChoice")}</Typography>
                            </Box>

                            <Box className="seat-note__item">
                                <div className="seat-color hold"></div>:
                                <Typography className="text-caption">{t("seatDiagram.seatHold")}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box width={"calc(100% - 780px)"} margin={"16px auto 0"}>
                        <Box className="seat-fee">
                            <Typography textAlign={"center"} variant="h6" marginBottom={2}>
                                {t("seatDiagram.bookingInfo")}
                            </Typography>

                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.seatHoldTime")}:</span>
                                <span
                                    style={{
                                        color: (quantity > 0 && countdown <= 60) ? "#e50914" : undefined,
                                        fontWeight: (quantity > 0 && countdown <= 60) ? "bold" : undefined
                                    }}
                                >
                                    {quantity > 0 ? formatCountdown(countdown) : "00:00"}
                                </span>
                            </Typography>
                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.unitPrice")}:</span>
                                <span>{price}</span>
                            </Typography>
                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.quantity")}:</span>
                                <span>{quantity}</span>
                            </Typography>
                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.seatMoney")}:</span>
                                <span>{price * quantity}</span>
                            </Typography>

                            <Button
                                className="open-combo-btn"
                                fullWidth
                                onClick={() => setIsOpenCombo(true)}
                            >
                                {t("seatDiagram.selectCornWater")}
                            </Button>
                            <Typography className="seat-fee__item">
                                <span>{t("cinemaTicket.waterCornCombosMoney")}:</span>
                                <span>{waterCornComboMoney ? waterCornComboMoney : 0}</span>
                            </Typography>

                            <Autocomplete
                                options={promotionPrograms}
                                getOptionLabel={(option) => option.discountCode}
                                onChange={(e, val) => setSelectedPromotion(val)}
                                renderOption={(props, option, { inputValue }) => (
                                    <Box
                                        {...props}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "8px",
                                            backgroundColor: "#1a1b1e !important",
                                            "&:hover": { backgroundColor: "#2f3032 !important" },
                                        }}
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}${option.image}`}
                                            alt={option.discountCode}
                                            style={{
                                                width: "100px",
                                                height: "50px",
                                                marginRight: "10px",
                                            }}
                                        />
                                        <Box>
                                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>
                                                {highlightOption(option.discountCode, inputValue)}
                                            </Typography>
                                            <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                                                {t("cinemaTicket.reduce").toUpperCase()} {option.percentReduction}%
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px", color: "#ccc" }}>
                                                HSD: {option.endDate}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("seatDiagram.searchVoucher")}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                backgroundColor: "transparent",
                                                color: "#fff",
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "#fff",
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#fff",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#fff",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#fff",
                                                },
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: "#fff",
                                            },
                                        }}
                                    />
                                )}
                                sx={{
                                    marginTop: 2,
                                    marginBottom: 2,
                                    "& .MuiAutocomplete-listbox": {
                                        backgroundColor: "#1a1b1e",
                                        color: "#fff",
                                    },
                                    "& .MuiAutocomplete-option": {
                                        "&[aria-selected='true']": {
                                            color: "#e50914",
                                        },
                                    },
                                }}
                            />

                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.preferentialMoney")}:</span>
                                <span>{amountDecreases === 0 ? 0 : `-${amountDecreases}`}</span>
                            </Typography>
                            <Typography className="seat-fee__item">
                                <span>{t("seatDiagram.totalMoney")}:</span>
                                <span>{totalMoney}</span>
                            </Typography>

                            <Box display={"flex"} justifyContent={"center"} marginTop={2}>
                                <Button className="btn" fontSize={"1.5rem"} onClick={() => {
                                    if (isCustomerLoggedIn) {
                                        setIsLoading(true)
                                        handleBookNowClick()
                                    } else if (isManagerLoggedIn) {
                                        toast.warn(t("seatDiagram.toastWarnStaff"))
                                    } else {
                                        localStorage.setItem("screeningId", screeningId)
                                        localStorage.setItem("movieSlug", movieSlug)
                                        toast.info(t("seatDiagram.toastInfoLogIn"))
                                        navigate("/login")
                                    }
                                }}>
                                    {t("seatDiagram.bookNow")}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <WaterCornCombo
                    cinemaId={synthesizeData.cinemaId}
                    open={isOpenCombo}
                    onClose={() => setIsOpenCombo(false)}
                />
            </Box> : <Loading />}
        </>
    )
}

export default SeatDiagram