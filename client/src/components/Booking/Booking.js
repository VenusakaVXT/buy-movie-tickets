import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { getEndTime } from "../../util"
import {
    getMovieDetail,
    getApiFromBE,
    getScreeningsByMovie,
    getCurrentDateAnd8DaysLater,
    getScreeningsByDate,
    getScreeningsByCinema,
    getScreeningsByCinemaAndDate
} from "../../api/movieApi"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import "../../scss/App.scss"
import "../../scss/Booking.scss"

const Booking = () => {
    const [movie, setMovie] = useState()
    const [cinemas, setCinemas] = useState()
    const [dates, setDates] = useState([])
    const [screenings, setScreenings] = useState()
    const [selectedCinema, setSelectedCinema] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const slug = useParams().slug
    const navigate = useNavigate()

    useEffect(() => {
        getMovieDetail(slug)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.error(err))
    }, [slug])

    useEffect(() => {
        getApiFromBE("cinema")
            .then((data) => setCinemas(data.cinemas))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        getCurrentDateAnd8DaysLater()
            .then((data) => setDates(data.dates))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        setIsLoading(true)

        getScreeningsByMovie(slug)
            .then((res) => setScreenings(res.screenings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [slug])

    const handleSelectActive = (target, queryClass) => {
        document.querySelectorAll(queryClass).forEach((item) => {
            if (item !== target) {
                item.classList.remove("active")
            }
        })
        target.classList.add("active")
    }

    const renderAllScreenings = () => {
        getScreeningsByMovie(slug)
            .then((res) => setScreenings(res.screenings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }

    const handleSelectCinema = (event, cinemaId) => {
        const { target } = event

        handleSelectActive(target, ".cinema__list .cinema__item")
        setSelectedCinema(cinemaId)
        setIsLoading(true)

        if (cinemaId && selectedDate) {
            getScreeningsByCinemaAndDate(slug, selectedDate, cinemaId)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (cinemaId) {
            getScreeningsByCinema(cinemaId, slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (selectedDate) {
            getScreeningsByDate(slug, selectedDate)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else {
            renderAllScreenings()
        }
    }

    const handleSelectDate = (event, date) => {
        const { target } = event

        handleSelectActive(target, ".lst-dates .date-item")
        setSelectedDate(date)
        setIsLoading(true)

        if (date && selectedCinema) {
            getScreeningsByCinemaAndDate(slug, date, selectedCinema)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (date) {
            getScreeningsByDate(slug, date)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (selectedCinema) {
            getScreeningsByCinema(selectedCinema, slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else {
            renderAllScreenings()
        }
    }

    return (
        <>
            {movie &&
                <Box className="booking__wrapper">
                    <Box className="breadcrumb" margin={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            Home
                        </Typography>
                        <Typography className="breadcrumb__item disable">All Screenings</Typography>
                        <Typography className="breadcrumb__item">{movie.title}</Typography>
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>Select cinema</Typography>

                    <Box className="cinema__list">
                        <Typography className="cinema__item active" onClick={(e) => {
                            handleSelectCinema(e, "")
                        }}>
                            All Cinemas
                        </Typography>

                        {cinemas.map((cinema) => (
                            <Typography key={cinema._id} className="cinema__item" onClick={(e) => {
                                handleSelectCinema(e, cinema._id)
                            }}>
                                {cinema.name}
                            </Typography>
                        ))}
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>Select date</Typography>

                    <Box className="lst-dates">
                        <Typography className="date-item active" onClick={(e) => {
                            handleSelectDate(e, "")
                        }}>
                            All Days
                        </Typography>

                        {dates.map((date) => (
                            <Typography key={date} className="date-item" onClick={(e) => {
                                handleSelectDate(e, date)
                            }}>
                                {date}
                            </Typography>
                        ))}
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>Movie screenings:</Typography>

                    <Box className="screening__list">
                        {isLoading ? <Box mb={12}><Box className="loading-spinner"></Box></Box> :
                            screenings && screenings.length !== 0 ? screenings.map((screening) => (
                                <Box className="screening__item" key={screening._id} onClick={() =>
                                    navigate(`/booking/${slug}/${screening._id}`)
                                }>
                                    <Box>
                                        <Typography>Movie Date</Typography>
                                        <Typography>{screening.movieDate}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>Start Time</Typography>
                                        <Typography>{screening.timeSlot}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>End Time</Typography>
                                        <Typography>{getEndTime(screening.timeSlot, movie.time)}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>Cinema Room</Typography>
                                        <Typography>{screening.cinemaRoom.roomNumber}</Typography>
                                    </Box>
                                </Box>
                            )) :
                                <NoDataComponent content={"Sorry!!! No screenings found for this movie :/"} />}
                    </Box>
                </Box>
            }
        </>
    )
}

export default Booking